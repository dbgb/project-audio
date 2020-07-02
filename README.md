# projectAudio

## Overview

TODO

## Project deployment: Heroku

re:

```links
https://12factor.net/
https://devcenter.heroku.com/articles/sqlite3
https://devcenter.heroku.com/articles/heroku-postgresql
https://github.com/joke2k/django-environ
https://stackoverflow.com/questions/18552846/no-web-processes-running-django-in-heroku
```

tl;dr:

- Two apps (Option 1):
  - App 1: Express serving React static build
  - App 2: Django API
- Single app (Option 2):
  - App 1: Django API and serving React static build with middleware

TODO: (START) -- Move this section to general heroku deployment guide, copy
relevant info here

### Using Heroku with a monorepo

The project is set up as a monorepo ie. we have a single git repository
containing more than one app (in our case, a React-based client and a
Django-based GraphQL API). Heroku normally assumes a repo tracks a single app,
but it is possible to set up two, or more, apps at the same time using a
[multi-procfile
buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile).

This can be handy if the goal is to run the client and API on separate Heroku
dynos.

### Production options

N.B. The term _"machine"_ in the following section can be taken to mean either
physical, or virtual.

Deploying client and API on:

1. _Same machine, handled by separate servers_

   - eg. Express.js client server, Gunicorn API server

2. _Same machine, with API Gateway_

   - eg. Gunicorn API server, NGINX client server and acts as reverse proxy for
     API server requests
   - re: <https://www.nginx.com/blog/building-microservices-using-an-api-gateway/>

3. _Same machine and server_

   - eg. Gunicorn serving API and client static build files with Django
     WhiteNoise middleware
   - re: <https://librenepal.com/article/django-and-create-react-app-together-on-heroku/>

4. _Separate machines_
   - eg. Client static file server on AWS S3, API server on DigitalOcean VPS
   - OR 2 Heroku dynos

### Deployment process (Option 3.)

_From the project root directory:_

```shell
# -- Check Django deployment checklist and act accordingly
pipenv run python backend/manage.py check --deploy

# -- Configure Heroku deployment dependencies
# re: https://devcenter.heroku.com/articles/django-app-configuration
pipenv install gunicorn whitenoise django-heroku
pipenv run pip freeze > requirements.txt

# -- Create backend procfile
# On new release perform Django db migration, if necessary
echo release: pipenv run python backend/manage.py migrate > Procfile
# Specify production API server settings
echo web: gunicorn --chdir backend app.wsgi --log-file - >> Procfile

# -- Create Heroku app
heroku login
heroku create projectaudio

# -- Assign buildpacks
# Ensure React build is complete before Python buildpack collects static files
heroku buildpacks:set -a projectaudio heroku/python
heroku buildpacks:add -a projectaudio --index 1 heroku/nodejs

# -- Add postgres db to persist backend data
heroku addons:create -a projectaudio heroku-postgresql:hobby-dev

# -- Set deployment environment variables
heroku config:set DJANGO_DEBUG=
heroku config:set DJANGO_SECRET_KEY=<insert_secret_key_here>
heroku config:set REACT_APP_CLIENT_ENDPOINT=<insert_project_url_here>
heroku config:set REACT_APP_SERVER_ENDPOINT=<insert_project_url_here>
heroku config:set REACT_APP_GQL_ENDPOINT=<insert_project_url_here>

# -- Spin up a web dyno to power the project
heroku ps:scale -a projectaudio web=1

# -- Push project monorepo to Heroku remote
git push heroku master

# -- Open live project in browser
heroku open
```

TODO: (END)

## Further information

Technical overviews as well as further documentation for both the client and
backend API can be found [here](client/README.md) and [here](backend/README.md)
respectively.
