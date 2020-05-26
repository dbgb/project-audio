import graphene
import tracks.schema
import users.schema


class Query(users.schema.Query, tracks.schema.Query, graphene.ObjectType):
    """
    Defines base query type for project
    """
    pass


class Mutation(users.schema.Mutation, tracks.schema.Mutation, graphene.ObjectType):
    """
    Defines base mutation type for project
    """
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
