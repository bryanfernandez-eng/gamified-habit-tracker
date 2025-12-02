"""
Management command to remove duplicate quests for users
"""
from django.core.management.base import BaseCommand
from django.db.models import Count
from api.models import Habit


class Command(BaseCommand):
    help = 'Remove duplicate quest names for each user, keeping the oldest one'

    def handle(self, *args, **options):
        self.stdout.write('Checking for duplicate quests...')

        # Find users with duplicate quest names
        duplicates = (
            Habit.objects.filter(is_active=True)
            .values('user', 'name')
            .annotate(count=Count('id'))
            .filter(count__gt=1)
        )

        if not duplicates:
            self.stdout.write(self.style.SUCCESS('No duplicate quests found!'))
            return

        total_removed = 0

        for dup in duplicates:
            user_id = dup['user']
            quest_name = dup['name']
            count = dup['count']

            # Get all instances of this quest for this user, ordered by creation date
            quests = Habit.objects.filter(
                user_id=user_id,
                name=quest_name,
                is_active=True
            ).order_by('created_at')

            # Keep the first (oldest) one, remove the rest
            quests_to_remove = quests[1:]
            removed_count = len(quests_to_remove)

            for quest in quests_to_remove:
                self.stdout.write(
                    f'  Removing duplicate: User {user_id} - "{quest_name}" (ID: {quest.id})'
                )
                quest.delete()

            total_removed += removed_count
            self.stdout.write(
                self.style.WARNING(
                    f'  Found {count} instances of "{quest_name}" for user {user_id}, '
                    f'removed {removed_count} duplicate(s)'
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nDone! Removed {total_removed} duplicate quest(s) total.'
            )
        )
