# backend/api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer, TokenSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

User = get_user_model()

class CustomUserDetailsSerializer(UserDetailsSerializer):
    """
    Custom user serializer with display name support
    """
    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('display_name', 'is_superuser', 'date_joined')
        read_only_fields = ('email', 'date_joined', 'is_superuser')

class CustomTokenSerializer(TokenSerializer):
    """
    Custom token serializer that includes user data in login/registration response
    """
    user = CustomUserDetailsSerializer(read_only=True)
    
    class Meta(TokenSerializer.Meta):
        fields = TokenSerializer.Meta.fields + ('user',)

class CustomLoginSerializer(LoginSerializer):
    """
    Custom login serializer with better error messages and username/email support
    """
    username = None
    email = None
    login = serializers.CharField(required=True, allow_blank=False)
    password = serializers.CharField(style={'input_type': 'password'})

    def authenticate(self, **kwargs):
        return authenticate(self.context['request'], **kwargs)

    def _validate_login(self, login, password):
        if login and password:
            # Try to authenticate with username first
            user = self.authenticate(username=login, password=password)
            
            # If that fails, try with email
            if not user:
                user = self.authenticate(email=login, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'Invalid username/email or password. Please check your credentials and try again.'
                )
        else:
            raise serializers.ValidationError('Please provide both username/email and password.')

        return user

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        user = self._validate_login(login, password)

        # Email verification check (if needed)
        if hasattr(settings, 'ACCOUNT_EMAIL_VERIFICATION'):
            from allauth.account import app_settings
            if app_settings.EMAIL_VERIFICATION == app_settings.EmailVerificationMethod.MANDATORY:
                if not user.emailaddress_set.filter(verified=True).exists():
                    raise serializers.ValidationError('Please verify your email address before logging in.')

        attrs['user'] = user
        return attrs

class CustomRegisterSerializer(RegisterSerializer):
    """
    Custom registration serializer with display name and better error messages
    """
    display_name = serializers.CharField(
        required=True,
        max_length=150,
        help_text="This will be your display name on the platform"
    )
    
    def validate_username(self, username):
        if len(username) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )
        if len(username) > 150:
            raise serializers.ValidationError(
                "Username cannot be longer than 150 characters."
            )
        
        # Use allauth's adapter for username validation
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        # Use allauth's adapter for email validation
        email = get_adapter().clean_email(email)
        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email address already exists. Please use a different email or try logging in."
            )
        return email

    def validate_display_name(self, display_name):
        if len(display_name.strip()) < 2:
            raise serializers.ValidationError(
                "Display name must be at least 2 characters long."
            )
        return display_name.strip()

    def validate_password1(self, password):
        if len(password) < 6:
            raise serializers.ValidationError(
                "Password must be at least 6 characters long."
            )
        return password

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({
                'password2': "The two password fields didn't match."
            })
        return data

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'display_name': self.validated_data.get('display_name', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        
        # Set all the fields
        user.username = self.cleaned_data.get('username', '')
        user.email = self.cleaned_data.get('email', '')
        user.display_name = self.cleaned_data.get('display_name', '')
        user.set_password(self.cleaned_data.get('password1', ''))
        user.save()
        
        # Setup user email
        setup_user_email(request, user, [])
        return user

# New serializers for admin user management
class AdminUserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users in admin panel
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'display_name', 'is_active', 'is_superuser', 'date_joined', 'last_login')
        read_only_fields = ('id', 'date_joined', 'last_login')

class AdminUserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating users in admin panel
    """
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'display_name', 'password', 'is_active', 'is_superuser')
    
    def validate_username(self, username):
        if len(username) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return username
    
    def validate_email(self, email):
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email
    
    def validate_display_name(self, display_name):
        if len(display_name.strip()) < 2:
            raise serializers.ValidationError("Display name must be at least 2 characters long.")
        return display_name.strip()
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating users in admin panel
    """
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'display_name', 'password', 'is_active', 'is_superuser')
    
    def validate_username(self, username):
        if len(username) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return username
    
    def validate_email(self, email):
        # Check if email exists for other users
        if User.objects.filter(email__iexact=email).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email
    
    def validate_display_name(self, display_name):
        if len(display_name.strip()) < 2:
            raise serializers.ValidationError("Display name must be at least 2 characters long.")
        return display_name.strip()
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance