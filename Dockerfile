FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# --production=false installs ALL deps (incl devDeps) regardless of external NODE_ENV
RUN npm install --production=false --legacy-peer-deps
COPY . .
# Run build with explicit PATH to node_modules/.bin
RUN ./node_modules/.bin/vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
