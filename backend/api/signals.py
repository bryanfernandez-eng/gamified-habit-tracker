# backend/api/signals.py
from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import Equipment, UserEquipment

User = get_user_model()

@receiver(post_migrate)
def create_demo_users(sender, **kwargs):
    """
    Auto-create demo users after migrations run
    """
    if sender.name != 'api':  # Only run for our api app
        return
        
    print("[*] Setting up demo users...")

    # Create superuser John Doe
    try:
        john, created = User.objects.get_or_create(
            username='johndoe',
            defaults={
                'email': 'john@example.com',
                'display_name': 'John Doe',
                'is_superuser': True,
                'is_staff': True  # Keep this for Django admin access
            }
        )
        if created:
            john.set_password('demo123')
            john.save()
            print("[+] Created admin user: johndoe (demo123)")
        else:
            print("[i] Admin user johndoe already exists")
    except IntegrityError as e:
        print(f"[!] Could not create johndoe: {e}")

    # Create regular user Reese
    try:
        reese, created = User.objects.get_or_create(
            username='reese',
            defaults={
                'email': 'reese@example.com',
                'display_name': 'Reese',
                'is_superuser': False,
                'is_staff': False
            }
        )
        if created:
            reese.set_password('demo123')
            reese.save()
            print("[+] Created regular user: reese (demo123)")
        else:
            print("[i] Regular user reese already exists")
    except IntegrityError as e:
        print(f"[!] Could not create reese: {e}")

    print("[*] Demo users ready! Use login quick-fill buttons to test")
    print("   Admin: johndoe / demo123")
    print("   User:  reese / demo123")


@receiver(post_save, sender=User)
def initialize_user_equipment(sender, instance, created, **kwargs):
    """
    Auto-initialize default appearance and equipment for new users
    """
    if not created:
        return

    try:
        # Step 1: Set the default appearance for the selected character
        default_appearance = Equipment.objects.filter(
            equipment_slot='armor',
            character_specific=instance.selected_character,
            is_default=True
        ).first()

        if default_appearance:
            instance.selected_appearance = default_appearance
            instance.save(update_fields=['selected_appearance'])

        # Step 2: Create UserEquipment records for all items the user starts with
        all_equipment = Equipment.objects.all()
        for equipment in all_equipment:
            # Mark as equipped ONLY if it's the selected appearance or the default theme
            is_equipped = (
                equipment == default_appearance or
                (equipment.equipment_type == 'theme' and equipment.name == 'Default Theme')
            )

            UserEquipment.objects.get_or_create(
                user=instance,
                equipment=equipment,
                defaults={'is_equipped': is_equipped}
            )
    except Exception as e:
        print(f"[!] Error initializing equipment for user {instance.username}: {e}")