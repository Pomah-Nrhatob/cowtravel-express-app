const Router = require("express");
const publishedTravelsController = require("../controllers/publishedTravelsController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = new Router();

router.post("/", authMiddleware, publishedTravelsController.likeArticle);
router.delete(
  "/",
  authMiddleware,
  publishedTravelsController.deleteLikeArticle
);
router.get("/", authMiddleware, publishedTravelsController.getAllLikeArticles);

module.exports = router;
