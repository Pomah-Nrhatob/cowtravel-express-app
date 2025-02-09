"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: "publishedTravels", schema: "public" },
      "isFavoriteCount",
      {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: "publishedTravels", schema: "public" },
      "isFavoriteCount"
    );
  },
};
