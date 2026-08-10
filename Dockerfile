# ============================
# 🧱 FASE 1: Construcción del proyecto React
# ============================
FROM public.ecr.aws/docker/library/node:18.20-alpine AS build

WORKDIR /app

# Copiar manifiestos primero (mejor caché de capas)
COPY package*.json ./

# Instalación reproducible
RUN npm ci --no-audit --no-fund

# Copiar el resto del código fuente
COPY . .

# Compilar para producción
RUN npm run build


# ============================
# 🚀 FASE 2: Servidor web (Nginx)
# ============================
FROM public.ecr.aws/nginx/nginx:1.27-alpine

# Limpiar la carpeta por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Config SPA: sirve index.html en rutas desconocidas (React Router)
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|svg|webp|mp4|woff2?)$ {\n\
    expires 1y;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]