FROM node:lts-alpine

RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli

WORKDIR /app
ADD package*.json /app
ADD yarn.lock /app
RUN yarn install

CMD ["yarn", "run", "serve"]
