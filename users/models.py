# users/models.py
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    cultural_events_interested = models.TextField(blank=True)

    def __str__(self):
        return self.user.username
