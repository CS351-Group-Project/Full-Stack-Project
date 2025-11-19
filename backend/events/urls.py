# events/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserProfileViewSet,
    UserPictureUploadView,
    UserPictureServeView,
    EventViewSet,
)

router = DefaultRouter()
# These create:
# /api/user/info/           (POST, GET list if you add list later)
# /api/user/info/{id}/      (GET, PUT)
router.register(r"user/info", UserProfileViewSet, basename="user-info")

# These create:
# /api/events/              (GET list, POST)
# /api/events/{id}/         (GET, PUT)
# /api/events/recommended/  (GET)

from .views import (
    UserProfileViewSet,
    EventViewSet,
    UserPictureUploadView,
    UserPictureServeView,
    RegisterView,
    LoginView,
)


router.register(r"events", EventViewSet, basename="events")

urlpatterns = [
    # All router-generated routes
    path("", include(router.urls)),

    # Picture upload: POST /api/user/picture
    path("user/picture", UserPictureUploadView.as_view(), name="user-picture-upload"),

    # Picture serve: GET /api/user/picture/<filename>
    path(
        "user/picture/<str:filename>",
        UserPictureServeView.as_view(),
        name="user-picture-serve",
    ),
]

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
