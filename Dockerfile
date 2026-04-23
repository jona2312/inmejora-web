FROM node:20-alpine AS builder
WORKDIR /app
# Declare ARG to accept external --build-arg, then force development mode
ARG NODE_ENV
ENV NODE_ENV=development
COPY package*.json ./
# Inline override ensures devDeps installed regardless of any external NODE_ENV
RUN NODE_ENV=development npm install --production=false --legacy-peer-deps
COPY . .
# Explicit path to vite binary
RUN NODE_ENV=development ./node_modules/.bin/vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
