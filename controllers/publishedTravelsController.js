const { json } = require("body-parser");
const sequelize = require("../db");
const ApiError = require("../exceptions/apiError");
const { PublishedTravels, User } = require("../models/models");
const userService = require("../service/userService");
const { Op } = require("sequelize");

class PublishedTravelsController {
  async getOnePublishedTravel(req, res, next) {
    return req;
  }

  async getAllPublishedTravel(req, res, next) {
    const { page } = req.query;
    const offset = (page - 1) * 10;
    const { publishedTravelList } = req.body;

    try {
      let publishedTravels;
      if (!publishedTravelList) {
        publishedTravels = await PublishedTravels.findAndCountAll({
          limit: 10,
          offset,
          order: [["createdAt", "DESC"]],
        });
      } else {
        publishedTravels = await PublishedTravels.findAll({
          where: {
            id: {
              [Op.contains]: publishedTravelList,
            },
          },
        });
      }

      return res.json(publishedTravels);
    } catch (error) {
      next(error);
    }
  }

  async addFavoriteArticle(req, res, next) {
    const { userId, publishedTravelId } = req.body;
    const checkUserId = req.user.id;
    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({ where: { id: userId } });
      if (
        user.favoriteArticles.length > 0 &&
        user.favoriteArticles.includes(publishedTravelId)
      ) {
        return next(ApiError.BedRequest("Статья уже добавлена в избранное"));
      }
      await User.update(
        {
          favoriteArticles: sequelize.fn(
            "array_append",
            sequelize.col("favoriteArticles"),
            publishedTravelId
          ),
        },
        { where: { id: user.id } }
      );
      await PublishedTravels.increment("isFavoriteCount", {
        by: 1,
        where: { id: publishedTravelId },
      });
      res.json("Добавлено в избранное");
    } catch (e) {
      next(e);
    }
  }

  async deleteFavoriteArticle(req, res, next) {
    const { userId, publishedTravelId } = req.body;
    const checkUserId = req.user.id;

    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({ where: { id: userId } });
      if (!user.favoriteArticles.includes(publishedTravelId)) {
        return next(ApiError.BedRequest("Статья удалена из избранных"));
      }
      await User.update(
        {
          favoriteArticles: sequelize.fn(
            "array_remove",
            sequelize.col("favoriteArticles"),
            publishedTravelId
          ),
        },
        { where: { id: user.id } }
      );
      await PublishedTravels.decrement("isFavoriteCount", {
        by: 1,
        where: { id: publishedTravelId },
      });
      res.json("Статья удалена из избранных");
    } catch (e) {
      next(e);
    }
  }

  async getAllFavoriteArticles(req, res, next) {
    const userId = req.params.id;
    const checkUserId = req.user.id;

    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({
        where: { id: userId },
      });
      if (user.favoriteArticles.length < 1) {
        res.json([]);
      }
      const favoriteArticlesList = await PublishedTravels.findAll({
        where: {
          id: {
            [Op.in]: user.favoriteArticles,
          },
        },
      });
      res.json(favoriteArticlesList);
    } catch (e) {
      next(e);
    }
  }

  async likeArticle(req, res, next) {
    const { userId, publishedTravelId } = req.body;
    const checkUserId = req.user.id;
    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({ where: { id: userId } });
      if (
        user.isLikeArticles.length > 0 &&
        user.isLikeArticles.includes(publishedTravelId)
      ) {
        return next(ApiError.BedRequest("Статья уже оценена вами"));
      }
      await User.update(
        {
          isLikeArticles: sequelize.fn(
            "array_append",
            sequelize.col("isLikeArticles"),
            publishedTravelId
          ),
        },
        { where: { id: user.id } }
      );

      await PublishedTravels.increment("rating", {
        by: 1,
        where: { id: publishedTravelId },
      });
      res.json("Like");
    } catch (e) {
      next(e);
    }
  }

  async deleteLikeArticle(req, res, next) {
    const { userId, publishedTravelId } = req.body;
    const checkUserId = req.user.id;
    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({ where: { id: userId } });
      if (!user.isLikeArticles.includes(publishedTravelId)) {
        return next(ApiError.BedRequest("Лайк на статье не найден"));
      }
      await User.update(
        {
          isLikeArticles: sequelize.fn(
            "array_remove",
            sequelize.col("isLikeArticles"),
            publishedTravelId
          ),
        },
        { where: { id: user.id } }
      );
      await PublishedTravels.decrement("rating", {
        by: 1,
        where: { id: publishedTravelId },
      });
      res.json("Лайк со статьи убран");
    } catch (e) {
      next(e);
    }
  }

  async getAllLikeArticles(req, res, next) {
    const { userId } = req.body;
    const checkUserId = req.user.id;

    try {
      if (checkUserId !== Number(userId)) {
        return next(ApiError.UnathorizedError());
      }
      const user = await User.findOne({
        where: { id: userId },
      });
      if (user.isLikeArticles.length < 1) {
        res.json([]);
      }
      const likeArticlesList = await PublishedTravels.findAll({
        where: {
          id: {
            [Op.in]: user.isLikeArticles,
          },
        },
      });
      res.json(likeArticlesList);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PublishedTravelsController();
