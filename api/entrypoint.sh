pipenv run python manage.py migrate
pipenv run python manage.py collectstatic --noinput
pipenv run uwsgi --socket :8001 --module web.wsgi --py-autoreload 1 --logto /tmp/mylog.log
