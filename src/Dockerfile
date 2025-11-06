# ============================
# 🧱 Fase 1: Build (React / Vite)
# ============================
FROM hub-mirror.c.163.com/library/node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ============================
# 🚀 Fase 2: Servidor Nginx
# ============================
FROM hub-mirror.c.163.com/library/nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
