FROM node:lts-alpine

RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli

WORKDIR /app
ADD package*.json ./
ADD yarn.lock ./
RUN yarn install
ADD . ./
RUN yarn build

CMD ["yarn", "run", "serve"]
