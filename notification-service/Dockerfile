FROM node as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

USER node

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env.production ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/app.js" ]
