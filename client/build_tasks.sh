#!/bin/bash

# 1. Create production build
yarn install
yarn build

# 2. Organise files to be collected and served by Django at client root
mkdir -p build/root
cd build
ROOT_FILES="*.ico *.js *.json *.png robots.txt"
mv -v $ROOT_FILES root/ && echo
cd ../..

# 3. Collect static files for backend
# (Handled automatically by Heroku python buildpack in production)
# pushd backend
# pipenv run python manage.py collectstatic --no-input
# popd
