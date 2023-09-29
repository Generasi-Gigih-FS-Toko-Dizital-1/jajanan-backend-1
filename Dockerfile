FROM node:lts-alpine

ENTRYPOINT ["/bin/sh", "-c"]

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn typesync
RUN yarn install
ENV NODE_ENV=test
RUN yarn test
ENV NODE_ENV=production
