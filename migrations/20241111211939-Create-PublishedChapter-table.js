"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("publishedChapters", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING },
      content: { type: DataTypes.TEXT },
      authorId: { type: DataTypes.STRING },
      chapterId: {
        type: Sequelize.UUID,
        references: {
          model: "chapters",
          key: "id",
        },
      },
      publishedTravelsId: {
        type: Sequelize.UUID,
        references: {
          model: "publishedTravels",
          key: "id",
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("publishedChapters");
  },
};
