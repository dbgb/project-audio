import graphene
import graphql_jwt
import tracks.schema
import users.schema


class Query(users.schema.Query, tracks.schema.Query, graphene.ObjectType):
    """
    Define base query type for project
    """

    pass


class Mutation(users.schema.Mutation, tracks.schema.Mutation, graphene.ObjectType):
    """
    Define base mutation type for project
    """

    # Enable JWT fields for all mutations
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
