const Router = require("express");
const router = new Router();
const publishArticleController = require("../controllers/publishArticle.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/", authMiddleware, publishArticleController.createArticle);
router.get("/:id", publishArticleController.getArticle);
router.delete("/:id", authMiddleware, publishArticleController.deleteArticle);
router.put("/:id", authMiddleware, publishArticleController.updateArticle);

module.exports = router;
