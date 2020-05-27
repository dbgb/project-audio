from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    """
    Transform Django user model into graphene compatible ObjectType
    """
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    """
    Define base query type for users, to be inherited by base query type
    in project schema file
    """
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    me = graphene.Field(UserType)

    def resolve_user(self, info, id):
        return get_user_model().objects.get(id=id)

    def resolve_me(self, info):
        """
        Return context information available for the currently authenticated user
        """
        # graphene-python with GraphQLView enabled gives access to a per-request
        # context object via the info parameter.
        # https://docs.graphene-python.org/projects/django/en/latest/authorization/#user-based-queryset-filtering
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not logged in!")
        return user


class CreateUser(graphene.Mutation):
    """
    Define mutation fields and resolvers for creating User objects
    """
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        # Django autohashes passwords before storing
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(username=username, email=email)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    """
    Define base mutation type for users, to be inherited by base query
    type in project schema file
    """
    create_user = CreateUser.Field()
