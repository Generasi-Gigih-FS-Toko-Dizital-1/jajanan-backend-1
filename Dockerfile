FROM node:lts-alpine

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn typesync
RUN yarn install

