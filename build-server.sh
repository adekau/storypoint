#!/bin/sh

[ ! -d "./server/dist" ] && mkdir server/dist

# first rebuild the cache
deno cache server/server.ts
deno bundle server/server.ts server/dist/server.js

docker build -t storypoint/server ./server