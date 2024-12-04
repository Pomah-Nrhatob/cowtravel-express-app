const Router = require("express");
const router = new Router();
const chapterController = require("../controllers/chapterController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/", authMiddleware, chapterController.create);
router.get("/:id", authMiddleware, chapterController.getAll);
router.delete("/:id", authMiddleware, chapterController.deleteChapter);
router.put("/:id", authMiddleware, chapterController.updateChapter);

module.exports = router;
