# users/views.py
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.shortcuts import redirect
from django.http import JsonResponse


# 1. Register User
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists'}, status=400)
    
    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user)
    return Response({'message': 'User registered successfully'}, status=201)

# 2. Login User
@api_view(['GET', 'POST'])   
def login_user(request):
    username = request.data.get('username') or request.GET.get('username')
    password = request.data.get('password') or request.GET.get('password')

    # if no data provided, just show a message for clarity
    if not username or not password:
        return Response({'info': 'Send username and password via POST or GET to log in.'})

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'})
    else:
        return Response({'error': 'Invalid credentials'}, status=401)


# 3. Info Page (Get Profile Data)
@api_view(['GET', 'POST'])
def user_info(request):
    # If the user is not logged in
    if not request.user.is_authenticated:
        # For browser GET → return JSON instead of DRF template
        return JsonResponse({'error': 'User not logged in'}, status=401)

    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

    serializer = UserProfileSerializer(profile)

    # Always return JsonResponse so browser GET won't look for templates
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET', 'POST'])
def exit_session(request):
    """Logout the current user or show a friendly message."""
    # If the user is logged in, log them out
    if request.user.is_authenticated:
        logout(request)

    # If it’s a browser GET, just redirect to home
    if request.method == 'GET':
        return redirect('/')          

    # If it’s an API POST (from Postman or frontend)
    return Response({'message': 'Session terminated successfully'})

