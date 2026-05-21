# ============================================================
# Event Horizon — Frontend Dockerfile
# Multi-stage: Node build → Nginx serve
# ============================================================

# Stage 1 — Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

# Build args allow injecting env vars at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config — handles React Router client-side routing
# Without this, refreshing /search returns 404 from Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]