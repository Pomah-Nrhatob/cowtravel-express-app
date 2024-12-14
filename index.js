const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./db.js");
const router = require("./routes/index.js");
const PORT = process.env.PORT || 3000;
const errorMiddleware = require("./middlewares/errorMiddleware.js");
const path = require("path");
const { ALL } = require("dns");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "https://cowtravel.ru",
  })
);
app.use(express.json({ extend: true }));
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddleware);
app.use("/images", express.static(path.join(__dirname, "images")));

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
