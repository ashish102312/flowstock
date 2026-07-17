# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy build output to Nginx public html
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to handle SPA routing (redirect all unmatched to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
