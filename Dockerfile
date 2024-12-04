FROM node:alpine AS node

# Create app directory
WORKDIR /app
COPY . .

COPY package.json ./


RUN npm install

# Bundle app source

EXPOSE 3000

CMD [ "npm", "start" ]