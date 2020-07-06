"""
Django settings for production environment.
"""

import environ

from app.settings.base import *

# Define env defaults
env = environ.Env(
    # (type, default)
    DEBUG=(bool, False)
)

# Default false if not switched on in os.environ
DEBUG = env("DJANGO_DEBUG")

SECRET_KEY = env("DJANGO_SECRET_KEY")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Read "DATABASE_URL" variable from production config var bindings
DATABASES = {
    # Parses db connection url strings eg. postgres://user:pass@127.0.0.1:9876/db
    "default": env.db(),
}
