"""
Clean up visual equipment test data
"""

from api.models import Equipment, UserEquipment

print("🗑️  Cleaning up visual equipment system...")

# Delete test equipment
Equipment.objects.filter(name__in=["Iron Helmet", "Iron Sword", "Leather Boots"]).delete()
print("✅ Removed test equipment items")

# Unequip everything
UserEquipment.objects.all().update(is_equipped=False)
print("✅ Unequipped all items")

print("✅ Cleanup complete!")
