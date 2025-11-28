from django.core.management.base import BaseCommand
from api.models import Equipment


class Command(BaseCommand):
    help = 'Seed equipment data into the database'

    def handle(self, *args, **options):
        equipment_data = [
            # Default Character Appearance
            {
                'name': 'Default Appearance',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/default/level1-default.png',
                'character_specific': 'default',
                'description': 'Default character appearance.',
                'stat_bonus': {},
                'unlock_requirement': 'Always available.',
                'is_default': True,
            },
            # Zoro Character Appearances
            {
                'name': 'Zoro',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/zoro/zoro-default.png',
                'character_specific': 'zoro',
                'description': 'Zoro in his standard appearance.',
                'stat_bonus': {},
                'unlock_requirement': 'Unlocked at Level 1',
                'is_default': True,
            },
            {
                'name': 'Zoro with Sword',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/zoro/zoro-sword.png',
                'character_specific': 'zoro',
                'description': 'Zoro wielding his legendary sword.',
                'stat_bonus': {'strength': 5},
                'unlock_requirement': 'Unlocked at Level 3',
                'is_default': False,
            },
            # Cyberpunk Character Appearances
            {
                'name': 'Cyberpunk',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/cyberpunk/cyberpunk-default.png',
                'character_specific': 'cyberpunk',
                'description': 'Cyberpunk in their default appearance.',
                'stat_bonus': {},
                'unlock_requirement': 'Unlocked at Level 3',
                'is_default': True,
            },
            {
                'name': 'Cyberpunk Corrupted',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/cyberpunk/cyberpunk-corrupted.png',
                'character_specific': 'cyberpunk',
                'description': 'Cyberpunk in corrupted form with enhanced abilities.',
                'stat_bonus': {'intelligence': 3, 'creativity': 2},
                'unlock_requirement': 'Unlocked at Level 4',
                'is_default': False,
            },
            {
                'name': 'Cyberpunk Ascended',
                'equipment_type': 'accessory',
                'equipment_slot': 'armor',
                'sprite_path': 'characters/cyberpunk/cyberpunk-ascended.png',
                'character_specific': 'cyberpunk',
                'description': 'Cyberpunk in ascended form with maximum power.',
                'stat_bonus': {'intelligence': 5, 'creativity': 3, 'strength': 2},
                'unlock_requirement': 'Unlocked at Level 5',
                'is_default': False,
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
            {
                'name': 'Pixel Forest',
                'equipment_type': 'theme',
                'description': 'Retro pixel art forest with nostalgic charm.',
                'stat_bonus': {'creativity': 2, 'health': 1},
                'unlock_requirement': 'Unlocked at Level 2',
                'is_default': False,
            },
            {
                'name': 'Shattered Sky',
                'equipment_type': 'theme',
                'description': 'Mystical shattered sky with ethereal atmosphere.',
                'stat_bonus': {'intelligence': 3, 'creativity': 2},
                'unlock_requirement': 'Unlocked at Level 3',
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
