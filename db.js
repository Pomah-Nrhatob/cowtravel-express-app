const { Sequelize } = require("sequelize");
const { config } = require("dotenv");

config();

const sequelize = new Sequelize(
  "postgres-cowtravel",
  "postgres",
  "Romazaloko123.",
  {
    dialect: "postgres",
    host: "node_db",
    port: "5432",
  },
  { sync: true }
);

module.exports = sequelize;
