const { PublishedTravels } = require("../models/models");

class PublishedTravelsController {
  async getOnePublishedTravel(req, res, next) {
    return req;
  }

  async getAllPublishedTravel(req, res, next) {
    const { page } = req.query;
    const offset = (page - 1) * 10;

    try {
      const publishedTravels = await PublishedTravels.findAndCountAll({
        limit: 10,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.json(publishedTravels);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublishedTravelsController();
