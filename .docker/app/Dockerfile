FROM node:18.12 as app-base

LABEL maintainer='grano22'

WORKDIR var/www/app

RUN adduser flagger-user

RUN npm install -g --silent pnpm

COPY --chown=flagger-user ./package.json ./pnpm-lock.yaml ./tsconfig* /var/www/app/

RUN mkdir .pnpm-store && pnpm config set store-dir /var/www/app/.pnpm-store && chown -R flagger-user /var/www/app

USER flagger-user

RUN pnpm install --frozen-lockfile

FROM app-base as test-app

COPY --chown=flagger-user ./jest* /var/www/app/

ENTRYPOINT pnpm test

FROM app-base as app

ENTRYPOINT id
