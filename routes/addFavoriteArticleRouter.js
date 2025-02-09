const Router = require("express");
const publishedTravelsController = require("../controllers/publishedTravelsController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = new Router();

router.post("/", authMiddleware, publishedTravelsController.addFavoriteArticle);
router.delete(
  "/",
  authMiddleware,
  publishedTravelsController.deleteFavoriteArticle
);
router.get(
  "/:id",
  authMiddleware,
  publishedTravelsController.getAllFavoriteArticles
);

module.exports = router;
