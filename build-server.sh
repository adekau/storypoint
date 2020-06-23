#!/bin/sh

DENO_VERSION=1.1.1

[ ! -d "./server/dist" ] && mkdir server/dist

# if deno doesn't exist, install it
command -v deno >/dev/null && (
    RUN apk add --virtual .download --no-cache curl \
    && curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
            --output deno.zip \
    && unzip deno.zip \
    && rm deno.zip \
    && chmod 777 deno \
    && mv deno /bin/deno \
    && apk del .download
)

# first rebuild the cache
deno cache server/server.ts
deno bundle server/server.ts server/dist/server.js

docker build -t dekau/storypoint-server ./server