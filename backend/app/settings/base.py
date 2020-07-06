"""
Django base settings for app project.

Generated by 'django-admin startproject' using Django 3.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

from datetime import timedelta
import os
import environ


# Define env defaults
env = environ.Env(
    # (type, default)
    DEBUG=(bool, False),
    USE_CORS_MIDDLEWARE=(bool, False),
)

# Read in development env file
# N.B. https://github.com/joke2k/django-environ#multiple-env-files
environ.Env.read_env()

# Build paths inside the project like this: os.path.join(BACKEND_DIR, ...)
SETTINGS_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(os.path.dirname(SETTINGS_DIR))
FRONTEND_DIR = os.path.abspath(os.path.join(BACKEND_DIR, "..", "client"))

# Default false if not switched on in os.environ
DEBUG = env("DJANGO_DEBUG")

# Double check production settings checklist before deployment
# https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

SECRET_KEY = env("DJANGO_SECRET_KEY")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "graphene_django",
    "tracks.apps.TracksConfig",
]

GRAPHENE = {
    # Tell django where the graphene schema is located
    "SCHEMA": "app.schema.schema",
    "MIDDLEWARE": ["graphql_jwt.middleware.JSONWebTokenMiddleware",],
}

GRAPHQL_JWT = {
    # Configure token strategy
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_EXPIRATION_DELTA": timedelta(days=7),
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]

# Origins that are authorized to make cross-site HTTP requests
# https://github.com/adamchainz/django-cors-headers#cors_origin_whitelist
if env("USE_CORS_MIDDLEWARE"):
    CORS_ORIGIN_WHITELIST = [
        env("REACT_APP_CLIENT_ENDPOINT"),
        env("REACT_APP_SERVER_ENDPOINT"),  # Also acts as local prod build server
    ]

AUTHENTICATION_BACKENDS = [
    "graphql_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
]

ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(FRONTEND_DIR, "build")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BACKEND_DIR, "db.sqlite3"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"

# WhiteNoise configuration
# http://whitenoise.evans.io/en/stable/django.html

STATIC_ROOT = os.path.join(BACKEND_DIR, "static")

STATICFILES_DIRS = [
    # Client build files location
    os.path.join(FRONTEND_DIR, "build", "static")
]

# Directory of files which will be served at the client root
WHITENOISE_ROOT = os.path.join(FRONTEND_DIR, "build", "root")

# Enable static file compression and caching support
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
