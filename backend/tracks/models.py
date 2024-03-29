from django.db import models
from django.contrib.auth import get_user_model


class Track(models.Model):
    """
    Define schema for Track model
    """

    # ID created automatically
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    # Entire track is cascade deleted if associated user is deleted
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)


class Like(models.Model):
    """
    Define schema for Like model

    Presence of a "like" asserts a relationship between a user and a track
    """

    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    track = models.ForeignKey("tracks.Track", related_name="likes", on_delete=models.CASCADE)

