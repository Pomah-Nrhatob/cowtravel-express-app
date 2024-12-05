FROM node:20-alpine
# Create app directory
WORKDIR /app


COPY package.json package-lock.json ./



COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]