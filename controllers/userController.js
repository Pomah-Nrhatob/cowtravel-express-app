const userService = require("../service/userService");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/apiError");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const mailService = require("../service/mailService");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        throw ApiError.BedRequest("Все поля обязательны");
      }
      const userData = await userService.registration(email, password, name);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw ApiError.BedRequest("Все поля обязательны");
      }
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL + "/authactivate");
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async current(req, res, next) {
    try {
      const user = await userService.current(req.user.id);
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw ApiError.BedRequest("Пользователь с такой почтой не найден");
      }
      const resetLink = jwt.sign(
        { user: user.email },
        process.env.JWT_RESET_PASSWORD_SECRET,
        {
          expiresIn: "10m",
        }
      );

      await mailService.sendResetTokenPassword(
        email,
        `${process.env.API_URL}/api/user/reset-redirect/${resetLink}`
      );
      res
        .status(200)
        .json({ message: "Код для восстановления отправлен на вашу почту" });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    const resetToken = req.params.token;
    const { password } = req.body;

    try {
      const user = jwt.verify(
        resetToken,
        process.env.JWT_RESET_PASSWORD_SECRET,
        (error, decoded) => {
          if (error) {
            throw ApiError.BedRequest("Ссылка просрочена, повторите попытку");
          }
          return decoded;
        }
      );

      const hashPassword = await bcrypt.hash(password, 3);

      await User.update(
        { password: hashPassword },
        { where: { email: user.user } }
      );

      res.status(200).json({ message: "Пароль изменен" });
    } catch (error) {
      next(error);
    }
  }

  async resetRedirect(req, res, next) {
    const token = req.params.token;
    try {
      res.redirect(process.env.CLIENT_URL + "/reset-password/" + token);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
