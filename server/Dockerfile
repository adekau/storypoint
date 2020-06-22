FROM hayd/deno:alpine

EXPOSE 8080

WORKDIR /server
USER deno

COPY ./dist .

CMD ["run", "--allow-net", "--allow-env", "server.js"]
