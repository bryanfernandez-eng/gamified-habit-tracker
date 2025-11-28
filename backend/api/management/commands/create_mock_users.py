from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create 40 mock users with varied levels and stats for testing'

    def handle(self, *args, **options):
        # List of diverse names for mock users
        user_pairs = [
            ('Alex', 'Storm'), ('Bailey', 'Knight'), ('Casey', 'Phoenix'), ('Dakota', 'Shadow'),
            ('Ellis', 'Blade'), ('Finley', 'Drake'), ('Grey', 'Wolf'), ('Harper', 'Fox'),
            ('Indigo', 'Raven'), ('Jordan', 'Eagle'), ('Kilo', 'Hunter'), ('Logan', 'Ranger'),
            ('Morgan', 'Warrior'), ('Nova', 'Sage'), ('Oscar', 'Seeker'), ('Parker', 'Rider'),
            ('Quinn', 'Archer'), ('Riley', 'Mystic'), ('Sage', 'Scholar'), ('Taylor', 'Wanderer'),
            ('Urban', 'Nomad'), ('Vesper', 'Traveler'), ('Walker', 'Pilgrim'), ('Xander', 'Sentinel'),
            ('Yara', 'Guardian'), ('Zephyr', 'Protector'), ('Aria', 'Champion'), ('Blaze', 'Victor'),
            ('Chess', 'Titan'), ('Drake', 'Rebel'), ('Echo', 'Outlaw'), ('Falcon', 'Rogue'),
            ('Gideon', 'Ninja'), ('Haven', 'Samurai'), ('Iris', 'Viking'), ('Jagger', 'Pirate'),
            ('Kade', 'Dragon'), ('Lyric', 'Mystic'), ('Merlin', 'Wizard'), ('Nexus', 'Seeker'),
        ]

        created_count = 0
        auth_data = []

        for first_name, last_name in user_pairs:
            username = f"{first_name.lower()}{last_name.lower()}".replace(' ', '')
            email = f"{username}@example.com"
            display_name = f"{first_name} {last_name}"
            password = "demo123"

            try:
                user, created = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'email': email,
                        'display_name': display_name,
                        'is_superuser': False,
                        'is_staff': False,
                        'level': random.randint(1, 30),
                        'current_hp': random.randint(50, 100),
                        'max_hp': random.randint(100, 150),
                        'current_xp': random.randint(0, 500),
                        'next_level_xp': random.randint(100, 300),
                        'strength': random.randint(1, 20),
                        'intelligence': random.randint(1, 20),
                        'creativity': random.randint(1, 20),
                        'social': random.randint(1, 20),
                        'health': random.randint(1, 20),
                        'strength_xp': random.randint(0, 100),
                        'intelligence_xp': random.randint(0, 100),
                        'creativity_xp': random.randint(0, 100),
                        'social_xp': random.randint(0, 100),
                        'health_xp': random.randint(0, 100),
                    }
                )
                if created:
                    user.set_password(password)
                    user.save()
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'[+] Created user: {username}')
                    )
                    # Store auth data for output file
                    auth_data.append({
                        'username': username,
                        'password': password,
                        'display_name': display_name,
                        'email': email,
                        'level': user.level,
                        'strength': user.strength,
                        'intelligence': user.intelligence,
                        'creativity': user.creativity,
                        'social': user.social,
                        'health': user.health,
                    })
                else:
                    self.stdout.write(
                        self.style.WARNING(f'[!] User already exists: {username}')
                    )
            except IntegrityError as e:
                self.stdout.write(
                    self.style.ERROR(f'[!] Could not create {username}: {e}')
                )

        # Write auth data to file
        if auth_data:
            output_file = 'mock_users_auth.txt'
            with open(output_file, 'w') as f:
                f.write("=" * 80 + "\n")
                f.write("MOCK USERS - AUTHENTICATION INFORMATION\n")
                f.write("=" * 80 + "\n\n")
                f.write("WARNING: These are test accounts for development/testing purposes only!\n")
                f.write("All accounts use the password: demo123\n\n")
                f.write("=" * 80 + "\n")
                f.write("ACCOUNT DETAILS\n")
                f.write("=" * 80 + "\n\n")

                for data in sorted(auth_data, key=lambda x: x['level'], reverse=True):
                    f.write(f"Username: {data['username']}\n")
                    f.write(f"Password: {data['password']}\n")
                    f.write(f"Display Name: {data['display_name']}\n")
                    f.write(f"Email: {data['email']}\n")
                    f.write(f"Level: {data['level']}\n")
                    f.write(f"Stats - STR: {data['strength']} | INT: {data['intelligence']} | CRE: {data['creativity']} | SOC: {data['social']} | HEA: {data['health']}\n")
                    f.write("-" * 80 + "\n\n")

                f.write("=" * 80 + "\n")
                f.write("QUICK REFERENCE (Sorted by Level)\n")
                f.write("=" * 80 + "\n\n")
                f.write(f"{'Username':<25} {'Level':<8} {'Strength':<10} {'Intelligence':<12} {'Creativity':<10}\n")
                f.write("-" * 80 + "\n")
                for data in sorted(auth_data, key=lambda x: x['level'], reverse=True):
                    f.write(f"{data['username']:<25} {data['level']:<8} {data['strength']:<10} {data['intelligence']:<12} {data['creativity']:<10}\n")

            self.stdout.write(
                self.style.SUCCESS(f'\n[+] Auth information saved to: {output_file}')
            )

        self.stdout.write(
            self.style.SUCCESS(f'\n[+] Total mock users created: {created_count}')
        )
        self.stdout.write(
            self.style.SUCCESS('[+] All users can login with password: demo123')
        )
