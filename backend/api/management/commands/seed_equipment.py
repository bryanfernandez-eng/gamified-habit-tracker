from django.core.management.base import BaseCommand
from api.models import Equipment


class Command(BaseCommand):
    help = 'Seed equipment data into the database'

    def handle(self, *args, **options):
        equipment_data = [
            # Outfits
            {
                'name': 'Casual Outfit',
                'equipment_type': 'outfit',
                'description': 'A comfortable everyday outfit. Perfect for beginners.',
                'stat_bonus': {},
                'unlock_requirement': 'Starter outfit. Always unlocked.',
                'is_default': True,
            },
            {
                'name': 'Gym Champion',
                'equipment_type': 'outfit',
                'description': 'Athletic gear for the fitness enthusiast.',
                'stat_bonus': {'strength': 3},
                'unlock_requirement': 'Reach Strength level 5',
                'is_default': False,
            },
            {
                'name': "Scholar's Robe",
                'equipment_type': 'outfit',
                'description': 'Robes of knowledge and wisdom.',
                'stat_bonus': {'intelligence': 3},
                'unlock_requirement': 'Reach Intelligence level 5',
                'is_default': False,
            },
            {
                'name': "Artist's Smock",
                'equipment_type': 'outfit',
                'description': 'Paint-stained garment of creative expression.',
                'stat_bonus': {'creativity': 3},
                'unlock_requirement': 'Reach Creativity level 5',
                'is_default': False,
            },
            {
                'name': 'Party Attire',
                'equipment_type': 'outfit',
                'description': 'Stylish outfit for social gatherings.',
                'stat_bonus': {'social': 3},
                'unlock_requirement': 'Reach Social level 5',
                'is_default': False,
            },
            {
                'name': 'Wellness Suit',
                'equipment_type': 'outfit',
                'description': 'Comfortable health-focused clothing.',
                'stat_bonus': {'health': 3},
                'unlock_requirement': 'Reach Health level 5',
                'is_default': False,
            },
            {
                'name': 'Legend Armor',
                'equipment_type': 'outfit',
                'description': 'Ultimate achievement outfit of legendary status.',
                'stat_bonus': {'strength': 2, 'intelligence': 2, 'creativity': 2, 'social': 2, 'health': 2},
                'unlock_requirement': 'Reach Level 20',
                'is_default': False,
            },
            # Armor (equipment_slot: armor)
            {
                'name': 'None',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'description': 'No armor equipped. Shows original character.',
                'stat_bonus': {},
                'unlock_requirement': 'Always available.',
                'is_default': True,
            },
            # Weapons (equipment_slot: weapon)
            {
                'name': 'None',
                'equipment_type': 'accessory',
                'equipment_slot': 'weapon',
                'description': 'No weapon equipped. Shows original character.',
                'stat_bonus': {},
                'unlock_requirement': 'Always available.',
                'is_default': True,
            },
            # Character-Specific Weapons
            {
                'name': 'Zoro Sword',
                'equipment_type': 'accessory',
                'equipment_slot': 'weapon',
                'sprite_path': 'sword.png',
                'character_specific': 'zoro',
                'description': 'A legendary sword wielded by the great swordsman Zoro.',
                'stat_bonus': {'strength': 5},
                'unlock_requirement': 'Unlock Zoro character',
                'is_default': True,
            },
            # Themes
            {
                'name': 'Default Theme',
                'equipment_type': 'theme',
                'description': 'Clean white background theme.',
                'stat_bonus': {},
                'unlock_requirement': 'Default theme. Always unlocked.',
                'is_default': True,
            },
            {
                'name': 'Forest Green',
                'equipment_type': 'theme',
                'description': 'Lush green forest theme for natural harmony.',
                'stat_bonus': {'health': 2},
                'unlock_requirement': 'Reach Level 1',
                'is_default': False,
            },
            {
                'name': 'Forest Pixel',
                'equipment_type': 'theme',
                'description': 'Pixel art forest theme with retro vibes.',
                'stat_bonus': {'health': 2},
                'unlock_requirement': 'Reach Level 1',
                'is_default': False,
            },
            {
                'name': 'Forest Standard',
                'equipment_type': 'theme',
                'description': 'Classic forest theme with natural beauty.',
                'stat_bonus': {'health': 2},
                'unlock_requirement': 'Reach Level 1',
                'is_default': False,
            },
        ]

        created_count = 0
        for item_data in equipment_data:
            defaults = {
                'description': item_data['description'],
                'stat_bonus': item_data['stat_bonus'],
                'unlock_requirement': item_data['unlock_requirement'],
                'is_default': item_data['is_default'],
            }

            # Add optional fields if present
            if 'equipment_slot' in item_data:
                defaults['equipment_slot'] = item_data['equipment_slot']
            if 'sprite_path' in item_data:
                defaults['sprite_path'] = item_data['sprite_path']
            if 'character_specific' in item_data:
                defaults['character_specific'] = item_data['character_specific']

            # Use equipment_slot in lookup key if present to distinguish between different "None" items
            lookup_fields = {
                'name': item_data['name'],
                'equipment_type': item_data['equipment_type'],
            }
            if 'equipment_slot' in item_data:
                lookup_fields['equipment_slot'] = item_data['equipment_slot']

            equipment, created = Equipment.objects.get_or_create(
                **lookup_fields,
                defaults=defaults
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'[+] Created equipment: {equipment.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'[*] Equipment already exists: {equipment.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n[+] Total equipment created: {created_count}')
        )
