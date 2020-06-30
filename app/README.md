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

Then navigate to `localhost` at your port and browser of choice.

## Generating production deployment files

```shell
echo web: gunicorn projectAudio.wsgi > Procfile
pipenv run pip freeze > requirements.txt
```
