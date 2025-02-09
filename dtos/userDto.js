module.exports = class UserDto {
  email;
  name;
  id;
  isActivated;
  favoriteArticles;
  isLikeArticles;

  constructor(model) {
    this.email = model.email;
    this.name = model.name;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.favoriteArticles = model.favoriteArticles;
    this.isLikeArticles = model.isLikeArticles;
  }
};
