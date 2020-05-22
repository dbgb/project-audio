from django.db import models


class Track(models.Model):
    """
    Defines schema for Track model
    """
    # ID created automatically
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
