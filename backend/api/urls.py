# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import health, user_profile, AdminUserViewSet
from .game_views import (
    UserStatsViewSet, HabitViewSet, 
    AchievementViewSet, EquipmentViewSet
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'game/stats', UserStatsViewSet, basename='game-stats')
router.register(r'game/habits', HabitViewSet, basename='game-habits')
router.register(r'game/achievements', AchievementViewSet, basename='game-achievements')
router.register(r'game/equipment', EquipmentViewSet, basename='game-equipment')

urlpatterns = [
    path("health/", health),
    path("profile/", user_profile),
    path("", include(router.urls)),
]