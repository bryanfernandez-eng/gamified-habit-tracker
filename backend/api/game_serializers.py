# backend/api/game_serializers.py
from rest_framework import serializers
from .models import (
    CustomUser, Habit, HabitCompletion, Achievement, 
    UserAchievement, Equipment, UserEquipment
)

class UserStatsSerializer(serializers.ModelSerializer):
    """Serializer for user game stats"""
    class Meta:
        model = CustomUser
        fields = [
            'level', 'current_hp', 'max_hp', 'current_xp', 'next_level_xp',
            'strength', 'intelligence', 'creativity', 'social', 'health',
            'strength_xp', 'intelligence_xp', 'creativity_xp', 'social_xp', 'health_xp'
        ]


class HabitSerializer(serializers.ModelSerializer):
    completed_today = serializers.SerializerMethodField()
    
    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'category', 'xp_reward', 
            'frequency', 'streak', 'is_active', 'completed_today'
        ]
    
    def get_completed_today(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return obj.completions.filter(
            completed_at__date=today,
            user=self.context['request'].user
        ).exists()


class HabitCompletionSerializer(serializers.ModelSerializer):
    habit_name = serializers.CharField(source='habit.name', read_only=True)
    
    class Meta:
        model = HabitCompletion
        fields = ['id', 'habit', 'habit_name', 'completed_at', 'xp_earned', 'notes']
        read_only_fields = ['xp_earned']


class AchievementSerializer(serializers.ModelSerializer):
    user_progress = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'requirement_type', 'requirement_value',
            'requirement_category', 'reward_xp', 'reward_description', 'icon',
            'user_progress', 'is_unlocked'
        ]
    
    def get_user_progress(self, obj):
        user = self.context['request'].user
        user_achievement = UserAchievement.objects.filter(user=user, achievement=obj).first()
        return user_achievement.progress if user_achievement else 0
    
    def get_is_unlocked(self, obj):
        user = self.context['request'].user
        return UserAchievement.objects.filter(
            user=user, 
            achievement=obj, 
            progress__gte=obj.requirement_value
        ).exists()


class EquipmentSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    is_equipped = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'equipment_type', 'description', 'stat_bonus',
            'unlock_requirement', 'is_unlocked', 'is_equipped'
        ]
    
    def get_is_unlocked(self, obj):
        user = self.context['request'].user
        return UserEquipment.objects.filter(user=user, equipment=obj).exists()
    
    def get_is_equipped(self, obj):
        user = self.context['request'].user
        user_equipment = UserEquipment.objects.filter(user=user, equipment=obj).first()
        return user_equipment.is_equipped if user_equipment else False


class CompleteHabitSerializer(serializers.Serializer):
    habit_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)