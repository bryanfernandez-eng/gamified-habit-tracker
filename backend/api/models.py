# backend/api/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom User model with display_name field
    """
    display_name = models.CharField(max_length=150, help_text="User's display name")
    
    def __str__(self):
        return f"{self.username} ({self.display_name})"