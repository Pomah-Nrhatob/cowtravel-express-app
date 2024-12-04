FROM node:20.12.2

# Create app directory
WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]