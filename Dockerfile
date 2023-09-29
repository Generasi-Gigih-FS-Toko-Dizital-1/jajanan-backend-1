FROM node:lts-alpine

ENTRYPOINT ["/bin/sh", "-c"]

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn typesync
RUN yarn install

