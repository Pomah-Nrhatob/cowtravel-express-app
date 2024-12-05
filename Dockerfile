FROM node:alpine AS node

# Create app directory
WORKDIR /app


COPY package.json package-lock.json ./


RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]