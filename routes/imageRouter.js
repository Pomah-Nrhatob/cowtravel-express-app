const Router = require("express");
const imageController = require("../controllers/imageController");
const router = new Router();
const upload = require("../middlewares/fileMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/:id",
  authMiddleware,
  upload.array("file"),
  imageController.uploadImage
);
router.get("/:id", imageController.getAllPhotoChapter);
router.delete("/:id", authMiddleware, imageController.deleteImage);
router.put("/:id", authMiddleware, imageController.updateImageInfo);

module.exports = router;
