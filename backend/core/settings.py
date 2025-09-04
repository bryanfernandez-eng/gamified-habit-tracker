from pathlib import Path

# --- Paths & basics ---
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "dev-secret-key-change-me"
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# --- Installed apps ---
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",  # required by allauth

    # Third-party
    "rest_framework",
    "rest_framework.authtoken",  # needed for dj-rest-auth tokens
    "corsheaders",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",

    # Local
    "api",
]

SITE_ID = 1

# --- Middleware ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # keep CORS at the top
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",  # required by allauth (newer versions)
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- URL / WSGI ---
ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],  # add template dirs here if needed
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",  # required by allauth
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# --- Database (SQLite for dev) ---
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# --- Passwords (relaxed for dev; tighten for prod) ---
AUTH_PASSWORD_VALIDATORS = []

# --- i18n / tz ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static files ---
STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- CORS/CSRF for Vite dev server ---
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

# --- DRF config ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}

# --- allauth / dj-rest-auth basics ---
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

ACCOUNT_LOGIN_METHODS = {"email", "username"}  # allow login by email OR username
ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]  # * = required
ACCOUNT_EMAIL_VERIFICATION = "optional"

# If you ever want to disable tokens entirely, uncomment:
# DJ_REST_AUTH = {"TOKEN_MODEL": None}
