FROM ubuntu:16.04

# ubuntu:16.04には設定されてないので設定しておく
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

RUN mkdir /var/app
WORKDIR /var/app

RUN apt update
RUN apt install -y python3 curl gcc python3-dev libmysqlclient-dev

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

RUN python3 get-pip.py
ADD requirements.txt /var/app/

RUN pip install -r requirements.txt

COPY . /var/app

RUN cd web

RUN python3 manage.py migrate
RUN python3 manage.py loaddata prod_seed_authenticate prod_seed_accounting

ENTRYPOINT ["python3", "manage.py", "runserver"]
