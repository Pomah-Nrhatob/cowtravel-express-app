const Router = require("express");
const router = new Router();
const travelController = require("../controllers/travelController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/", authMiddleware, travelController.create);
router.get("/", authMiddleware, travelController.getAll);
router.get("/:id", authMiddleware, travelController.getOne);
router.delete("/:id", authMiddleware, travelController.deleteTravel);
router.put("/:id", authMiddleware, travelController.updateTravel);

module.exports = router;
