from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    """
    Transforms Django user model into graphene compatible ObjectType
    """
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    """
    Defines base query type for users, to be inherited by base query type
    in project schema file
    """
    user = graphene.Field(UserType, id=graphene.Int(required=True))

    def resolve_user(self, info, id):
        return get_user_model().objects.get(id=id)


class CreateUser(graphene.Mutation):
    """
    Defines mutation fields and resolvers for creating User objects
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
    Defines base mutation type for users, to be inherited by base query
    type in project schema file
    """
    create_user = CreateUser.Field()
