FROM node:20-alpine AS builder
WORKDIR /app

# Accept build args from Coolify (marked as "Available at Buildtime")
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Convert ARGs to ENV so Vite can read them via process.env during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./
RUN NODE_ENV=development npm install --production=false --legacy-peer-deps
COPY . .
RUN ./node_modules/.bin/vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
