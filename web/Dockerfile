FROM node:lts-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.config /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]