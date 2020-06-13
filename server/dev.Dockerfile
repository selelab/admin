FROM nginx:latest

ADD dev.default.conf /etc/nginx/nginx.conf.template
ADD uwsgi_params /etc/nginx/conf/
