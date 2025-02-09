"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: "users", schema: "public" },
      "isLikeArticles",
      {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        defaultValue: [],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: "users", schema: "public" },
      "isLikeArticles"
    );
  },
};
