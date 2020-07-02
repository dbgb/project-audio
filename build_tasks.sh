#!/bin/bash

# 1. Create production build
cd client
yarn build

# 2. Organise files to be collected and served by Django at client root
mkdir -p build/root
cd build
ROOT_FILES="*.ico *.js *.json *.png robots.txt"
mv $ROOT_FILES root/
cd ../..

# 3. Collect static files for backend
pushd backend
pipenv run python manage.py collectstatic --no-input
popd
