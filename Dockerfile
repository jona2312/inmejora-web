FROM node:20-alpine AS builder
WORKDIR /app
# Declare ARGs for build-time injection (Coolify passes these via --build-arg)
ARG NODE_ENV
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
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
