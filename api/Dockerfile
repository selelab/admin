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

ADD .yapfignore /var/app/
