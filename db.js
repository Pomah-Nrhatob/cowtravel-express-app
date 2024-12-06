const { Sequelize } = require("sequelize");
const { config } = require("dotenv");

config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: "pg_db",
    port: process.env.DB_PORT,
  },
  { sync: true }
);

module.exports = sequelize;
