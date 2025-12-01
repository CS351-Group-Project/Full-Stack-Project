# events/views.py
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from datetime import date, datetime
import os

from .external_sources import get_external_events
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.encoding import smart_str
from django.views import View

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile, Event
from .serializers import UserProfileSerializer, EventSerializer
from .algorithms.priority_queue import BinaryHeapPriorityQueue
from .algorithms.bloom_filter import BloomFilter


class UserProfileViewSet(viewsets.ViewSet):
    """
    Handles:
    - GET /api/user/info/          (list all profiles)
    - GET /api/user/info/<id>/     (retrieve by profile id)
    - POST /api/user/info/         (create profile for a given user_id)
    - PUT /api/user/info/<id>/     (update profile)
    """

    def list(self, request):
        profiles = UserProfile.objects.select_related("user").all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response({"success": True, "users": serializer.data})

    def retrieve(self, request, pk=None):
        profile = get_object_or_404(UserProfile, pk=pk)
        serializer = UserProfileSerializer(profile)
        return Response({"success": True, "user": serializer.data})

    def create(self, request):
        """
        Expects:
        {
          "user_id": 1,
          "name": "...",
          "age": ...,
          "country": "...",
          "culture": "..."
        }
        """
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"success": False, "error": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, pk=user_id)

        if hasattr(user, "profile"):
            return Response(
                {"success": False, "error": "Profile already exists for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save(user=user)
            return Response(
                {"success": True, "user": UserProfileSerializer(profile).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def update(self, request, pk=None):
        profile = get_object_or_404(UserProfile, pk=pk)
        # partial=True allows sending only some fields
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(
                {"success": True, "user": UserProfileSerializer(profile).data}
            )
        # If invalid (e.g. age not a number), return details
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )



class UserPictureUploadView(APIView):
    """
    POST /api/user/picture

    Body: form-data with fields:
      - 'picture' (file)
      - 'user_id' (int)  <-- which auth user this picture belongs to
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response(
                {"success": False, "error": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, pk=user_id)
        profile = getattr(user, "profile", None)
        if profile is None:
            return Response(
                {"success": False, "error": "Profile does not exist for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        picture = request.FILES.get("picture")
        if not picture:
            return Response(
                {"success": False, "error": "No picture uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile.picture = picture
        profile.save()
        return Response({"success": True, "user": UserProfileSerializer(profile).data})


class UserPictureServeView(View):
    """
    GET /api/user/picture/<filename>
    Returns the image binary.
    """

    def get(self, request, filename):
        filepath = os.path.join(settings.MEDIA_ROOT, "profiles", filename)
        if not os.path.exists(filepath):
            return HttpResponse(status=404)

        with open(filepath, "rb") as f:
            data = f.read()

        response = HttpResponse(data, content_type="image/jpeg")
        response["Content-Disposition"] = f'inline; filename="{smart_str(filename)}"'
        return response


class EventViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - GET /api/events/           (list, with optional filters)
    - GET /api/events/<id>/      (retrieve)
    - POST /api/events/          (create)
    - PUT /api/events/<id>/      (update)
    """

    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def list(self, request):
        qs = Event.objects.all()

        culture = request.query_params.get("culture")
        location = request.query_params.get("location")
        date_str = request.query_params.get("date")  # YYYY-MM-DD

        if culture:
            qs = qs.filter(culture__iexact=culture)
        if location:
            qs = qs.filter(location__icontains=location)

        if date_str:
            try:
                d = datetime.strptime(date_str, "%Y-%m-%d").date()
                qs = qs.filter(start_date__lte=d, end_date__gte=d)
            except ValueError:
                pass  # ignore invalid date

        serializer = EventSerializer(qs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def create(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(
                EventSerializer(event).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(EventSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="recommended")
    def recommended(self, request):
        """
        GET /api/events/recommended/?culture=...&location=...&date=YYYY-MM-DD&limit=10
        """
        culture = request.query_params.get("culture")
        location = request.query_params.get("location")
        date_str = request.query_params.get("date")
        target_date = None
        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                target_date = None

        all_events = Event.objects.all()

        count = max(1, all_events.count())
        bloom = BloomFilter(expected_items=count, false_positive_rate=0.01)

        for ev in all_events:
            key = f"{ev.culture.lower()}|{ev.location.lower()}"
            bloom.add(key)

        if culture and location:
            combo = f"{culture.lower()}|{location.lower()}"
            if combo not in bloom:
                return Response(
                    {
                        "events": [],
                        "note": "No events for this culture/location (Bloom filter negative)",
                    }
                )

        qs = all_events
        if culture:
            qs = qs.filter(culture__iexact=culture)
        if location:
            qs = qs.filter(location__icontains=location)
        if target_date:
            qs = qs.filter(start_date__lte=target_date, end_date__gte=target_date)

        pq = BinaryHeapPriorityQueue()
        today = date.today()

        def score(ev: Event) -> int:
            base_date = target_date or today
            days_diff = abs((ev.start_date - base_date).days)

            s = days_diff
            if ev.is_favorite:
                s -= 2
            s -= min(ev.attendees // 100, 5)
            return s

        for ev in qs:
            pq.push(score(ev), ev)

        limit = int(request.query_params.get("limit", 10))
        best = []
        while len(pq) > 0 and len(best) < limit:
            best.append(pq.pop())

        serializer = EventSerializer(best, many=True)
        return Response({"events": serializer.data})

    @action(detail=False, methods=["get"], url_path="explore")
    def explore(self, request):
        """
        GET /api/events/explore/?culture=...&location=...&date=YYYY-MM-DD&limit=10
        """
        culture = request.query_params.get("culture")
        location = request.query_params.get("location")
        date_str = request.query_params.get("date")
        target_date = None
        if date_str:
            try:
                target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                target_date = None

        base_date = target_date or date.today()

        internal_qs = Event.objects.all()
        if culture:
            internal_qs = internal_qs.filter(culture__iexact=culture)
        if location:
            internal_qs = internal_qs.filter(location__icontains=location)
        if target_date:
            internal_qs = internal_qs.filter(
                start_date__lte=target_date,
                end_date__gte=target_date,
            )

        external_events = get_external_events(
            culture=culture,
            location=location,
            target_date=target_date,
        )

        pq = BinaryHeapPriorityQueue()

        def score_internal(ev: Event) -> int:
            days_diff = abs((ev.start_date - base_date).days)
            s = days_diff
            if ev.is_favorite:
                s -= 2
            s -= min(ev.attendees // 100, 5)
            s -= 5
            return s

        def score_external(ev_dict: dict) -> int:
            days_diff = abs((ev_dict["start_date"] - base_date).days)
            s = days_diff
            s -= min(ev_dict["attendees"] // 100, 5)
            return s

        for ev in internal_qs:
            pq.push(score_internal(ev), ("internal", ev))

        for ext in external_events:
            pq.push(score_external(ext), ("external", ext))

        limit = int(request.query_params.get("limit", 10))
        combined = []

        while len(pq) > 0 and len(combined) < limit:
            source, obj = pq.pop()

            if source == "internal":
                data = EventSerializer(obj).data
                data["source"] = "internal"
                data["external_url"] = None
            else:
                data = {
                    "id": None,
                    "title": obj["title"],
                    "description": obj["description"],
                    "culture": obj["culture"],
                    "location": obj["location"],
                    "place": obj["place"],
                    "start_date": obj["start_date"].isoformat(),
                    "end_date": obj["end_date"].isoformat(),
                    "is_favorite": False,
                    "attendees": obj["attendees"],
                    "source": "external",
                    "external_url": obj["external_url"],
                }

            combined.append(data)

        return Response({"events": combined})




@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(APIView):
    """
    POST /api/auth/register

    Body JSON:
    {
      "username": "...",
      "password": "...",
      "age": 21,               # optional
      "country": "India",      # optional
      "culture": "South Indian" # optional
    }
    """

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        age = request.data.get("age")
        country = request.data.get("country") or "Unknown"
        culture = request.data.get("culture") or "Unknown"

        # Basic validation
        if not username or not password:
            return Response(
                {"success": False, "error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(username) < 3:
            return Response(
                {"success": False, "error": "Username must be at least 3 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 6:
            return Response(
                {"success": False, "error": "Password must be at least 6 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"success": False, "error": "Username is already taken."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        user = User(username=username)
        user.set_password(password)
        user.save()

        # Normalize age
        try:
            age_value = int(age) if age is not None else 18
        except (TypeError, ValueError):
            age_value = 18

        # Create profile using provided fields (or defaults)
        profile = UserProfile.objects.create(
            user=user,
            name=username,
            age=age_value,
            country=country,
            culture=culture,
        )

        return Response(
            {
                "success": True,
                "message": "User registered successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "profile": UserProfileSerializer(profile).data,
                },
            },
            status=status.HTTP_201_CREATED,
        )

@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    """
    POST /api/auth/login
    Body JSON: { "username": "...", "password": "..." }

    Returns success flag and basic user info if credentials are valid.
    """

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"success": False, "error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {"success": False, "error": "Invalid username or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = getattr(user, "profile", None)
        profile_data = UserProfileSerializer(profile).data if profile else None

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "profile": profile_data,
                },
            }
        )
