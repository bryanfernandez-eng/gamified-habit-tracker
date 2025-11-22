from django.core.management.base import BaseCommand
from api.models import Achievement


class Command(BaseCommand):
    help = 'Seed achievement data into the database'

    def handle(self, *args, **options):
        achievements_data = [
            # Streak-based Achievements
            {
                'name': 'Getting Started',
                'description': 'Complete a habit 3 days in a row.',
                'requirement_type': 'streak',
                'requirement_value': 3,
                'requirement_category': '',
                'reward_xp': 25,
                'reward_description': 'Your first streak unlocked!',
                'icon': 'fire-1',
            },
            {
                'name': 'On a Roll',
                'description': 'Maintain a 7-day streak on any habit.',
                'requirement_type': 'streak',
                'requirement_value': 7,
                'requirement_category': '',
                'reward_xp': 50,
                'reward_description': 'You are unstoppable!',
                'icon': 'fire-7',
            },
            {
                'name': 'Dedication',
                'description': 'Maintain a 14-day streak on any habit.',
                'requirement_type': 'streak',
                'requirement_value': 14,
                'requirement_category': '',
                'reward_xp': 100,
                'reward_description': 'Two weeks of pure dedication!',
                'icon': 'fire-14',
            },
            {
                'name': 'Iron Discipline',
                'description': 'Maintain a 30-day streak on any habit.',
                'requirement_type': 'streak',
                'requirement_value': 30,
                'requirement_category': '',
                'reward_xp': 200,
                'reward_description': 'A whole month of consistency!',
                'icon': 'fire-30',
            },
            # Strength-based Achievements
            {
                'name': 'Muscle Apprentice',
                'description': 'Reach Strength level 3.',
                'requirement_type': 'attribute_level',
                'requirement_value': 3,
                'requirement_category': 'strength',
                'reward_xp': 50,
                'reward_description': 'Growing stronger each day!',
                'icon': 'muscle-1',
            },
            {
                'name': 'Strength Master',
                'description': 'Reach Strength level 10.',
                'requirement_type': 'attribute_level',
                'requirement_value': 10,
                'requirement_category': 'strength',
                'reward_xp': 150,
                'reward_description': 'You are incredibly strong!',
                'icon': 'muscle-10',
            },
            # Intelligence-based Achievements
            {
                'name': 'Curious Mind',
                'description': 'Reach Intelligence level 3.',
                'requirement_type': 'attribute_level',
                'requirement_value': 3,
                'requirement_category': 'intelligence',
                'reward_xp': 50,
                'reward_description': 'Knowledge is power!',
                'icon': 'brain-1',
            },
            {
                'name': 'Intellectual Elite',
                'description': 'Reach Intelligence level 10.',
                'requirement_type': 'attribute_level',
                'requirement_value': 10,
                'requirement_category': 'intelligence',
                'reward_xp': 150,
                'reward_description': 'Your wisdom is legendary!',
                'icon': 'brain-10',
            },
            # Creativity-based Achievements
            {
                'name': 'Creative Spark',
                'description': 'Reach Creativity level 3.',
                'requirement_type': 'attribute_level',
                'requirement_value': 3,
                'requirement_category': 'creativity',
                'reward_xp': 50,
                'reward_description': 'Your creativity is growing!',
                'icon': 'art-1',
            },
            {
                'name': 'Creative Visionary',
                'description': 'Reach Creativity level 10.',
                'requirement_type': 'attribute_level',
                'requirement_value': 10,
                'requirement_category': 'creativity',
                'reward_xp': 150,
                'reward_description': 'You are an artist beyond compare!',
                'icon': 'art-10',
            },
            # Social-based Achievements
            {
                'name': 'Social Butterfly',
                'description': 'Reach Social level 3.',
                'requirement_type': 'attribute_level',
                'requirement_value': 3,
                'requirement_category': 'social',
                'reward_xp': 50,
                'reward_description': 'You are becoming quite sociable!',
                'icon': 'social-1',
            },
            {
                'name': 'Life of the Party',
                'description': 'Reach Social level 10.',
                'requirement_type': 'attribute_level',
                'requirement_value': 10,
                'requirement_category': 'social',
                'reward_xp': 150,
                'reward_description': 'Everyone loves being around you!',
                'icon': 'social-10',
            },
            # Health-based Achievements
            {
                'name': 'Wellness Beginner',
                'description': 'Reach Health level 3.',
                'requirement_type': 'attribute_level',
                'requirement_value': 3,
                'requirement_category': 'health',
                'reward_xp': 50,
                'reward_description': 'Your health is improving!',
                'icon': 'health-1',
            },
            {
                'name': 'Health Champion',
                'description': 'Reach Health level 10.',
                'requirement_type': 'attribute_level',
                'requirement_value': 10,
                'requirement_category': 'health',
                'reward_xp': 150,
                'reward_description': 'You are a picture of perfect health!',
                'icon': 'health-10',
            },
            # Level-based Achievements
            {
                'name': 'Rookie',
                'description': 'Reach Level 5.',
                'requirement_type': 'level',
                'requirement_value': 5,
                'requirement_category': '',
                'reward_xp': 50,
                'reward_description': 'Welcome to your adventure!',
                'icon': 'level-5',
            },
            {
                'name': 'Veteran',
                'description': 'Reach Level 10.',
                'requirement_type': 'level',
                'requirement_value': 10,
                'requirement_category': '',
                'reward_xp': 100,
                'reward_description': 'You have come far on this journey!',
                'icon': 'level-10',
            },
            {
                'name': 'Master',
                'description': 'Reach Level 20.',
                'requirement_type': 'level',
                'requirement_value': 20,
                'requirement_category': '',
                'reward_xp': 200,
                'reward_description': 'You have mastered the art of habit building!',
                'icon': 'level-20',
            },
            {
                'name': 'Legend',
                'description': 'Reach Level 30.',
                'requirement_type': 'level',
                'requirement_value': 30,
                'requirement_category': '',
                'reward_xp': 300,
                'reward_description': 'You are a legend among habit trackers!',
                'icon': 'level-30',
            },
            # Completion-based Achievements
            {
                'name': 'First Steps',
                'description': 'Complete 10 habits.',
                'requirement_type': 'total_completions',
                'requirement_value': 10,
                'requirement_category': '',
                'reward_xp': 25,
                'reward_description': 'You are building momentum!',
                'icon': 'completion-10',
            },
            {
                'name': 'Habit Builder',
                'description': 'Complete 50 habits.',
                'requirement_type': 'total_completions',
                'requirement_value': 50,
                'requirement_category': '',
                'reward_xp': 75,
                'reward_description': 'You are a true habit builder!',
                'icon': 'completion-50',
            },
            {
                'name': 'Completion Master',
                'description': 'Complete 100 habits.',
                'requirement_type': 'total_completions',
                'requirement_value': 100,
                'requirement_category': '',
                'reward_xp': 150,
                'reward_description': 'You have completed a century of habits!',
                'icon': 'completion-100',
            },
            {
                'name': 'Unstoppable Force',
                'description': 'Complete 250 habits.',
                'requirement_type': 'total_completions',
                'requirement_value': 250,
                'requirement_category': '',
                'reward_xp': 250,
                'reward_description': 'Nothing can stop your progress!',
                'icon': 'completion-250',
            },
        ]

        created_count = 0
        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                name=achievement_data['name'],
                defaults={
                    'description': achievement_data['description'],
                    'requirement_type': achievement_data['requirement_type'],
                    'requirement_value': achievement_data['requirement_value'],
                    'requirement_category': achievement_data['requirement_category'],
                    'reward_xp': achievement_data['reward_xp'],
                    'reward_description': achievement_data['reward_description'],
                    'icon': achievement_data['icon'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created achievement: {achievement.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'⊘ Achievement already exists: {achievement.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Total achievements created: {created_count}')
        )
