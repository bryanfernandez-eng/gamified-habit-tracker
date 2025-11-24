"""
Equipment Management Script
Run this in Django shell to manage your equipment
"""

from api.models import CustomUser, Equipment, UserEquipment

# Get your user (change username if needed)
user = CustomUser.objects.get(username='johndoe')

print("=" * 60)
print("EQUIPMENT MANAGER")
print("=" * 60)

# ========================================
# 1. UNEQUIP ALL CURRENT EQUIPMENT
# ========================================
print("\n1️⃣  Unequipping all current equipment...")
UserEquipment.objects.filter(user=user, is_equipped=True).update(is_equipped=False)
print("✅ All equipment unequipped")

# ========================================
# 2. DELETE OLD TEST EQUIPMENT (OPTIONAL)
# ========================================
print("\n2️⃣  Removing old test equipment...")
old_equipment = Equipment.objects.filter(name="Hero Armor")
if old_equipment.exists():
    old_equipment.delete()
    print("✅ Removed 'Hero Armor'")
else:
    print("⚠️  No old equipment found")

# ========================================
# 3. CREATE NEW PROPER TEST EQUIPMENT
# ========================================
print("\n3️⃣  Creating new test equipment...")

# Example: Iron Helmet (JUST the helmet piece)
helmet = Equipment.objects.create(
    name="Iron Helmet",
    equipment_type="outfit",
    equipment_slot="helmet",
    sprite_path="equipment/helmets/iron-helmet.png",  # You'll add this sprite
    gold_cost=300,
    stat_bonus={"strength": 2},
    description="A sturdy iron helmet"
)
print(f"✅ Created: {helmet.name}")

# Example: Iron Sword (JUST the sword)
sword = Equipment.objects.create(
    name="Iron Sword",
    equipment_type="outfit",
    equipment_slot="weapon",
    sprite_path="equipment/weapons/iron-sword.png",  # You'll add this sprite
    gold_cost=500,
    stat_bonus={"strength": 5},
    description="A sharp iron blade"
)
print(f"✅ Created: {sword.name}")

# Example: Leather Boots (JUST the boots)
boots = Equipment.objects.create(
    name="Leather Boots",
    equipment_type="outfit",
    equipment_slot="feet",
    sprite_path="equipment/feet/leather-boots.png",  # You'll add this sprite
    gold_cost=200,
    stat_bonus={"health": 1},
    description="Comfortable leather boots"
)
print(f"✅ Created: {boots.name}")

# ========================================
# 4. UNLOCK AND EQUIP FOR YOUR USER
# ========================================
print("\n4️⃣  Unlocking and equipping items...")

# Unlock and equip helmet
user_helmet = UserEquipment.objects.create(
    user=user,
    equipment=helmet,
    is_equipped=True
)
print(f"✅ Equipped: {helmet.name}")

# Unlock and equip sword
user_sword = UserEquipment.objects.create(
    user=user,
    equipment=sword,
    is_equipped=True
)
print(f"✅ Equipped: {sword.name}")

# Unlock and equip boots
user_boots = UserEquipment.objects.create(
    user=user,
    equipment=boots,
    is_equipped=True
)
print(f"✅ Equipped: {boots.name}")

# ========================================
# SUMMARY
# ========================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"User: {user.username}")
print(f"Currently equipped items:")
for ue in UserEquipment.objects.filter(user=user, is_equipped=True):
    print(f"  • {ue.equipment.name} ({ue.equipment.equipment_slot})")

print("\n⚠️  NEXT STEPS:")
print("1. Save the example sprites I generated to:")
print("   - helmet_example.png → /frontend/src/assets/equipment/helmets/iron-helmet.png")
print("   - sword_example.png → /frontend/src/assets/equipment/weapons/iron-sword.png")
print("   - boots_example.png → /frontend/src/assets/equipment/feet/leather-boots.png")
print("2. Refresh your dashboard to see the equipment!")
print("=" * 60)
