FROM python:3.8

RUN mkdir /var/app
WORKDIR /var/app

RUN pip install pipenv

ADD Pipfile /var/app/
RUN pipenv install

ADD .env /var/
ADD entrypoint.sh /var/app/
# RUN python3 manage.py loaddata prod_seed_authenticate prod_seed_accounting
