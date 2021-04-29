FROM python:3.8-buster

RUN apt update && \
apt install -y openssl ca-certificates wget python-mysqldb

RUN mkdir -p /var/log/django
RUN mkdir /var/app
WORKDIR /var/app

ADD requirements.txt .
RUN echo 'manylinux1_compatible = True' > /usr/local/lib/python3.8/site-packages/_manylinux
RUN pip install -r requirements.txt

ADD .yapfignore /var/app/
