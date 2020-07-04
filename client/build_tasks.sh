#!/bin/bash

# indent() {
#   sed -u 's/^/       /'
# }

[[ ! -z "$NODE_ENV" ]] && echo "NODE_ENV: $NODE_ENV"

# 1. Create production build
# -- Unless calling script via heroku-postbuild,
# -- handled automatically by Heroku Node.js buildpack
# yarn install
yarn build

# 2. Organise files to be collected and served by Django at client root
mkdir -p build/root
pushd build
ROOT_FILES="*.ico *.js *.json *.png robots.txt"
mv -v $ROOT_FILES root/ && npx cowsay "Files mooo-ved successfully!" && echo
popd

# 3. Collect static files for backend
# -- If Django is detected,
# -- handled automatically by Heroku Python buildpack
# pushd ../backend
# pipenv run python manage.py collectstatic --no-input
# popd
