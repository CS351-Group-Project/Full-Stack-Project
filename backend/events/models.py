# events/models.py
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    # Each Django auth user gets one profile
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    country = models.CharField(max_length=100)
    culture = models.CharField(max_length=100)
    picture = models.ImageField(upload_to="profiles/", null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    culture = models.CharField(max_length=100)
    location = models.CharField(max_length=200)  # e.g. "Chicago, IL"
    place = models.CharField(max_length=200, blank=True)  # venue/place if you want

    start_date = models.DateField()
    end_date = models.DateField()

    is_favorite = models.BooleanField(default=False)
    attendees = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.culture})"
