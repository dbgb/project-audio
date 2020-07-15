# README: Deployment

## Contents

- [README: Deployment](#readme-deployment)
  - [Contents](#contents)
  - [Overview](#overview)
    - [Deployment options](#deployment-options)
    - [Deployment reasoning](#deployment-reasoning)
  - [Project deployment: Heroku](#project-deployment-heroku)
    - [Using Heroku with a monorepo](#using-heroku-with-a-monorepo)
    - [Deployment process](#deployment-process)
  - [Troubleshooting](#troubleshooting)

## Overview

### Deployment options

1. _Same machine, handled by separate servers_

   - eg. Express.js static server, Gunicorn + Django API server

2. _Same machine and server_

   - eg. Gunicorn + Django serving both API and static build files

3. _Same machine, with API Gateway_

   - eg. Gunicorn + Django API server, NGINX acting as static server and reverse
     proxy to API

4. _Separate machines_
   - eg.
     - Static server on AWS S3, API server on DigitalOcean VPS
     - Two Heroku dynos

### Deployment reasoning

For the purposes of relatively small-scale project, option 3 seems excessive and
option 4 is doesn't provide any obviously significant benefits over deploying on
a single machine \- which leaves us with options 1 and 2 to consider.

If we deploy as two apps _(option 1 above)_, it means writing a Node.js static
server for the frontend client and configuring CORS so that the frontend can
communicate with the Django API via AJAX.

This can certainly be done in a relatively short timeframe, however there is a
more convenient way to deploy the project as a single app _(option 2 above)_.
Django can quite capably act as both API server and static server via WhiteNoise
middleware. This approach means the app can be built and served from a single
machine instance and from a single domain (no CORS configuration required).

The backend code has been written in a modular style, with [Twelve-Factor best
practices](https://aws.amazon.com/blogs/compute/applying-the-twelve-factor-app-methodology-to-serverless-applications/)
in mind, to keep as much configuration in the deployment environment as
possible. This means we aren't bound to any particular service provider and can
make our backend code compatible with other platforms with minimal effort.

In the next section, we will look at how to deploy the entire project on Heroku
\- although, as stated above, the same information applies broadly to any
platform-as-a-service provider.

## Project deployment: Heroku

### Using Heroku with a monorepo

Our project is set up as a monorepo ie. a single git repo tracking multiple
projects. Organising the project structure in this way allows changes related to
both the frontend and backend code to be checked into version control together,
whilst maintaining separation of concerns, versions and issues for each
individual project.

Another benefit of this approach is that we can serve both the client and API,
and create client builds from the same machine instance. In the case of Heroku,
this means we can deploy as a single app instead of two \- instantly halving the
dyno hours required (and the potential cost) to host the project.

As the backend is expected to serve the compiled client static build files,
being able to simply collect and serve the latest build from the client folder
means that the entire process can be easily automated without a broker \-
_build, collect, serve_.

Heroku normally assumes that a repo tracks a single application, but it is
possible to set up two, or more, apps at the same time using a
[multi-procfile](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile)
buildpack, or a buildpack that allows [subdirectory
inspection](https://github.com/negativetwelve/heroku-buildpack-subdir)
.

The former can be handy if the goal is to run the client and API on separate
Heroku dynos, but in our case the latter is more suitable \- we will only need a
single permanent dyno to serve the entire project after the client build has
been created and collected.

### Deployment process

_From the project root directory:_

```shell
# -- Check Django deployment checklist and act accordingly
pushd backend
pipenv run python manage.py check --deploy
popd

# -- Configure Heroku deployment dependencies
# re: https://devcenter.heroku.com/articles/django-app-configuration
# Install and freeze dependencies for production stability
pipenv install gunicorn psycopg2
pipenv run pip freeze > requirements.txt

# -- Create procfile at project root
# On new release perform Django db migration, if necessary
echo release: python backend/manage.py migrate > Procfile
echo web: gunicorn --pythonpath backend app.wsgi --preload --log-file - >> Procfile

# -- Initialise Heroku app and its associated remote branch
heroku login
heroku create projectaudio

# -- Assign buildpacks
# Make monorepo compatible with Heroku build process
heroku buildpacks:set https://github.com/negativetwelve/heroku-buildpack-subdir

# Order ensures client build files are available before Python buildpack collects static files
client=https://github.com/heroku/heroku-buildpack-nodejs.git > .buildpacks
backend=https://github.com/heroku/heroku-buildpack-python.git >> .buildpacks

# -- Provision postgres production db to persist backend data
# https://devcenter.heroku.com/articles/heroku-postgresql
# Automatically creates DATABASE_URL Heroku env variable
heroku addons:create -a projectaudio heroku-postgresql:hobby-dev

# -- Set deployment environment variables
heroku config:set ALLOWED_HOSTS="<PROJECT_NAME>.herokuapp.com"
heroku config:set DJANGO_DEBUG=
heroku config:set DJANGO_SECRET_KEY=<SECRET_KEY>
heroku config:set DJANGO_SETTINGS_MODULE="app.settings.heroku"

# -- Check deployment environment variables
heroku config

# -- Push project monorepo to Heroku remote
git push heroku master

# -- After successful deploy, view live project in web browser
heroku open
```

## Troubleshooting

- _Error H14: ["No web processes running"](https://stackoverflow.com/questions/18552846/)_

  - If after a successful deploy `heroku logs --tail` indicates the above error,
    try running `heroku ps:scale web=1` to spin up a web process.
