import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gamified_habit_tracker.settings")
django.setup()

from api.models import CustomUser, Equipment, UserEquipment

def grant_starter_items():
    # Get the first user (or specific user if needed)
    user = CustomUser.objects.first()
    if not user:
        print("No user found!")
        return

    print(f"Granting starter items to {user.username}...")

    starter_items = [
        {
            'name': 'Novice Sword',
            'type': 'outfit',
            'slot': 'weapon',
            'desc': 'A simple wooden sword for training.',
            'stats': {'strength': 5},
            'sprite': '/equipment/weapon/sword.png'
        },
        {
            'name': 'Apprentice Hood',
            'type': 'outfit',
            'slot': 'helmet',
            'desc': 'A basic hood that helps focus the mind.',
            'stats': {'intelligence': 5},
            'sprite': '/equipment/helmet/hood.png'
        },
        {
            'name': 'Artist\'s Charm',
            'type': 'accessory',
            'slot': 'accessory',
            'desc': 'A small charm that inspires creativity.',
            'stats': {'creativity': 5},
            'sprite': '/equipment/accessory/charm.png'
        },
        {
            'name': 'Noble\'s Tunic',
            'type': 'outfit',
            'slot': 'chest',
            'desc': 'A clean tunic that makes a good impression.',
            'stats': {'social': 5},
            'sprite': '/equipment/chest/tunic.png'
        },
        {
            'name': 'Sturdy Boots',
            'type': 'outfit',
            'slot': 'feet',
            'desc': 'Reliable boots for a long journey.',
            'stats': {'health': 5},
            'sprite': '/equipment/feet/boots.png'
        }
    ]

    for item_data in starter_items:
        equipment, created = Equipment.objects.get_or_create(
            name=item_data['name'],
            defaults={
                'equipment_type': item_data['type'],
                'equipment_slot': item_data['slot'],
                'description': item_data['desc'],
                'stat_bonus': item_data['stats'],
                'gold_cost': 0,
                'sprite_path': item_data['sprite'],
                'is_default': True
            }
        )
        
        if created:
            print(f"Created item: {equipment.name}")
        else:
            print(f"Item exists: {equipment.name}")

        # Grant to user
        user_equip, created = UserEquipment.objects.get_or_create(
            user=user,
            equipment=equipment,
            defaults={'is_equipped': True}
        )
        
        if created:
            print(f"Granted {equipment.name} to {user.username}")
        else:
            print(f"{user.username} already has {equipment.name}")
            # Ensure it's equipped
            user_equip.is_equipped = True
            user_equip.save()

    print("Done!")

if __name__ == "__main__":
    grant_starter_items()
