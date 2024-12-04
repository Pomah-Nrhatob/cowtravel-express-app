const { Travel, ImageForMainPage } = require("../models/models.js");

class TravelController {
  async create(req, res, next) {
    const { title, countries, dateTravel } = req.body;
    const userId = req.user.id;
    try {
      if (userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const travel = await Travel.create({
        title,
        countries,
        userId,
        dateTravel,
        ispublished: false,
      });
      return res.json(travel);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    const id = req.user.id;
    try {
      const travels = await Travel.findAll({ where: { userId: id } });
      return res.json(travels);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const travel = await Travel.findOne({
        where: { id },
      });
      const imageForMainPage = await ImageForMainPage.findOne({
        where: { travelId: id },
      });

      if (imageForMainPage) {
        return res.json({
          ...travel.dataValues,
          image: {
            imagePath: imageForMainPage.filepath,
            imageId: imageForMainPage.id,
          },
        });
      }

      return res.json({
        ...travel.dataValues,
        imagePath: null,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteTravel(req, res, next) {
    const { id } = req.params;
    try {
      const travelDb = await Travel.findOne({
        where: { id },
      });
      if (travelDb.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const travel = await Travel.destroy({
        where: { id },
      });
      return res.json(travel);
    } catch (e) {
      next(e);
    }
  }

  async updateTravel(req, res, next) {
    const { id } = req.params;
    try {
      const { title, countries, dateTravel } = req.body;
      const travel = await Travel.update(
        { title, countries, dateTravel },
        { where: { id } }
      );
      return res.json(travel);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TravelController();
