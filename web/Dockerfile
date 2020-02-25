FROM python:3.8

RUN mkdir /var/app
WORKDIR /var/app

RUN pip install pipenv

ADD Pipfile /var/app/
RUN pipenv install

COPY .env /var/

# RUN cd web
# RUN python3 manage.py migrate
# RUN python3 manage.py loaddata prod_seed_authenticate prod_seed_accounting
