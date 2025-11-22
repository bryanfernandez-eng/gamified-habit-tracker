# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health, user_profile, change_password, update_display_name,
    create_initial_habits, AdminUserViewSet
)
from .game_views import (
    UserStatsViewSet, HabitViewSet,
    AchievementViewSet, EquipmentViewSet, DailyCheckInViewSet
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'game/stats', UserStatsViewSet, basename='game-stats')
router.register(r'game/habits', HabitViewSet, basename='game-habits')
router.register(r'game/achievements', AchievementViewSet, basename='game-achievements')
router.register(r'game/equipment', EquipmentViewSet, basename='game-equipment')
router.register(r'game/daily-checkin', DailyCheckInViewSet, basename='game-daily-checkin')

urlpatterns = [
    path("health/", health),
    path("profile/", user_profile),
    path("change-password/", change_password),
    path("update-display-name/", update_display_name),
    path("create-initial-habits/", create_initial_habits),
    path("", include(router.urls)),
]