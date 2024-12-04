"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("publishedTravels", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING },
      countries: { type: DataTypes.ARRAY(DataTypes.STRING) },
      dateTravel: { type: DataTypes.ARRAY(DataTypes.STRING) },
      authorId: { type: DataTypes.STRING },
      travelId: {
        type: Sequelize.UUID,
        references: {
          model: "travels",
          key: "id",
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("publishedTravels");
  },
};
