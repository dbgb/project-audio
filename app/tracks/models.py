from django.db import models
from django.contrib.auth import get_user_model


class Track(models.Model):
    """
    Defines schema for Track model
    """
    # ID created automatically
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    # Entire track is cascade deleted if associated user is deleted
    posted_by = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
