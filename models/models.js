const sequelize = require("../db.js");
const { DataTypes, Sequelize } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
});

const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING, allowNull: false },
});

const Travel = sequelize.define("travel", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  countries: { type: DataTypes.ARRAY(DataTypes.STRING) },
  dateTravel: { type: DataTypes.ARRAY(DataTypes.STRING) },
  isPublished: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

const PublishedTravels = sequelize.define("publishedTravels", {
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
  userName: { type: DataTypes.STRING },
  travelId: { type: Sequelize.UUID },
  imagePath: { type: DataTypes.STRING },
});

const Chapter = sequelize.define("chapter", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
});

const PublishedChapters = sequelize.define("publishedChapters", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
  authorId: { type: DataTypes.STRING },
  chapterId: { type: Sequelize.UUID },
  publishedTravelsId: { type: Sequelize.UUID },
});

const Image = sequelize.define("image", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  filepath: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
const ImageForMainPage = sequelize.define("imageForMainPage", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  filepath: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasOne(Travel);
Travel.belongsTo(User, { onDelete: "cascade" });

Travel.hasOne(Chapter);
Chapter.belongsTo(Travel, { onDelete: "cascade", hooks: true });

User.hasOne(Token);
Token.belongsTo(User, { onDelete: "cascade" });

Chapter.hasOne(Image);
Image.belongsTo(Chapter, { onDelete: "cascade" });

Travel.hasOne(ImageForMainPage);
ImageForMainPage.belongsTo(Travel, { onDelete: "cascade" });

module.exports = {
  User,
  Travel,
  Chapter,
  Token,
  Image,
  ImageForMainPage,
  PublishedTravels,
  PublishedChapters,
};
