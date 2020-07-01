# projectAudio

## Overview

TBD

## Deployment process: Heroku

The project is set up as a monorepo ie. we have a single git repository
containing more than one app (in our case, a client and a backend). Heroku
normally assumes a repo tracks a single app, but using a [multi-procfile
buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile)
allows us to tell Heroku how to handle both our client and our backend, at the
same time.

### Generating deployment files

```shell
# Check Django deployment checklist before proceeding
pipenv run python manage.py check --deploy

# Create backend configuration
echo web: gunicorn projectAudio.wsgi > app/Procfile
pipenv run pip freeze > requirements.txt
...

# Create client configuration
...

# Create project Heroku dynos
heroku login
heroku create projectaudio-api --buildpack django --remote heroku-api
heroku create projectaudio --buildpack mars/create-react-app --remote heroku-client

# Add multi-procfile buildpack to each app
heroku buildpacks:add -a projectaudio-api https://github.com/heroku/heroku-buildpack-multi-procfile
heroku buildpacks:add -a projectaudio https://github.com/heroku/heroku-buildpack-multi-procfile

# Set Procfile locations
heroku config:set -a projectaudio-api PROCFILE=backend/Procfile
heroku config:set -a projectaudio PROCFILE=client/Procfile

# Push project monorepo to Heroku remote
git push heroku-api master
git push heroku-client master

# !
heroku open
```

## Further information

Technical overviews as well as further documentation for both the client and
backend can be found [here](client/README.md) and [here](backend/README.md)
respectively.
