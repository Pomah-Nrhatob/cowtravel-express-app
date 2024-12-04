const Router = require("express");
const router = new Router();
const upload = require("../middlewares/imageForMainPage");
const authMiddleware = require("../middlewares/authMiddleware");
const imageForMainPageController = require("../controllers/imageForMainPageController");

router.post(
  "/:id",
  authMiddleware,
  upload.single("file"),
  imageForMainPageController.uploadImage
);
router.delete("/:id", authMiddleware, imageForMainPageController.deleteImage);

module.exports = router;
