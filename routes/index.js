const Router = require("express");
const travelRouter = require("./travelRouter.js");
const userRouter = require("./userRouter.js");
const chapterRouter = require("./chapterRouter.js");
const imageRouter = require("./imageRouter.js");
const publishedTravelsRouter = require("./publishedTravelsRouter.js");
const publishedChaptersRouter = require("./publishedChaptersRouter.js");
const publishArticleRouter = require("./publishArticleRouter.js");
const imageForMainPageRouter = require("./imageForMainPageRouter.js");
const addFavoriteArticleRouter = require("./addFavoriteArticleRouter.js");
const likeArticleRouter = require("./likeArticleRouter.js");
const router = new Router();

router.use("/travel", travelRouter);
router.use("/chapter", chapterRouter);
router.use("/user", userRouter);
router.use("/uploadimage", imageRouter);
router.use("/publishedtravels", publishedTravelsRouter);
router.use("/publishedChapters", publishedChaptersRouter);
router.use("/publisharticle", publishArticleRouter);
router.use("/imageForMainPage", imageForMainPageRouter);
router.use("/favoriteArticle", addFavoriteArticleRouter);
router.use("/likeArticle", likeArticleRouter);

module.exports = router;
