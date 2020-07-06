# README: Deployment

## Deployment options

Options for project deployment include:

1. _Same machine, handled by separate servers_

   - eg. Express.js static server, Gunicorn + Django API server

2. _Same machine and server_

   - eg. Gunicorn + Django serving both API and static build files
   - re: <https://librenepal.com/article/django-and-create-react-app-together-on-heroku/>

3. _Same machine, with API Gateway_

   - eg. Gunicorn + Django API server, NGINX acting as static server and reverse
     proxy to API
   - re: <https://www.nginx.com/blog/building-microservices-using-an-api-gateway/>

4. _Separate machines_
   - eg.
     - Static server on AWS S3, API server on DigitalOcean VPS
     - Two Heroku dynos

TL;DR: We can deploy as two separate apps, or as a single app

- _Two apps (Option 1 above)_

  - App 1: Express.js serving static client build
  - App 2: Django API

- _Single app (Option 2 above)_

  - App 1: Django API and middleware static server

For the reasons outlined in the next section, I am choosing option 2.

## Project deployment: Heroku

### Using Heroku with a monorepo

Our project is set up as single git repo tracking multiple projects ie. a
monorepo. Organising the project structure in this way allows related changes to
both the frontend and backend code to be checked into version control together,
whilst maintaining separation of concerns, versions and issues for each
individual project.

Another benefit of this approach is that we can serve both the client and API,
and create client builds from the same machine instance. In the case of Heroku,
this means we can deploy as a single app instead of two - instantly halving the
dyno hours required (and the potential cost) to host the project.

As the backend is expected to serve the compiled client static build files,
being able to simply collect and serve the latest build from the client folder
means that the entire process can be easily automated without a broker - Build,
collect, serve.

Heroku normally assumes a repo tracks a single app, but it is possible to set up
two, or more, apps at the same time using a
[multi-procfile](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile)
buildpack, or a buildpack that allows [subdirectory
inspection](https://github.com/negativetwelve/heroku-buildpack-subdir)
.

The former can be handy if the goal is to run the client and API on separate
Heroku dynos, but in our case the latter is more suitable - we will only need a
single permanent dyno to serve the entire project after the client build has
been created and collected.

## Deployment process

_From the project root directory:_

```shell
# -- Check Django deployment checklist and act accordingly
pushd backend
pipenv run python manage.py check --deploy
popd

# -- Configure Heroku deployment dependencies
# re: https://devcenter.heroku.com/articles/django-app-configuration
pipenv install gunicorn psycopg2
# Freeze dependencies for production stability
pipenv run pip freeze > requirements.txt

# -- Create procfile at project root
# On new release perform Django db migration, if necessary
echo release: python backend/manage.py migrate > Procfile
echo web: gunicorn --pythonpath backend app.wsgi --log-file - >> Procfile

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

# -- After successful deploy, open live project in browser
heroku open

```

### Troubleshooting

- _Error H14: ["No web processes running"](https://stackoverflow.com/questions/18552846/)_

  - If after a successful deploy `heroku logs --tail` indicates the above error,
    try running `heroku ps:scale web=1` to spin up a web process.
