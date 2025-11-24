# backend/api/game_serializers.py
from rest_framework import serializers
from .models import (
    CustomUser, Habit, HabitCompletion, Achievement,
    UserAchievement, Equipment, UserEquipment, DailyCheckIn,
    Enemy
)

class EnemySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enemy
        fields = ['id', 'name', 'level', 'base_hp', 'base_damage', 'sprite_path', 'xp_reward', 'gold_reward']

class UserStatsSerializer(serializers.ModelSerializer):
    """Serializer for user game stats with equipment bonuses"""
    strength = serializers.SerializerMethodField()
    intelligence = serializers.SerializerMethodField()
    creativity = serializers.SerializerMethodField()
    social = serializers.SerializerMethodField()
    health = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'level', 'current_hp', 'max_hp', 'current_xp', 'next_level_xp',
            'strength', 'intelligence', 'creativity', 'social', 'health',
            'strength_xp', 'intelligence_xp', 'creativity_xp', 'social_xp', 'health_xp',
            'selected_character', 'selected_theme'
        ]

    def _get_total_stat(self, user, stat_name):
        """Calculate total stat including equipment bonuses"""
        base_stat = getattr(user, stat_name)

        # Get all equipped items and sum their bonuses for this stat
        equipped_items = UserEquipment.objects.filter(
            user=user,
            is_equipped=True
        ).select_related('equipment')

        total_bonus = 0
        for user_eq in equipped_items:
            stat_bonus = user_eq.equipment.stat_bonus or {}
            total_bonus += stat_bonus.get(stat_name, 0)

        return base_stat + total_bonus

    def get_strength(self, obj):
        return self._get_total_stat(obj, 'strength')

    def get_intelligence(self, obj):
        return self._get_total_stat(obj, 'intelligence')

    def get_creativity(self, obj):
        return self._get_total_stat(obj, 'creativity')

    def get_social(self, obj):
        return self._get_total_stat(obj, 'social')

    def get_health(self, obj):
        return self._get_total_stat(obj, 'health')


class HabitSerializer(serializers.ModelSerializer):
    completed_today = serializers.SerializerMethodField()
    last_completed_at = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'category', 'xp_reward',
            'frequency', 'streak', 'is_active', 'completed_today', 'last_completed_at'
        ]

    def get_completed_today(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return obj.completions.filter(
            completed_at__date=today,
            user=self.context['request'].user
        ).exists()

    def get_last_completed_at(self, obj):
        completion = obj.completions.filter(
            user=self.context['request'].user
        ).order_by('-completed_at').first()
        return completion.completed_at if completion else None


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
            'id', 'name', 'equipment_type', 'equipment_slot', 'sprite_path',
            'character_specific', 'description', 'stat_bonus', 'gold_cost', 'unlock_requirement',
            'is_unlocked', 'is_equipped'
        ]
    
    def get_is_unlocked(self, obj):
        user = self.context['request'].user

        # Check if user has this equipment in their inventory
        has_equipment = UserEquipment.objects.filter(user=user, equipment=obj).exists()
        if has_equipment:
            return True

        # For character-specific appearance items (armor)
        if obj.equipment_slot == 'armor' and obj.character_specific:
            if obj.is_default:
                # Default appearances unlock when character is unlocked
                from api.game_views import get_available_characters
                available_chars = get_available_characters(user.level)
                char_ids = [c['id'] for c in available_chars if c['is_unlocked']]
                return obj.character_specific in char_ids
            else:
                # Non-default appearances unlock by level requirement
                return self._check_level_requirement(obj.unlock_requirement, user.level)

        # For themes, unlock based on level requirement
        if obj.equipment_type == 'theme':
            if obj.is_default:
                return True
            return self._check_level_requirement(obj.unlock_requirement, user.level)

        return False

    def _check_level_requirement(self, unlock_requirement, user_level):
        """Check if user meets level requirement from unlock_requirement string"""
        if 'Level 3' in unlock_requirement:
            return user_level >= 3
        elif 'Level 2' in unlock_requirement:
            return user_level >= 2
        elif 'Level 1' in unlock_requirement:
            return user_level >= 1
        return False
    
    def get_is_equipped(self, obj):
        user = self.context['request'].user
        user_equipment = UserEquipment.objects.filter(user=user, equipment=obj).first()
        return user_equipment.is_equipped if user_equipment else False


class DailyCheckInSerializer(serializers.ModelSerializer):
    """Serializer for daily check-ins"""
    checked_in_date = serializers.DateField(source='checked_in_at', read_only=True)

    class Meta:
        model = DailyCheckIn
        fields = ['id', 'checked_in_at', 'checked_in_date', 'xp_earned']


class CompleteHabitSerializer(serializers.Serializer):
    habit_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)