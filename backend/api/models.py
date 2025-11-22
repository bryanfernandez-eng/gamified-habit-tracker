# backend/api/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class CustomUser(AbstractUser):
    """
    Custom User model with display_name field and game stats
    """
    display_name = models.CharField(max_length=150, help_text="User's display name")
    
    # Game Stats
    level = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    current_hp = models.IntegerField(default=100, validators=[MinValueValidator(0), MaxValueValidator(100)])
    max_hp = models.IntegerField(default=100)
    current_xp = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    next_level_xp = models.IntegerField(default=100)
    
    # Attribute Stats
    strength = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    intelligence = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    creativity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    social = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    health = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    
    # Attribute XP (progress to next level)
    strength_xp = models.IntegerField(default=0)
    intelligence_xp = models.IntegerField(default=0)
    creativity_xp = models.IntegerField(default=0)
    social_xp = models.IntegerField(default=0)
    health_xp = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.username} (Level {self.level})"
    
    def add_xp(self, amount, attribute=None):
        """Add XP to user and handle leveling up"""
        self.current_xp += amount
        
        # Check for level up
        while self.current_xp >= self.next_level_xp:
            self.current_xp -= self.next_level_xp
            self.level += 1
            self.next_level_xp = int(self.next_level_xp * 1.5)  # Increase XP needed for next level
            self.max_hp += 10
            self.current_hp = self.max_hp  # Restore HP on level up
        
        # Add attribute-specific XP if specified
        if attribute:
            attr_xp_field = f"{attribute}_xp"
            if hasattr(self, attr_xp_field):
                current_attr_xp = getattr(self, attr_xp_field)
                setattr(self, attr_xp_field, current_attr_xp + amount)
                
                # Check for attribute level up (every 100 XP)
                if getattr(self, attr_xp_field) >= 100:
                    attr_level_field = attribute
                    current_level = getattr(self, attr_level_field)
                    setattr(self, attr_level_field, current_level + 1)
                    setattr(self, attr_xp_field, getattr(self, attr_xp_field) - 100)
        
        self.save()


class Habit(models.Model):
    CATEGORY_CHOICES = [
        ('strength', 'Strength'),
        ('intelligence', 'Intelligence'),
        ('creativity', 'Creativity'),
        ('social', 'Social'),
        ('health', 'Health'),
    ]
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    xp_reward = models.IntegerField(default=10, validators=[MinValueValidator(1)])
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    streak = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class HabitCompletion(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='completions')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='habit_completions')
    completed_at = models.DateTimeField(auto_now_add=True)
    xp_earned = models.IntegerField()
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-completed_at']
        # Prevent duplicate completions on the same day for daily habits
        
    
    def save(self, *args, **kwargs):
        today = self.completed_at.date() if self.completed_at else timezone.now().date()
        if HabitCompletion.objects.filter(
            habit=self.habit, user=self.user, completed_at__date=today
        ).exists():
            raise ValueError("Habit already completed today")
        
        if not self.xp_earned:
            self.xp_earned = self.habit.xp_reward

        self.user.add_xp(self.xp_earned, self.habit.category)
        self.habit.streak += 1
        self.habit.save()

        super().save(*args, **kwargs)

class Achievement(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    requirement_type = models.CharField(max_length=50)  # 'streak', 'total_completions', 'level', etc.
    requirement_value = models.IntegerField()
    requirement_category = models.CharField(max_length=20, blank=True)  # Optional category requirement
    reward_xp = models.IntegerField(default=50)
    reward_description = models.CharField(max_length=200)
    icon = models.CharField(max_length=50, default='trophy')  # Icon identifier
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class Equipment(models.Model):
    EQUIPMENT_TYPE_CHOICES = [
        ('outfit', 'Outfit'),
        ('accessory', 'Accessory'),
        ('theme', 'Theme'),
    ]
    
    name = models.CharField(max_length=200)
    equipment_type = models.CharField(max_length=20, choices=EQUIPMENT_TYPE_CHOICES)
    description = models.TextField(blank=True)
    stat_bonus = models.JSONField(default=dict)  # {"strength": 2, "intelligence": 1}
    unlock_requirement = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.equipment_type})"


class UserEquipment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='equipment')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    is_equipped = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'equipment']

    def __str__(self):
        return f"{self.user.username} - {self.equipment.name}"


class DailyCheckIn(models.Model):
    """Track daily check-ins for users (100 XP per check-in)"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='daily_checkins')
    checked_in_at = models.DateTimeField(auto_now_add=True)
    xp_earned = models.IntegerField(default=100)

    class Meta:
        ordering = ['-checked_in_at']

    def __str__(self):
        return f"{self.user.username} - {self.checked_in_at.date()}"

    def save(self, *args, **kwargs):
        """Award XP when check-in is created"""
        if not self.pk:  # Only on creation, not on update
            self.user.add_xp(self.xp_earned)
        super().save(*args, **kwargs)