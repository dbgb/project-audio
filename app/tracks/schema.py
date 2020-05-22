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
    # Fields
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    # Resolvers
    def mutate(self, info, **kwargs):
        title = kwargs.get("title")
        description = kwargs.get("description")
        url = kwargs.get("url")

        track = Track(title=title, description=description, url=url)
        track.save()
        return CreateTrack(track=track)


class Mutation(graphene.ObjectType):
    """
    Defines base mutation type for tracks app, to be inherited by base query
    type in project schema file
    """
    create_track = CreateTrack.Field()
