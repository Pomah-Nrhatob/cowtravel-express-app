const Router = require("express");
const router = new Router();
const publishedChaptersController = require("../controllers/publishedChaptersController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.get("/", publishedChaptersController.getAllPublishedChapter);
router.get("/:id", publishedChaptersController.getOnePublishedChapter);

module.exports = router;
