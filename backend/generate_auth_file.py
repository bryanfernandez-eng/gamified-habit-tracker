#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
users = User.objects.all().order_by('-level')

output_file = 'mock_users_auth.txt'
with open(output_file, 'w') as f:
    f.write("=" * 100 + "\n")
    f.write("GAMIFIED HABIT TRACKER - ALL TEST ACCOUNTS\n")
    f.write("=" * 100 + "\n\n")
    f.write("DEFAULT DEMO ACCOUNTS (Always Available):\n")
    f.write("-" * 100 + "\n")
    f.write("Admin User:    johndoe   / demo123\n")
    f.write("Regular User:  reese     / demo123\n\n")
    f.write("=" * 100 + "\n")
    f.write(f"MOCK TEST ACCOUNTS ({users.count()} total, Varied Levels and Stats)\n")
    f.write("=" * 100 + "\n")
    f.write("All accounts use password: demo123\n\n")

    for user in users:
        f.write(f"Username: {user.username}\n")
        f.write(f"Password: demo123\n")
        f.write(f"Display Name: {user.display_name}\n")
        f.write(f"Email: {user.email}\n")
        f.write(f"Level: {user.level}\n")
        f.write(f"Stats - STR: {user.strength} | INT: {user.intelligence} | CRE: {user.creativity} | SOC: {user.social} | HEA: {user.health}\n")
        f.write("-" * 100 + "\n\n")

    f.write("=" * 100 + "\n")
    f.write("QUICK REFERENCE TABLE (Sorted by Level DESC)\n")
    f.write("=" * 100 + "\n\n")
    f.write(f"{'Username':<30} {'Level':<8} {'STR':<5} {'INT':<5} {'CRE':<5} {'SOC':<5} {'HEA':<5}\n")
    f.write("-" * 100 + "\n")

    for user in users:
        f.write(f"{user.username:<30} {user.level:<8} {user.strength:<5} {user.intelligence:<5} {user.creativity:<5} {user.social:<5} {user.health:<5}\n")

print(f"[+] Generated comprehensive auth file: {output_file}")
print(f"[+] Total users: {User.objects.count()}")
