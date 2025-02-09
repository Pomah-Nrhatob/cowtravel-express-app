const { v4 } = require("uuid");
const {
  PublishedTravels,
  User,
  ImageForMainPage,
  Image,
} = require("../models/models");
const { PublishedChapters } = require("../models/models");
const { Chapter } = require("../models/models");
const { Travel } = require("../models/models.js");
const ApiError = require("../exceptions/apiError.js");

class PublishArticleController {
  async createArticle(req, res, next) {
    const { travelId } = req.body;
    try {
      const travel = await Travel.findOne({ where: { id: travelId } });
      const imageForMainPage = await ImageForMainPage.findOne({
        where: { travelId },
      });
      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      await Travel.update({ isPublished: true }, { where: { id: travelId } });
      const chapters = await Chapter.findAll({ where: { travelId } });

      const checkPublishedTravels = await PublishedTravels.findOne({
        where: { travelId },
      }).catch((e) => next(e));

      const user = await User.findOne({ where: { id: travel.userId } });

      if (checkPublishedTravels) {
        throw ApiError.BedRequest("Путешествие уже опубликовано");
      }

      if (travel && chapters.length > 0) {
        const publishedTravels = await PublishedTravels.create({
          title: travel.title,
          countries: travel.countries,
          dateTravel: travel.dateTravel,
          authorId: travel.userId,
          travelId: travel.id,
          userName: user.name,
          imagePath: imageForMainPage ? imageForMainPage.filepath : null,
        });

        const newChapters = chapters.map((chapter) => {
          return {
            title: chapter.title,
            content: chapter.content,
            authorId: travel.userId,
            chapterId: chapter.id,
            publishedTravelsId: publishedTravels.id,
            seqNumber: chapter.seqNumber,
          };
        });

        const publishedChapters = await PublishedChapters.bulkCreate([
          ...newChapters,
        ]);

        await Travel.update({ isPublished: true }, { where: { id: travelId } });

        return res.json({ publishedTravels, publishedChapters });
      } else {
        throw ApiError.BedRequest("Нельзя публиковать без глав");
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req, res, next) {
    const travelId = req.params.id;
    try {
      const travel = await Travel.findOne({ where: { id: travelId } });
      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const publishedTravel = await PublishedTravels.findOne({
        where: { travelId },
      });

      await PublishedChapters.destroy({
        where: { publishedTravelsId: publishedTravel.id },
      })
        .then(() => {
          return res;
        })
        .catch((e) => console.log(e));

      await PublishedTravels.destroy({
        where: { id: publishedTravel.id },
      })
        .then(() => {
          return res;
        })
        .catch((e) => console.log(e));

      await Travel.update({ isPublished: false }, { where: { id: travelId } });

      return res.json(`Статья ${publishedTravel.id} удалена`);
    } catch (error) {
      next(error);
    }
  }

  async getArticle(req, res, next) {
    const articleId = req.params.id;

    try {
      const publishedTravel = await PublishedTravels.findOne({
        where: { id: articleId },
      });

      const publishedChapters = await PublishedChapters.findAll({
        where: { publishedTravelsId: articleId },
      });

      const chaptersId = publishedChapters.map((chapter) => {
        return chapter.chapterId;
      });

      const images = await Image.findAll({
        where: { chapterId: [...chaptersId] },
      });

      const chaptersWithPhoto = publishedChapters.map((chapter) => {
        return {
          ...chapter.dataValues,
          images: images.filter(
            (image) => image.chapterId == chapter.chapterId
          ),
        };
      });

      const sortChapters = chaptersWithPhoto.sort(
        (a, b) => a.seqNumber - b.seqNumber
      );

      await PublishedTravels.increment("viewCount", {
        by: 1,
        where: { id: articleId },
      });

      return res.json({
        publishedTravel,
        publishedChapters: sortChapters,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req, res, next) {
    const travelId = req.params.id;
    try {
      const travelDb = await Travel.findOne({ where: { id: travelId } });
      const imageForMainPage = await ImageForMainPage.findOne({
        where: { travelId },
      });
      if (travelDb.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const article = await PublishedTravels.findOne({
        where: { travelId },
      });

      const travel = await Travel.findOne({ where: { id: travelId } });
      const chapters = await Chapter.findAll({
        where: { travelId: travelId },
      });

      const publishedTravel = await PublishedTravels.update(
        {
          title: travel.title,
          countries: travel.countries,
          dateTravel: travel.dateTravel,
          imagePath: imageForMainPage ? imageForMainPage.filepath : null,
        },
        { where: { travelId } }
      ).then((res) => {
        return res;
      });

      const deleted = await PublishedChapters.destroy({
        where: { publishedTravelsId: article.id },
      });

      const newChapters = chapters.map((chapter) => {
        return {
          title: chapter.title,
          content: chapter.content,
          authorId: travel.userId,
          chapterId: chapter.id,
          publishedTravelsId: article.id,
          seqNumber: chapter.seqNumber,
        };
      });

      await PublishedChapters.bulkCreate([...newChapters]);

      return res.json("Изменения внесены в статью");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublishArticleController();
