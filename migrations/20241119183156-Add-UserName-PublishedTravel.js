"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: "publishedTravels", schema: "xgb_travel_app" },
      "userName",
      {
        type: Sequelize.DataTypes.TEXT,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: "publishedTravels", schema: "xgb_travel_app" },
      "userName"
    );
  },
};
