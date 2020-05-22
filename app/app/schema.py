import graphene
import tracks.schema


class Query(tracks.schema.Query, graphene.ObjectType):
    """
    Defines master root query type for project
    """
    pass


schema = graphene.Schema(query=Query)
