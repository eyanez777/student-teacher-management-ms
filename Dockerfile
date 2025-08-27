# Dockerfile para NestJS + PostgreSQL
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install 

# Copiar el resto del código
COPY . .

# Compilar la app
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main"]
