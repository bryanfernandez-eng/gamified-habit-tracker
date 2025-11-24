from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection
from django.conf import settings
import os


class Command(BaseCommand):
    help = 'Reset database and run all seed scripts in one go'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-migrations',
            action='store_true',
            help='Skip running migrations',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('\n[!] RESETTING DATABASE...'))

        # Get database name
        db_name = settings.DATABASES['default']['NAME']
        db_engine = settings.DATABASES['default']['ENGINE']

        try:
            if 'sqlite' in db_engine:
                # For SQLite, delete the file
                if os.path.exists(db_name):
                    os.remove(db_name)
                    self.stdout.write(self.style.SUCCESS(f'[+] Deleted SQLite database: {db_name}'))
            elif 'postgresql' in db_engine:
                # For PostgreSQL, drop and recreate
                with connection.cursor() as cursor:
                    cursor.execute(f"DROP DATABASE IF EXISTS {db_name};")
                    cursor.execute(f"CREATE DATABASE {db_name};")
                    self.stdout.write(self.style.SUCCESS(f'[+] Reset PostgreSQL database: {db_name}'))
            elif 'mysql' in db_engine:
                # For MySQL, drop and recreate
                with connection.cursor() as cursor:
                    cursor.execute(f"DROP DATABASE IF EXISTS `{db_name}`;")
                    cursor.execute(f"CREATE DATABASE `{db_name}`;")
                    self.stdout.write(self.style.SUCCESS(f'[+] Reset MySQL database: {db_name}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'[!] Error resetting database: {e}'))
            return

        # Run migrations
        if not options['skip_migrations']:
            self.stdout.write(self.style.WARNING('\n[*] Running migrations...'))
            try:
                call_command('migrate', verbosity=1)
                self.stdout.write(self.style.SUCCESS('[+] Migrations completed'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'[!] Error running migrations: {e}'))
                return

        # Run seed scripts in order
        seed_commands = [
            ('seed_equipment', 'equipment'),
            ('seed_achievements', 'achievements'),
            ('create_mock_users', 'mock users'),
        ]

        for command_name, description in seed_commands:
            self.stdout.write(self.style.WARNING(f'\n[*] Seeding {description}...'))
            try:
                call_command(command_name, verbosity=1)
                self.stdout.write(self.style.SUCCESS(f'[+] {description.capitalize()} seeded'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'[!] Error seeding {description}: {e}'))

        self.stdout.write(self.style.SUCCESS('\n' + '=' * 60))
        self.stdout.write(self.style.SUCCESS('[+] DATABASE RESET COMPLETE!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.WARNING('\n[!] Demo user created by signals:'))
        self.stdout.write('    Admin: johndoe / demo123')
        self.stdout.write('    User:  reese / demo123')
        self.stdout.write(self.style.WARNING('\n[!] All mock users use password: demo123\n'))
