const Router = require("express");
const router = new Router();
const publishedTravelsController = require("../controllers/publishedTravelsController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.get("/", publishedTravelsController.getAllPublishedTravel);
router.get("/:id", publishedTravelsController.getOnePublishedTravel);

module.exports = router;
