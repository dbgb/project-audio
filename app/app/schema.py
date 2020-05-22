import graphene
import tracks.schema


class Query(tracks.schema.Query, graphene.ObjectType):
    """
    Defines base query type for project
    """
    pass


class Mutation(tracks.schema.Mutation, graphene.ObjectType):
    """
    Defines base mutation type for project
    """
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
