FROM node:18.16-alpine


# Create app directory
WORKDIR /app

COPY package.json ./


RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]