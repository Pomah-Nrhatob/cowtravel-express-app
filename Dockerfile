FROM node:10

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache pkgconfig


RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]