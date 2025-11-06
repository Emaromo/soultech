# ============================
# 🧱 FASE 1: Construcción del proyecto React
# ============================
FROM dockerproxy.com/library/node:18-alpine AS build

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto para producción
RUN npm run build


# ============================
# 🚀 FASE 2: Servidor web (Nginx)
# ============================
FROM dockerproxy.com/library/nginx:alpine

# Limpiar la carpeta por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos construidos en la fase anterior al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto donde correrá la aplicación
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
