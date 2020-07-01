# README: Backend

## Overview

The backend for the app is implemented using:

- [Django](https://docs.djangoproject.com/en/3.0/intro/overview/) \- For data modelling, querying, auth and administration.
- [graphene-django](https://docs.graphene-python.org/en/latest/quickstart/) \- To interface with Django models and describe the GraphQL API request and response data in the form of Python schema.

## Setting up the development environment

The following instructions presume the user has a basic familiarity with the
command line, and both Python 3 and Pip installed. If you need help with the
latter, the docs at
[python-guide](https://docs.python-guide.org/starting/installation/) can help
you get set up.

```shell
# Make sure python and pip are installed
python --version
pip --version

# Initialize virtual environment
pip install --user pipenv

# Install dependencies from Pipfile
pipenv install

# Start the development server
pipenv run python manage.py runserver <PORT?>
```

## Interacting with the GraphQL API

Navigate to `localhost:<PORT>/graphql` in your browser to explore the API using
GraphiQL. The [Apollo Client
Devtools](https://github.com/apollographql/apollo-client-devtools) provide the
same capabilities, plus the ability to inspect and manipulate the Apollo Client
cache and store. Alternatively, feel free to point your API tool of choice
(Postman, Insomnia etc.) at the same `graphql` endpoint as above.

Creating a new user can be done via the `createUser` mutation. For operations
that require them, auth tokens are granted by supplying valid user credentials
to the `tokenAuth` mutation eg.

```gql
mutation($username: String!, $password: String!){
  tokenAuth(username: <your_username>, password: <your_password> {
    token
    payload
  }
}
```

The token returned as part of the mutation response can then be used as a JWT
authentication header to allow the user to perform any privileged operations
their account has been granted access to.

## Managing project model data

```shell
# Create a project superuser account
pipenv run python manage.py createsuperuser
```

Then navigate to `localhost:<PORT>/admin` and log in with the superuser
credentials. From here, Django admin provides a complete interface for the API
CRUD operations.
