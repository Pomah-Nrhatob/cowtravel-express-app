const ApiError = require("../exceptions/apiError");
const path = require("path");
const fs = require("fs");
const { Image, Chapter, Travel } = require("../models/models");
const { error } = require("console");

class ImageController {
  async uploadImage(req, res, next) {
    try {
      const chapter = await Chapter.findOne({ where: { id: req.params.id } });
      const travel = await Travel.findOne({ where: { id: chapter.travelId } });
      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      if (!req.files) {
        throw ApiError.BedRequest("Для загрузки добавьте фото");
      } else if (req.fileValidationError) {
        throw ApiError.BedRequest("Используйте правильные форматы");
      } else if (!req.params) {
        throw ApiError.BedRequest("Не хватает id главы");
      } else {
        const filesInfo = req.files.map((el) => {
          return {
            filename: el.filename,
            filepath: el.path,
            mimetype: el.mimetype,
            size: el.size,
            title: "",
            chapterId: req.params.id,
          };
        });

        try {
          const filesInfoFromDB = await Image.bulkCreate([...filesInfo]);
          res.json(filesInfoFromDB);
        } catch (e) {
          next(e);
        }
      }
    } catch (e) {
      next(e);
    }
  }

  async getAllPhotoChapter(req, res, next) {
    const chapterId = req.params.id;
    try {
      const images = await Image.findAll({ where: { chapterId } });

      res.json(images);
    } catch (e) {
      next(e);
    }
  }

  async deleteImage(req, res, next) {
    const id = req.params.id;
    try {
      const image = await Image.findOne({
        where: { id },
      });

      const chapter = await Chapter.findOne({ where: { id: image.chapterId } });
      const travel = await Travel.findOne({ where: { id: chapter.travelId } });
      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }

      if (image) {
        const oldPath = path.join(__dirname, `../${image.filepath}`);
        if (fs.existsSync(oldPath)) {
          await Image.destroy({
            where: { id: image.id },
          });
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(error);
              return;
            }
            res.json(image);
          });
        } else {
          res.json("файл не найден на сервере");
        }
      }
    } catch (e) {
      next(e);
    }
  }

  async updateImageInfo(req, res, next) {
    const id = req.params.id;
    const { title } = req.body;
    try {
      const imageDb = await Image.findOne({
        where: { id },
      });

      const chapter = await Chapter.findOne({
        where: { id: imageDb.chapterId },
      });
      const travel = await Travel.findOne({ where: { id: chapter.travelId } });
      if (travel.userId !== req.user.id) {
        return next(ApiError.UnathorizedError());
      }
      const image = await Image.update(
        {
          title,
        },
        { where: { id } }
      );
      res.json(image);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImageController();
