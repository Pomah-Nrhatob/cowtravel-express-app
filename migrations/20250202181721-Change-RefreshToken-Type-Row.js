"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("tokens", "refreshToken", {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("tokens", "refreshToken", {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
  },
};
