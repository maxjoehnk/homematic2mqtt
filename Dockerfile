FROM node:14 as builder

WORKDIR /app

COPY ["package.json", "yarn.lock", "/app/"]
RUN yarn

COPY ["src", "tsconfig.json", "/app/"]

RUN yarn build

FROM node:14-alpine

WORKDIR /app

COPY ["package.json", "yarn.lock", "/app/"]
RUN yarn --prod

COPY --from=builder /app/lib /app/lib

EXPOSE 2031

ENTRYPOINT node lib/index.js
