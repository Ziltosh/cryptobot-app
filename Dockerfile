FROM node:18 as builder

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN npm install -g pnpm

WORKDIR /app

#USER node

COPY pnpm* ./
COPY .env* ./
COPY *.json ./

COPY apps/api ./apps/api
COPY packages ./packages
COPY _config ./_config

RUN pnpm --filter @cryptobot/api... install
RUN pnpm --filter @cryptobot/api... build

WORKDIR /app/apps/api



#RUN chown node:node -R /app
#
#USER node

FROM node:18-slim

RUN npm install -g pnpm

ENV NODE_ENV=production

WORKDIR /app

#COPY --from=builder /app/package.json /app/package.json
#COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
#COPY --from=builder /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
#RUN pnpm --filter @cryptobot/api... fetch --prod

#COPY package.json ./
COPY --from=builder /app/apps/api/build /app/apps/api
COPY --from=builder /app/packages/ccxt /app/packages/ccxt
COPY --from=builder /app/packages/tools /app/packages/tools
COPY --from=builder /app/packages/blockchains /app/packages/blockchains
COPY --from=builder /app/packages/db-api /app/packages/db-api
COPY --from=builder /app/packages/shared /app/packages/shared

RUN pnpm --filter @cryptobot/api --prod deploy deploy

#RUN pnpm install -P

WORKDIR /app/apps/api

EXPOSE 3333
ENV PORT 3333

CMD [ "pnpm", "start" ]
