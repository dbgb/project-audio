import graphene
from graphene_django import DjangoObjectType
from .models import Track


class TrackType(DjangoObjectType):
    """
    Transforms django model into graphene compatible ObjectType
    """
    class Meta:
        model = Track


class Query(graphene.ObjectType):
    """
    Defines base query type for tracks app, to be inherited by base query type
    in project schema file
    """
    # Fields
    tracks = graphene.List(TrackType)

    # Resolvers
    def resolve_tracks(self, info):
        return Track.objects.all()


class CreateTrack(graphene.Mutation):
    """
    Defines mutation fields and resolvers for creating Track objects
    """

    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        """
        Allows an authenticated user to create tracks
        """
        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise Exception("Please log in to add a track.")

        title = kwargs.get("title")
        description = kwargs.get("description")
        url = kwargs.get("url")
        track = Track(title=title, description=description,
                      url=url, posted_by=user)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    """
    Defines mutation fields and resolvers for updating Track objects
    """

    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        """
        Allows an authenticated user to update an existing track
        """
        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise Exception("Please log in to modify tracks.")

        track = Track.objects.get(id=kwargs.get("track_id"))

        if track.posted_by != user:
            # Only allow users to update tracks associated with the currently
            # authenticated account
            raise Exception(
                "You do not have permission to update this track.")

        track.title = kwargs.get("title")
        track.description = kwargs.get("description")
        track.url = kwargs.get("url")

        track.save()

        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    """
    Defines mutation fields and resolvers for deleting Track objects
    """

    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        """
        Allows an authenticated user to delete an existing track
        """

        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise Exception("Please log in to modify tracks.")

        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            # Only allow users to delete tracks associated with the currently
            # authenticated account
            raise Exception(
                "You do not have permission to delete this track.")

        track.delete()

        return DeleteTrack(track_id=track_id)


class Mutation(graphene.ObjectType):
    """
    Defines base mutation type for tracks app, to be inherited by base query
    type in project schema file
    """

    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
