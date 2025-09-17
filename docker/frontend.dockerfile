FROM node:22.13.1 as build

ARG APP_PATH=src/main/shop-web
ARG API_URL

WORKDIR /app

COPY ${APP_PATH}/package.json ${APP_PATH}/package-lock.json .

RUN npm install

COPY ${APP_PATH} .

RUN sed -i "s|api_placeholder|${API_URL}|g" src/environments/environment.production.ts

RUN npm run build -- --configuration production

FROM nginx:alpine

ARG WEB_URL
ARG API_URL

COPY docker/default.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s|origin_placeholder|${WEB_URL}|g" /etc/nginx/conf.d/default.conf
RUN sed -i "s|api_url|${API_URL}/ws|g" /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/shop-web/browser/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]