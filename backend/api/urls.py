# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import health, user_profile, AdminUserViewSet

# Create router for viewsets
router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path("health/", health),
    path("profile/", user_profile),  # Test endpoint for authenticated users
    path("", include(router.urls)),  # Include router URLs
]