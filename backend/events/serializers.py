# events/serializers.py
from rest_framework import serializers
from .models import UserProfile, Event


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'age', 'country', 'culture', 'picture']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'culture',
            'location',
            'place',
            'start_date',
            'end_date',
            'is_favorite',
            'attendees',
        ]
