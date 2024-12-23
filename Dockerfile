FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npx sequelize-cli db:migrate
COPY . .
EXPOSE 3000
CMD ["npm", "start"]