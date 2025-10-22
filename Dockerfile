FROM node:20-alpine
WORKDIR /app

# Solo dependencias de producción para imagen ligera
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el código de la app
COPY src ./src

EXPOSE 3000
CMD ["node","src/index.js"]
