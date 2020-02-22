FROM ubuntu:16.04

# ubuntu:16.04には設定されてないので設定しておく
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

# 適当なディレクトリ作って移動
RUN mkdir /var/app
WORKDIR /var/app

# python, curl install
RUN apt update && apt install -y python3 curl mysql-client

RUN apt install -y python-dev libmysqlclient-dev

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

RUN python3 get-pip.py
ADD requirements.txt /var/app/

RUN pip install -r requirements.txt

COPY . /var/app

RUN cd web

RUN python manage.py migrate
RUN python manage.py loaddata prod_seed_authenticate prod_seed_accounting

ENTRYPOINT ["python", "manage.py", "runserver"]

