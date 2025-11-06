# ============================
# 🧱 Fase 1: Build de React
# ============================
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ============================
# 🌐 Fase 2: Servidor Nginx
# ============================
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
