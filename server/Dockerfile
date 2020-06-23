FROM hayd/alpine-deno:1.1.1

EXPOSE 8080

WORKDIR /server
USER deno

COPY ./dist .

CMD ["run", "--allow-net", "--allow-env", "server.js"]
