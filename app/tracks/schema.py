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
    Defines root query type for tracks app, to be inherited by master root query
    type in project schema file
    """
    tracks = graphene.List(TrackType)

    # Resolvers
    def resolve_tracks(self, info):
        return Track.objects.all()
