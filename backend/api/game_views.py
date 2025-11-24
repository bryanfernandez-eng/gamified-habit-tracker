# backend/api/game_views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import random
from django.db.models import Count, Sum, F, Q
from .models import (
    Habit, HabitCompletion, Achievement,
    UserAchievement, Equipment, UserEquipment, DailyCheckIn,
    Enemy, TowerProgress
)
from .game_serializers import (
    UserStatsSerializer, HabitSerializer, HabitCompletionSerializer,
    AchievementSerializer, EquipmentSerializer, CompleteHabitSerializer,
    DailyCheckInSerializer, EnemySerializer
)


def get_max_quests_for_level(level):
    """
    Calculate the maximum number of quests a user can create based on their level.

    Progression:
    - Level 1-5: 4 quests
    - Level 6-10: 6 quests
    - Level 11-15: 8 quests
    - Level 16-20: 10 quests
    - Level 20+: Unlimited quests (return a large number)
    """
    if level >= 20:
        return 999  # Effectively unlimited
    elif level >= 16:
        return 10
    elif level >= 11:
        return 8
    elif level >= 6:
        return 6
    else:
        return 4


def get_available_characters(level):
    """
    Get available characters based on user level.

    Characters:
    - default: Available from level 1
    - zoro: Available from level 2
    """
    characters = [
        {'id': 'default', 'name': 'Default', 'unlock_level': 1}
    ]

    if level >= 2:
        characters.append({'id': 'zoro', 'name': 'Zoro', 'unlock_level': 2})

    return characters


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

    @action(detail=False, methods=['get'])
    def characters(self, request):
        """Get available characters based on user level"""
        characters = get_available_characters(request.user.level)
        return Response({
            'available_characters': characters,
            'current_character': request.user.selected_character
        })

    @action(detail=False, methods=['post'])
    def select_character(self, request):
        """Select a character for the user"""
        character_id = request.data.get('character_id')

        if not character_id:
            return Response(
                {'error': 'character_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify character is available for this user's level
        available = get_available_characters(request.user.level)
        available_ids = [c['id'] for c in available]

        if character_id not in available_ids:
            return Response(
                {'error': f'Character "{character_id}" is not available at level {request.user.level}'},
                status=status.HTTP_403_FORBIDDEN
            )

        request.user.selected_character = character_id
        request.user.save()

        # Handle character-specific weapons
        # 1. Unequip any character-specific weapons that don't match the new character
        UserEquipment.objects.filter(
            user=request.user,
            equipment__equipment_slot='weapon',
            equipment__character_specific__isnull=False
        ).exclude(
            equipment__character_specific=character_id
        ).update(is_equipped=False)

        # 2. If no weapon is currently equipped, equip "None"
        has_equipped_weapon = UserEquipment.objects.filter(
            user=request.user,
            equipment__equipment_slot='weapon',
            is_equipped=True
        ).exists()

        if not has_equipped_weapon:
            # Equip "None" weapon as fallback
            none_weapon = UserEquipment.objects.filter(
                user=request.user,
                equipment__name='None',
                equipment__equipment_slot='weapon'
            ).first()
            if none_weapon:
                none_weapon.is_equipped = True
                none_weapon.save()

        # 3. If no armor is currently equipped, equip "None" armor
        has_equipped_armor = UserEquipment.objects.filter(
            user=request.user,
            equipment__equipment_slot='armor',
            is_equipped=True
        ).exists()

        if not has_equipped_armor:
            # Equip "None" armor as fallback
            none_armor = UserEquipment.objects.filter(
                user=request.user,
                equipment__name='None',
                equipment__equipment_slot='armor'
            ).first()
            if none_armor:
                none_armor.is_equipped = True
                none_armor.save()

        return Response({
            'message': f'Character changed to {character_id}',
            'current_character': request.user.selected_character
        })

    @action(detail=False, methods=['post'])
    def select_theme(self, request):
        """Select a theme for the user"""
        theme_name = request.data.get('theme_name')

        if not theme_name:
            return Response(
                {'error': 'theme_name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the theme equipment item
        try:
            theme = Equipment.objects.get(name=theme_name, equipment_type='theme')
        except Equipment.DoesNotExist:
            return Response(
                {'error': f'Theme "{theme_name}" does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if user has unlocked this theme
        user_equipment = UserEquipment.objects.filter(
            user=request.user,
            equipment=theme
        ).exists()

        if not user_equipment:
            return Response(
                {'error': f'Theme "{theme_name}" is not unlocked'},
                status=status.HTTP_403_FORBIDDEN
            )

        request.user.selected_theme = theme_name
        request.user.save()

        return Response({
            'message': f'Theme changed to {theme_name}',
            'current_theme': request.user.selected_theme
        })


class HabitViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HabitSerializer
    
    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        # Check quest limit based on user level
        current_quests = Habit.objects.filter(
            user=self.request.user,
            is_active=True
        ).count()
        max_quests = get_max_quests_for_level(self.request.user.level)

        if current_quests >= max_quests:
            raise PermissionError(
                f"You can only have {max_quests} quests at level {self.request.user.level}. "
                f"Delete or complete a quest to create a new one. "
                f"Reach level {self._get_next_level_milestone()} for more quests."
            )

        serializer.save(user=self.request.user)

    def _get_next_level_milestone(self):
        """Get the next level where quest limit increases"""
        current_level = self.request.user.level
        if current_level < 6:
            return 6
        elif current_level < 11:
            return 11
        elif current_level < 16:
            return 16
        elif current_level < 20:
            return 20
        return current_level + 1

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
    def check_limit(self, request):
        """Check current quest limit and usage for the user"""
        current_quests = Habit.objects.filter(
            user=request.user,
            is_active=True
        ).count()
        max_quests = get_max_quests_for_level(request.user.level)

        # Get next level milestone
        next_level = 6 if request.user.level < 6 else (
            11 if request.user.level < 11 else (
                16 if request.user.level < 16 else (
                    20 if request.user.level < 20 else request.user.level + 1
                )
            )
        )

        return Response({
            'current_quests': current_quests,
            'max_quests': max_quests,
            'can_create': current_quests < max_quests,
            'current_level': request.user.level,
            'next_level_milestone': next_level,
            'quests_remaining': max(0, max_quests - current_quests)
        })

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

            # If equipping, unequip other items in the same slot
            if user_equipment.is_equipped:
                # For weapons/slots, unequip other items in the same slot
                if equipment.equipment_slot and equipment.equipment_slot != 'accessory':
                    UserEquipment.objects.filter(
                        user=request.user,
                        equipment__equipment_slot=equipment.equipment_slot
                    ).exclude(id=user_equipment.id).update(is_equipped=False)
                else:
                    # For generic accessories, unequip other accessories
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


class DailyCheckInViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def check_in(self, request):
        """Create a daily check-in for the user (100 XP per check-in)"""
        today = timezone.now().date()

        # Check if user already checked in today
        existing_checkin = DailyCheckIn.objects.filter(
            user=request.user,
            checked_in_at__date=today
        ).first()

        if existing_checkin:
            return Response(
                {'error': 'You have already checked in today. Come back tomorrow!'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create new check-in
        checkin = DailyCheckIn.objects.create(user=request.user)

        return Response({
            'message': 'Daily check-in successful! You earned 100 XP!',
            'xp_earned': checkin.xp_earned,
            'user_stats': UserStatsSerializer(request.user).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get daily check-in history for the past year (for contribution calendar)"""
        from datetime import timedelta

        # Get last 365 days of check-ins
        start_date = timezone.now().date() - timedelta(days=365)
        checkins = DailyCheckIn.objects.filter(
            user=request.user,
            checked_in_at__date__gte=start_date
        ).order_by('checked_in_at')

        # Format as list of dates for easier frontend processing
        checkin_dates = [checkin.checked_in_at.date().isoformat() for checkin in checkins]

        # Get today's check-in status
        today = timezone.now().date()
        checked_in_today = DailyCheckIn.objects.filter(
            user=request.user,
            checked_in_at__date=today
        ).exists()

        return Response({
            'checkin_dates': checkin_dates,
            'checked_in_today': checked_in_today,
            'total_checkins': len(checkin_dates)
        })


class TowerViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def start_floor(self, request):
        """Start a floor and return enemies for waves"""
        user = request.user
        progress, _ = TowerProgress.objects.get_or_create(user=user)
        
        # Logic to generate enemies based on floor
        floor = progress.current_floor
        enemies = []
        
        # Scaling logic
        base_hp = 50 + (floor * 10)
        base_dmg = 5 + (floor * 2)
        
        for i in range(5):  # 5 Waves
            # Determine enemy type based on floor
            if floor <= 3:
                enemy_type = random.choice([
                    {'name': 'Blue Slime', 'sprite': '/enemies/blue_slime.png'},
                    {'name': 'Red Slime', 'sprite': '/enemies/red_slime.png'}
                ])
            else:
                enemy_type = random.choice([
                    {'name': 'Skeleton Warrior', 'sprite': '/enemies/skeleton_warrior.png'},
                    {'name': 'Skeleton Captain', 'sprite': '/enemies/skeleton_captain.png'}
                ])

            enemy_data = {
                'id': i + 1,  # Pseudo ID for the session
                'name': f"{enemy_type['name']} {i+1}",
                'level': floor,
                'base_hp': base_hp + (i * 5),
                'base_damage': base_dmg + i,
                'sprite_path': enemy_type['sprite'],
                'xp_reward': 20 * floor,
                'gold_reward': 10 * floor
            }
            enemies.append(enemy_data)
            
        return Response({
            'floor': floor,
            'waves': enemies
        })

    @action(detail=False, methods=['post'])
    def complete_floor(self, request):
        """Complete the current floor and award rewards"""
        user = request.user
        progress, _ = TowerProgress.objects.get_or_create(user=user)
        
        # In a real secure app, we'd verify the combat log or token.
        # Here we trust the client for the "auto-battler" simulation.
        
        floor = progress.current_floor
        xp_reward = 100 * floor
        
        # Award XP
        user.add_xp(xp_reward)
        
        # Generate Item Reward
        reward_item = self._generate_random_equipment(floor)
        user_equipment = UserEquipment.objects.create(
            user=user,
            equipment=reward_item,
            is_equipped=False
        )
        
        # Update Progress
        progress.current_floor += 1
        if progress.current_floor > progress.highest_floor:
            progress.highest_floor = progress.current_floor
        progress.save()
        
        return Response({
            'message': f"Floor {floor} completed!",
            'xp_earned': xp_reward,
            'item_reward': EquipmentSerializer(reward_item).data,
            'next_floor': progress.current_floor,
            'user_stats': UserStatsSerializer(user).data
        })

    def _generate_random_equipment(self, floor):
        """Generate a random piece of equipment based on floor level"""
        import random
        
        slots = ['weapon', 'helmet', 'chest', 'legs', 'feet']
        slot = random.choice(slots)
        
        # Adjectives based on floor/power
        prefixes = ['Rusty', 'Common', 'Sturdy', 'Polished', 'Fine', 'Superior', 'Epic', 'Legendary', 'Mythic', 'Godly']
        prefix_index = min(len(prefixes) - 1, floor // 2)
        prefix = prefixes[prefix_index]
        
        names = {
            'weapon': ['Sword', 'Axe', 'Dagger', 'Staff', 'Mace'],
            'helmet': ['Helm', 'Cap', 'Visor', 'Hood', 'Crown'],
            'chest': ['Armor', 'Vest', 'Tunic', 'Plate', 'Robes'],
            'legs': ['Greaves', 'Pants', 'Leggings', 'Kilt', 'Guards'],
            'feet': ['Boots', 'Shoes', 'Sandals', 'Sabatons', 'Greaves']
        }
        base_name = random.choice(names[slot])
        
        # Generate Stats
        stats = {}
        attributes = ['strength', 'intelligence', 'creativity', 'social', 'health']
        
        # Number of stats increases with floor
        num_stats = 1 + (floor // 5)
        selected_attrs = random.sample(attributes, min(len(attributes), num_stats))
        
        for attr in selected_attrs:
            # Stat value scales with floor
            base_val = 1 + (floor // 2)
            variance = random.randint(0, floor)
            stats[attr] = base_val + variance

        # Create Equipment
        # Note: In a real game, we might reuse Equipment definitions to save DB space,
        # but for this "looter" feel where every drop is unique, creating new entries is fine for this scale.
        equipment = Equipment.objects.create(
            name=f"{prefix} {base_name}",
            equipment_type='outfit', # Simplified for now
            equipment_slot=slot,
            description=f"A {prefix.lower()} {base_name} found on floor {floor}.",
            stat_bonus=stats,
            gold_cost=floor * 50,
            sprite_path=f"/equipment/{slot}/{base_name.lower()}.png" # Placeholder path
        )
        
        return equipment