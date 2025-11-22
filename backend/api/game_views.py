# backend/api/game_views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, F, Q
from .models import (
    Habit, HabitCompletion, Achievement, 
    UserAchievement, Equipment, UserEquipment
)
from .game_serializers import (
    UserStatsSerializer, HabitSerializer, HabitCompletionSerializer,
    AchievementSerializer, EquipmentSerializer, CompleteHabitSerializer
)

class UserStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Get current user's game stats"""
        serializer = UserStatsSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def detailed(self, request):
        """Get detailed stats with recent completions"""
        user = request.user
        stats = UserStatsSerializer(user).data

        # Get recent habit completions
        recent_completions = HabitCompletion.objects.filter(
            user=user
        ).select_related('habit')[:10]

        # Get completion stats by category
        category_stats = Habit.objects.filter(user=user).values('category').annotate(
            total_habits=Count('id'),
            total_completions=Count('completions'),
            total_xp=Sum('completions__xp_earned')
        )

        return Response({
            'stats': stats,
            'recent_completions': HabitCompletionSerializer(recent_completions, many=True).data,
            'category_stats': category_stats
        })

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get global leaderboard sorted by level and XP"""
        from django.contrib.auth import get_user_model
        User = get_user_model()

        # Get all users sorted by level (descending) then XP (descending)
        users = User.objects.all().order_by('-level', '-current_xp')

        leaderboard_data = []
        for rank, user in enumerate(users, 1):
            leaderboard_data.append({
                'rank': rank,
                'id': user.id,
                'username': user.username,
                'display_name': user.display_name or user.username,
                'level': user.level,
                'current_xp': user.current_xp,
                'next_level_xp': user.next_level_xp,
                'max_hp': user.max_hp,
                'current_hp': user.current_hp,
                'strength': user.strength,
                'intelligence': user.intelligence,
                'creativity': user.creativity,
                'social': user.social,
                'health': user.health,
            })

        return Response(leaderboard_data)


class HabitViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HabitSerializer
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure user can only update their own habits"""
        habit = self.get_object()
        if habit.user != self.request.user:
            raise PermissionError("You can only edit your own habits")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """Soft delete - set is_active to False"""
        habit = self.get_object()
        if habit.user != request.user:
            return Response(
                {'error': 'You can only delete your own habits'},
                status=status.HTTP_403_FORBIDDEN
            )
        habit.is_active = False
        habit.save()
        return Response(
            {'message': 'Habit deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=['post'])
    def complete(self, request):
        """Mark a habit as complete"""
        serializer = CompleteHabitSerializer(data=request.data)
        if serializer.is_valid():
            habit_id = serializer.validated_data['habit_id']
            notes = serializer.validated_data.get('notes', '')
            
            try:
                habit = Habit.objects.get(id=habit_id, user=request.user)
                
                # Check if already completed today
                today = timezone.now().date()
                if HabitCompletion.objects.filter(
                    habit=habit,
                    user=request.user,
                    completed_at__date=today
                ).exists():
                    return Response(
                        {'error': 'Habit already completed today'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create completion record
                completion = HabitCompletion.objects.create(
                    habit=habit,
                    user=request.user,
                    xp_earned=habit.xp_reward,
                    notes=notes
                )
                
                # Check for achievement progress
                self._check_achievements(request.user, habit)
                
                return Response({
                    'message': 'Habit completed successfully',
                    'xp_earned': completion.xp_earned,
                    'new_streak': habit.streak,
                    'user_stats': UserStatsSerializer(request.user).data
                })
                
            except Habit.DoesNotExist:
                return Response(
                    {'error': 'Habit not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _check_achievements(self, user, habit):
        """Check and update achievement progress for all achievement types"""
        # Get all achievements to check against
        achievements = Achievement.objects.all()

        for achievement in achievements:
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement,
                defaults={'progress': 0}
            )

            # Skip if already unlocked
            if user_achievement.progress >= achievement.requirement_value:
                continue

            new_progress = user_achievement.progress
            unlocked = False

            # Check based on achievement type
            if achievement.requirement_type == 'streak':
                # Check if this habit's streak meets the requirement
                if not achievement.requirement_category or achievement.requirement_category == habit.category:
                    if habit.streak >= achievement.requirement_value:
                        new_progress = achievement.requirement_value
                        unlocked = True

            elif achievement.requirement_type == 'attribute_level':
                # Check if user has reached the required attribute level
                if hasattr(user, achievement.requirement_category):
                    attr_level = getattr(user, achievement.requirement_category)
                    if attr_level >= achievement.requirement_value:
                        new_progress = achievement.requirement_value
                        unlocked = True

            elif achievement.requirement_type == 'level':
                # Check if user has reached the required character level
                if user.level >= achievement.requirement_value:
                    new_progress = achievement.requirement_value
                    unlocked = True

            elif achievement.requirement_type == 'total_completions':
                # Check if user has completed the required number of habits
                total_completions = HabitCompletion.objects.filter(user=user).count()
                if total_completions >= achievement.requirement_value:
                    new_progress = achievement.requirement_value
                    unlocked = True

            # Update progress if it changed
            if new_progress != user_achievement.progress:
                user_achievement.progress = new_progress
                user_achievement.save()

                # Award XP if just unlocked
                if unlocked:
                    user.add_xp(achievement.reward_xp)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's habits with completion status"""
        habits = self.get_queryset()
        serializer = self.get_serializer(habits, many=True, context={'request': request})
        return Response(serializer.data)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['get'])
    def unlocked(self, request):
        """Get user's unlocked achievements"""
        unlocked = UserAchievement.objects.filter(
            user=request.user,
            progress=F('achievement__requirement_value')
        ).select_related('achievement')
        
        achievements = [ua.achievement for ua in unlocked]
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)


class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def equip(self, request, pk=None):
        """Equip or unequip an item"""
        equipment = self.get_object()
        
        try:
            user_equipment = UserEquipment.objects.get(
                user=request.user,
                equipment=equipment
            )
            
            # Toggle equipped status
            user_equipment.is_equipped = not user_equipment.is_equipped
            
            # Unequip other items of the same type if equipping
            if user_equipment.is_equipped:
                UserEquipment.objects.filter(
                    user=request.user,
                    equipment__equipment_type=equipment.equipment_type
                ).exclude(id=user_equipment.id).update(is_equipped=False)
            
            user_equipment.save()
            
            return Response({
                'message': f"{'Equipped' if user_equipment.is_equipped else 'Unequipped'} {equipment.name}",
                'is_equipped': user_equipment.is_equipped
            })
            
        except UserEquipment.DoesNotExist:
            return Response(
                {'error': 'Equipment not unlocked'},
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=False, methods=['get'])
    def equipped(self, request):
        """Get currently equipped items"""
        equipped = UserEquipment.objects.filter(
            user=request.user,
            is_equipped=True
        ).select_related('equipment')
        
        equipment_items = [ue.equipment for ue in equipped]
        serializer = self.get_serializer(equipment_items, many=True)
        return Response(serializer.data)