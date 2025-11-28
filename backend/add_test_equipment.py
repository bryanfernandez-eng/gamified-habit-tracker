"""
Quick script to add test equipment item to database

Run this in Django shell:
python manage.py shell

Then paste this code:
"""

from api.models import Equipment

# Create the Hero Armor equipment
hero_armor = Equipment.objects.create(
    name="Hero Armor",
    equipment_type="outfit",
    equipment_slot="chest",
    sprite_path="equipment/chest/hero-armor.png",
    gold_cost=1000,
    stat_bonus={"strength": 5, "health": 3},
    description="Epic hero armor with a stylish blue hoodie. Provides excellent protection and looks great!"
)

print(f"✅ Created: {hero_armor.name} (ID: {hero_armor.id})")
print(f"   Slot: {hero_armor.equipment_slot}")
print(f"   Sprite: {hero_armor.sprite_path}")
print(f"   Cost: {hero_armor.gold_cost} gold")

# Now you need to unlock it for your user and equip it
# Replace 'your_username' with your actual username

from api.models import CustomUser, UserEquipment

user = CustomUser.objects.get(username='johndoe')  # Change to your username
user_equipment = UserEquipment.objects.create(
    user=user,
    equipment=hero_armor,
    is_equipped=True  # Automatically equip it
)

print(f"\n✅ Unlocked and equipped for user: {user.username}")
print(f"   Go to the dashboard to see it on your character!")
