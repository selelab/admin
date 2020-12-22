FROM node:12
RUN npm install -g @vue/cli

WORKDIR /app
ADD package*.json ./
ADD yarn.lock ./
RUN yarn install

EXPOSE 8080
CMD ["yarn", "serve"]
