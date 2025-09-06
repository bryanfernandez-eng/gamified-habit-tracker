# backend/api/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

@receiver(post_migrate)
def create_demo_users(sender, **kwargs):
    """
    Auto-create demo users after migrations run
    """
    if sender.name != 'api':  # Only run for our api app
        return
        
    print("🚀 Setting up demo users...")
    
    # Create superuser John Doe
    try:
        john, created = User.objects.get_or_create(
            username='johndoe',
            defaults={
                'email': 'john@example.com',
                'first_name': 'John Doe',
                'is_superuser': True,
                'is_staff': True
            }
        )
        if created:
            john.set_password('demo123')
            john.save()
            print("✅ Created admin user: johndoe (demo123)")
        else:
            print("ℹ️  Admin user johndoe already exists")
    except IntegrityError as e:
        print(f"⚠️  Could not create johndoe: {e}")

    # Create regular user Reese
    try:
        reese, created = User.objects.get_or_create(
            username='reese',
            defaults={
                'email': 'reese@example.com',
                'first_name': 'Reese',
                'is_superuser': False,
                'is_staff': False
            }
        )
        if created:
            reese.set_password('demo123')
            reese.save()
            print("✅ Created regular user: reese (demo123)")
        else:
            print("ℹ️  Regular user reese already exists")
    except IntegrityError as e:
        print(f"⚠️  Could not create reese: {e}")
    
    print("🎯 Demo users ready! Use login quick-fill buttons to test")
    print("   Admin: johndoe / demo123")
    print("   User:  reese / demo123")