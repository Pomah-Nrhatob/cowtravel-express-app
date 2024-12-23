FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npx sequelize-cli db:migrate
EXPOSE 3000
CMD ["npm", "start"]