from django.contrib import admin
from tracks.models import Track
from tracks.models import Like

# Register Track models
admin.site.register(Track)
admin.site.register(Like)
