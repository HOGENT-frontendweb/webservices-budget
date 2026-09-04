FROM node:24

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY . .

ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/src/main"]
