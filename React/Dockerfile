# Dockerfile para Micheludas Frontend
# Compilación
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Compilar la aplicación
RUN npm run build

# Producción
FROM node:18-alpine

WORKDIR /app

# Instalar sirve para servir la aplicación compilada
RUN npm install -g serve

# Copiar la carpeta compilada desde el stage anterior
COPY --from=build /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV VITE_API_URL=http://localhost:5000

# Iniciar la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
