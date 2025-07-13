FROM node:22-alpine

ENV PORT=3000

RUN apk add --no-cache git bash python3 make g++

COPY . /app
WORKDIR /app

RUN pnpm install --prod
RUN pnpm build

EXPOSE $PORT

CMD [ "pnpm", "cli" ]
