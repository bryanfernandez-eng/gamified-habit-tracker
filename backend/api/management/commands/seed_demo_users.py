from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Equipment, UserEquipment

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize demo users with their default appearances (run after equipment seeding)'

    def handle(self, *args, **options):
        demo_users = ['johndoe', 'reese']

        for username in demo_users:
            try:
                user = User.objects.get(username=username)

                # Get the default appearance for their selected character
                default_appearance = Equipment.objects.filter(
                    equipment_slot='armor',
                    character_specific=user.selected_character,
                    is_default=True
                ).first()

                if default_appearance:
                    user.selected_appearance = default_appearance
                    user.save()

                    # Ensure UserEquipment record exists and is marked as equipped
                    user_eq, created = UserEquipment.objects.get_or_create(
                        user=user,
                        equipment=default_appearance,
                        defaults={'is_equipped': True}
                    )
                    if not created and not user_eq.is_equipped:
                        user_eq.is_equipped = True
                        user_eq.save()

                    self.stdout.write(
                        self.style.SUCCESS(f'[+] Initialized {username} with appearance: {default_appearance.name}')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'[!] No default appearance found for {username} character: {user.selected_character}')
                    )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'[!] Demo user {username} does not exist')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'[!] Error initializing {username}: {e}')
                )

        self.stdout.write(self.style.SUCCESS('\n[+] Demo users initialized'))
