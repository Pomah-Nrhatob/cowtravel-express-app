const ApiError = require("../exceptions/apiError");
const path = require("path");
const fs = require("fs");
const { Travel, ImageForMainPage } = require("../models/models");
const { error } = require("console");

class ImageForMainPageController {
  async uploadImage(req, res, next) {
    const travelId = req.params.id;
    try {
      const travel = await Travel.findOne({ where: { id: travelId } });
      const checkImage = await ImageForMainPage.findOne({
        where: { travelId },
      });

      if (checkImage !== null) {
        return next(ApiError.BedRequest("Фото уже добавлено"));
      } else if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      } else if (!req.file) {
        throw ApiError.BedRequest("Для загрузки добавьте фото");
      } else if (req.fileValidationError) {
        throw ApiError.BedRequest("Используйте правильные форматы");
      } else if (!req.params.id) {
        throw ApiError.BedRequest("Не хватает id путешествия");
      } else {
        const fileInfo = {
          filename: req.file.filename,
          filepath: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
          title: "",
          travelId: travelId,
        };
        try {
          const fileInfoFromDB = await ImageForMainPage.create({ ...fileInfo });
          res.json(fileInfoFromDB);
        } catch (e) {
          next(e);
        }
      }
    } catch (error) {}
  }

  async deleteImage(req, res, next) {
    const travelId = req.params.id;
    try {
      const image = await ImageForMainPage.findOne({ where: { travelId } });
      if (image) {
        const oldPath = path.join(__dirname, `../${image.filepath}`);
        if (fs.existsSync(oldPath)) {
          await ImageForMainPage.destroy({
            where: { id: image.id },
          });
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(error);
              return;
            }
            res.json(image);
          });
        }
      } else {
        res.json("файл не найден на сервере");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImageForMainPageController();
