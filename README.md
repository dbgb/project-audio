# projectAudio

## Overview

TODO

## Project deployment: Heroku

The project is set up as a monorepo ie. we have a single git repository
containing more than one app (in our case, a React-based client and a
Django-based GraphQL API). Heroku normally assumes a repo tracks a single app,
but using a [multi-procfile
buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile)
allows us to tell Heroku how to handle both our client and the API, at the same
time.

### Production choices

TODO: Move to general deployment guide, keep relevant info here

_Deploying client and API on:_

1. Same machine, handled by separate servers
   - eg. _Express.js client server, Gunicorn API server_
2. Same machine, with API behind a reverse proxy
   - eg. _NGINX serves client static files and proxies requests to Gunicorn API
     server_
3. Same machine and server
   - eg. _Gunicorn serving API and client build files with WhiteNoise middleware_
4. Separate machines
   - eg. _Client static file server on AWS S3, API server on DigitalOcean VPS_
   - OR _2 Heroku dynos_

### Deployment process

_From the project root directory:_

```shell
# -- Check Django deployment checklist before proceeding
# Take action at your discretion
pipenv run python backend/manage.py check --deploy

# -- Create two separate Heroku dynos
heroku login
heroku create projectaudio-api --remote heroku-api
heroku create projectaudio --buildpack mars/create-react-app --remote heroku-client

# -- Configure Heroku deployment dependencies
# re: https://devcenter.heroku.com/articles/django-app-configuration
pipenv install gunicorn django-heroku
pipenv run pip freeze > backend/requirements.txt

# -- Create backend procfile
# On new release perform Django db migration, if necessary
echo release: python manage.py migrate > backend/Procfile
# Specify production API server settings
echo web: gunicorn --chdir backend app.wsgi --log-file - >> backend/Procfile

# -- Create client procfile
# ...
echo web: ... > client/Procfile


# -- Add multi-procfile buildpack to each app
heroku buildpacks:add -a projectaudio-api https://github.com/heroku/heroku-buildpack-multi-procfile
heroku buildpacks:add -a projectaudio https://github.com/heroku/heroku-buildpack-multi-procfile

# -- Set Procfile locations
heroku config:set -a projectaudio-api PROCFILE=backend/Procfile
heroku config:set -a projectaudio PROCFILE=client/Procfile

# -- Add postgres db to persist backend data
heroku addons:create -a projectaudio-api heroku-postgresql:hobby-dev

# -- Push project monorepo to Heroku remote
git push heroku-api master
git push heroku-client master

# -- Set environment variables for backend
heroku config:set -a projectaudio-api DJANGO_DEBUG=
heroku config:set -a projectaudio-api DJANGO_SECRET_KEY=<insert_secret_key_here>
heroku config:set -a projectaudio-api REACT_APP_ENDPOINT=<insert_location_here>

# -- Set environment variables for client
heroku config:set -a projectaudio REACT_APP_GQL_ENDPOINT=<insert_location_here>

# -- Open live project in browser
heroku open
```

## Further information

Technical overviews as well as further documentation for both the client and
backend API can be found [here](client/README.md) and [here](backend/README.md)
respectively.
