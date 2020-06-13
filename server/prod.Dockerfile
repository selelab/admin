FROM nginx:latest

ADD prod.default.conf /etc/nginx/nginx.conf.template
ADD uwsgi_params /etc/nginx/conf/
