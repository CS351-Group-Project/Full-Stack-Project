# events/admin.py
from django.contrib import admin
from .models import UserProfile, Event


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "country", "culture")
    search_fields = ("user__username", "name", "country", "culture")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "culture", "location", "start_date", "end_date", "is_favorite")
    list_filter = ("culture", "location", "is_favorite")
    search_fields = ("title", "description", "location", "culture")