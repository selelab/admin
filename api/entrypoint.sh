python manage.py migrate
python manage.py collectstatic --noinput
uwsgi --socket :8001 --module web.wsgi --py-autoreload 1 --logto /tmp/mylog.log
