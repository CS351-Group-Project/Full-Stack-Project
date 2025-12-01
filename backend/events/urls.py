# events/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserProfileViewSet,
    EventViewSet,
    UserPictureUploadView,
    UserPictureServeView,
    RegisterView,
    LoginView,
)

router = DefaultRouter()
router.register(r"user/info", UserProfileViewSet, basename="user-info")
router.register(r"events", EventViewSet, basename="events")

urlpatterns = [
    path("", include(router.urls)),
    path("user/picture", UserPictureUploadView.as_view(), name="user-picture-upload"),
    path(
        "user/picture/<str:filename>",
        UserPictureServeView.as_view(),
        name="user-picture-serve",
    ),
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
]
