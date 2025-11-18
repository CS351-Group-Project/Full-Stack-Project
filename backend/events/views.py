# events/views.py
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
    - GET /api/user/info/<id>/
    - POST /api/user/info/
    - PUT /api/user/info/<id>/
    """

    def retrieve(self, request, pk=None):
        # GET /api/user/info/<id>/
        user = get_object_or_404(UserProfile, pk=pk)
        serializer = UserProfileSerializer(user)
        return Response({"success": True, "user": serializer.data})

    def create(self, request):
        # POST /api/user/info/
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"success": True, "user": UserProfileSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def update(self, request, pk=None):
        # PUT /api/user/info/<id>/
        user = get_object_or_404(UserProfile, pk=pk)
        serializer = UserProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"success": True, "user": UserProfileSerializer(user).data})
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserPictureUploadView(APIView):
    """
    POST /api/user/picture
    Body: form-data with field 'picture' (file)
    """

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # For simplicity, assume a single user with id=1
        user, _ = UserProfile.objects.get_or_create(
            id=1,
            defaults={
                "name": "User",
                "age": 20,
                "country": "Unknown",
                "culture": "Unknown",
            },
        )

        picture = request.FILES.get("picture")
        if not picture:
            return Response(
                {"success": False, "error": "No picture uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.picture = picture
        user.save()
        return Response({"success": True, "user": UserProfileSerializer(user).data})



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

        Uses:
        - BloomFilter to quickly check if any events exist for (culture, location)
        - BinaryHeapPriorityQueue to rank events by a score
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

        # 1) Build Bloom filter with all (culture, location) combos
        count = max(1, all_events.count())
        bloom = BloomFilter(expected_items=count, false_positive_rate=0.01)

        for ev in all_events:
            key = f"{ev.culture.lower()}|{ev.location.lower()}"
            bloom.add(key)

        # 2) Early rejection if this combination is definitely not present
        if culture and location:
            combo = f"{culture.lower()}|{location.lower()}"
            if combo not in bloom:
                return Response(
                    {
                        "events": [],
                        "note": "No events for this culture/location (Bloom filter negative)",
                    }
                )

        # 3) Filter candidates using simple DB filters
        qs = all_events
        if culture:
            qs = qs.filter(culture__iexact=culture)
        if location:
            qs = qs.filter(location__icontains=location)
        if target_date:
            qs = qs.filter(start_date__lte=target_date, end_date__gte=target_date)

        # 4) Rank candidates with priority queue (min-heap)
        pq = BinaryHeapPriorityQueue()
        today = date.today()

        def score(ev: Event) -> int:
            # Lower score = higher priority.
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

        Combines:
        - internal events (source='internal')
        - external events (source='external')
        Uses BinaryHeapPriorityQueue to prioritize our events.
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

        # 1) Internal events
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

        # 2) External events
        external_events = get_external_events(
            culture=culture,
            location=location,
            target_date=target_date,
        )

        # 3) Rank with priority queue
        pq = BinaryHeapPriorityQueue()

        def score_internal(ev: Event) -> int:
            days_diff = abs((ev.start_date - base_date).days)
            s = days_diff
            if ev.is_favorite:
                s -= 2
            s -= min(ev.attendees // 100, 5)
            # bonus so our events are given more priority
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
