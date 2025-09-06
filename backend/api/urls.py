# backend/api/urls.py
from django.urls import path
from .views import health, user_profile

urlpatterns = [
    path("health/", health),
    path("profile/", user_profile),  # Test endpoint for authenticated users
]