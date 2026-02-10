# Dockerfile para Micheludas Backend
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY backend/ .

# Exponer puerto
EXPOSE 5000

# Variables de entorno por defecto para Docker
ENV NODE_ENV=production
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USER=micheludas
ENV DB_PASSWORD=micheludas123
ENV DB_NAME=micheludas_db

# Iniciar la aplicación
CMD ["npm", "start"]
