# projectAudio

## Overview

TODO

TODO: (START) -- Move the following section to general deployment miniguide,
keep this section for "at a glance" material

## Deployment options

re:

```links
https://librenepal.com/article/django-and-create-react-app-together-on-heroku/
https://devcenter.heroku.com/articles/sqlite3
https://devcenter.heroku.com/articles/heroku-postgresql
https://12factor.net/
https://github.com/joke2k/django-environ
https://stackoverflow.com/questions/18552846/no-web-processes-running-django-in-heroku
https://stackoverflow.com/questions/16416172/run-gunicorn-process-in-a-non-standard-folder
https://devblog.kogan.com/blog/making-heroku-subdirectories-easier
https://old.reddit.com/r/django/comments/h7kslz/why_is_djangoheroku_archived/
```

N.B. The term _"machine"_ in the following section can be taken to mean either
physical, or virtual.

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

tl;dr: We can deploy as two separate apps, or as a single app

1. _Two apps (Option 1)_

   - App 1: Express.js serving static client build
   - App 2: Django API

2. _Single app (Option 2)_

   - App 1: Django API and middleware static server

For the reasons outlined in the next section, I am choosing option 2.

## Project deployment: Heroku

### Using Heroku with a monorepo

Our project is set up as single git repo tracking multiple projects ie. a
monorepo. The project structure is organised this way both for convenience,
potential cost, and to maximise separation of concerns between frontend and
backend code.

As the backend is expected to serve the compiled client static build files,
being able to simply collect and serve the latest build from the client folder
means that the entire process can be easily automated without a broker - Build,
collect, serve.

Another benefit of this approach is that we can serve both the client and API,
and create client builds from the same machine instance. In the case of Heroku,
this means we can deploy as a single app instead of two - instantly halving the
dyno hours required (and the potential cost) to host the project.

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

### Deployment process

_From the project root directory:_

```shell
# -- Check Django deployment checklist and act accordingly
pipenv run python backend/manage.py check --deploy

# -- Configure Heroku deployment dependencies
# re: https://devcenter.heroku.com/articles/django-app-configuration
pipenv install gunicorn dj-database-url psycopg2
pipenv run pip freeze > requirements.txt

# -- Create backend procfile
# On new release perform Django db migration, if necessary
echo release: pipenv run python backend/manage.py migrate > Procfile
# Specify production API server settings
echo web: gunicorn --chdir backend app.wsgi --log-file - >> Procfile

echo web: gunicorn app.wsgi --log-file -

# -- Create Heroku app
heroku login
heroku create projectaudio

# -- Assign buildpacks
# Make monorepo compatible with Heroku build process
# Ensure React build is complete before Python buildpack collects static files
heroku buildpacks:set https://github.com/negativetwelve/heroku-buildpack-subdir
heroku buildpacks:add -a projectaudio --index 2 heroku/nodejs
heroku buildpacks:add -a projectaudio --index 3 heroku/python

OR

# Ensure React build is complete before Python buildpack collects static files
heroku buildpacks:set -a projectaudio --index 1 heroku/nodejs
heroku buildpacks:add -a projectaudio --index 2 heroku/python

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
