# ============================
# 🧱 Fase 1: Build (React / Vite)
# ============================
FROM dockerproxy.com/library/node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ============================
# 🚀 Fase 2: Servidor Nginx
# ============================
FROM dockerproxy.com/library/nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

