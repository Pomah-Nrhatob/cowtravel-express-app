"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: "publishedChapters", schema: "public" },
      "seqNumber",
      {
        type: Sequelize.DataTypes.INTEGER,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: "publishedChapters", schema: "public" },
      "seqNumber"
    );
  },
};
