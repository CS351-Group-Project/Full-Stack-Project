# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('info/', views.user_info),
    path('exit/', views.exit_session),
]
