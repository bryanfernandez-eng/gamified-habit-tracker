# backend/api/game_views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, F
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


class HabitViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HabitSerializer
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
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
        """Check and update achievement progress"""
        # Check streak achievements
        streak_achievements = Achievement.objects.filter(
            requirement_type='streak',
            requirement_category__in=['', habit.category]
        )
        
        for achievement in streak_achievements:
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement
            )
            
            if habit.streak >= achievement.requirement_value and user_achievement.progress < achievement.requirement_value:
                user_achievement.progress = achievement.requirement_value
                user_achievement.save()
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