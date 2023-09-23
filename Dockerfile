FROM --platform=linux/x86_64 node:16.15-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update-cache \
    python3 \
    python3-dev \
    py-pip \
    build-base \
    git \
    && rm -rf /var/cache/apk/*

RUN npm install -g rimraf @nestjs/cli

RUN npm install

COPY . .

RUN npm run start:debug

FROM --platform=linux/x86_64 node:16.15-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update-cache \
    python3 \
    python3-dev \
    py-pip \
    build-base \
    && rm -rf /var/cache/apk/*

RUN npm install -g rimraf @nestjs/cli

RUN npm install --only=production

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
