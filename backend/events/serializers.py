# events/serializers.py
from rest_framework import serializers
from .models import UserProfile, Event


class UserProfileSerializer(serializers.ModelSerializer):
    # Read-only field for the linked Django user id
    user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "user_id", "name", "age", "country", "culture", "picture"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "culture",
            "location",
            "place",
            "start_date",
            "end_date",
            "is_favorite",
            "attendees",
        ]
