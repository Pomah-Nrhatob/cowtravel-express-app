const ApiError = require("../exceptions/apiError");
const { Chapter, Image, Travel } = require("../models/models");

class ChapterController {
  async create(req, res, next) {
    const { title, content, travelId, seqNumber } = req.body;
    try {
      const travel = await Travel.findOne({ where: { id: travelId } });

      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }

      const chapter = await Chapter.create({
        title,
        content,
        travelId,
        seqNumber,
      });
      return res.json(chapter);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    const { id } = req.params;
    try {
      const travel = await Travel.findOne({ where: { id: id } });

      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }

      const chapters = await Chapter.findAll({ where: { travelId: id } });

      const chaptersId = chapters.map((chapter) => {
        return chapter.id;
      });
      const images = await Image.findAll({
        where: { chapterId: [...chaptersId] },
      });

      const chaptersWithPhoto = chapters.map((chapter) => {
        return {
          ...chapter.dataValues,
          images: images.filter((image) => image.chapterId == chapter.id),
        };
      });

      return res.json(
        chaptersWithPhoto.sort((a, b) => a.seqNumber - b.seqNumber)
      );
    } catch (e) {
      next(e);
    }
  }

  async deleteChapter(req, res, next) {
    const { id } = req.params;
    try {
      const chapterId = await Chapter.findOne({ where: { id } });
      const travel = await Travel.findOne({
        where: { id: chapterId.travelId },
      });

      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const chapter = await Chapter.destroy({
        where: { id },
      });
      return res.json(chapter);
    } catch (e) {
      next(e);
    }
  }

  async updateChapter(req, res, next) {
    const { id } = req.params;
    try {
      const chapterId = await Chapter.findOne({ where: { id } });
      const travel = await Travel.findOne({
        where: { id: chapterId.travelId },
      });

      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const { title, content, seqNumber } = req.body;
      const chapter = await Chapter.update(
        { title, content, seqNumber },
        { where: { id } }
      );
      return res.json(chapter);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ChapterController();
