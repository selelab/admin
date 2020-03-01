FROM python:3.8-alpine3.10

RUN apk update
RUN apk add openssl ca-certificates py-openssl wget py-mysqldb
RUN apk add --virtual build-dependencies libffi-dev openssl-dev python-dev py-pip build-base mariadb-dev

RUN mkdir -p /var/log/django
RUN mkdir /var/app
WORKDIR /var/app

RUN pip install pipenv

ADD Pipfile /var/app/
RUN pipenv install --dev

RUN apk del build-dependencies

ARG DJANGO_SETTINGS_MODULE
ARG DJANGO_SECRET_KEY
ARG DEBUG
ARG DB_NAME
ARG DB_USER
ARG DB_PASS
ARG DB_HOST
ARG DB_PORT
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_DB
ARG REDIS_PASS

ENV DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
ENV DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
ENV DEBUG=$DEBUG
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_DB=$REDIS_DB
ENV REDIS_PASS=$REDIS_PASS

ADD .yapfignore /var/app/
ADD entrypoint.sh /var/app/

COPY . /var/app

RUN pipenv run python manage.py collectstatic --noinput
# RUN python3 manage.py loaddata prod_seed_authenticate prod_seed_accounting
