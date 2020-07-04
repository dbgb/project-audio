release: python backend/manage.py migrate
web: gunicorn --pythonpath backend app.wsgi --log-file -
