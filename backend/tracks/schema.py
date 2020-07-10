import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from users.schema import UserType
from .models import Track, Like


class TrackType(DjangoObjectType):
    """
    Transform django Track model into graphene compatible ObjectType
    """

    class Meta:
        model = Track


class LikeType(DjangoObjectType):
    """
    Transform django Like model into graphene compatible ObjectType
    """

    class Meta:
        model = Like


class Query(graphene.ObjectType):
    """
    Define base query type for tracks app, to be inherited by base query type
    in project schema file
    """

    # Fields
    tracks = graphene.List(TrackType, search=graphene.String())
    likes = graphene.List(LikeType)

    # Resolvers
    def resolve_tracks(self, info, search=None):
        if search:
            query = (
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(url__icontains=search)
                | Q(posted_by__username__icontains=search)
            )
            return Track.objects.filter(query)

        return Track.objects.all()

    def resolve_likes(self, info):
        return Like.objects.all()


class CreateTrack(graphene.Mutation):
    """
    Define mutation fields and resolvers for creating Track objects
    """

    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        """
        Allow an authenticated user to create tracks
        """
        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise GraphQLError("Please log in to add a track.")

        title = kwargs.get("title")
        description = kwargs.get("description")
        url = kwargs.get("url")
        track = Track(title=title, description=description, url=url, posted_by=user)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    """
    Define mutation fields and resolvers for updating Track objects
    """

    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        """
        Allow an authenticated user to update an existing track
        """
        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise GraphQLError("Please log in to modify tracks.")

        track = Track.objects.get(id=kwargs.get("track_id"))

        if track.posted_by != user:
            # Only allow users to update tracks associated with the currently
            # authenticated account
            raise GraphQLError("You do not have permission to update this track.")

        track.title = kwargs.get("title")
        track.description = kwargs.get("description")
        track.url = kwargs.get("url")

        track.save()

        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    """
    Define mutation fields and resolvers for deleting Track objects
    """

    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        """
        Allow an authenticated user to delete an existing track
        """

        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise GraphQLError("Please log in to modify tracks.")

        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            # Only allow users to delete tracks associated with the currently
            # authenticated account
            raise GraphQLError("You do not have permission to delete this track.")

        track.delete()

        return DeleteTrack(track_id=track_id)


class LikeTrack(graphene.Mutation):
    """
    Define mutation fields and resolvers for liking Track objects

    (Idempotent)
    """

    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        """
        Allow an authenticated user to like an existing track
        """

        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise GraphQLError("Please log in to like tracks.")

        track = Track.objects.get(id=track_id)
        if not track:
            raise GraphQLError("Track does not exist.")

        try:
            like = Like.objects.get(user=user, track=track)
            if like:
                # Idempotent - multiple likes for same user and track not permitted
                return
        except Like.DoesNotExist:
            # Track is not currently liked, safe to create new like
            Like.objects.create(user=user, track=track)

        return LikeTrack(user=user, track=track)


class UnlikeTrack(graphene.Mutation):
    """
    Define mutation fields and resolvers for unliking Track objects
    
    (Idempotent)
    """

    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        """
        Allow an authenticated user to unlike an existing track
        """

        user = info.context.user
        if user.is_anonymous:
            # Verify user is authenticated before proceeding
            raise GraphQLError("Please log in to unlike tracks.")

        track = Track.objects.get(id=track_id)
        if not track:
            raise GraphQLError("Track does not exist.")

        try:
            # If like exists, delete it
            like = Like.objects.get(user=user, track=track)
            like.delete()
        except Like.DoesNotExist:
            # Idempotent - unliking has no effect on not liked track
            return

        return UnlikeTrack(user=user, track=track)


class Mutation(graphene.ObjectType):
    """
    Define base mutation type for tracks app, to be inherited by base query
    type in project schema file
    """

    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    like_track = LikeTrack.Field()
    unlike_track = UnlikeTrack.Field()
