const { User } = require("../models/models");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const MailService = require("./mailService");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/apiError");
const { response } = require("express");

class UserService {
  async registration(email, password, name) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate !== null) {
      throw ApiError.BedRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const candidateName = await User.findOne({ where: { name } });
    if (candidateName !== null) {
      throw ApiError.BedRequest(
        `Пользователь с никнеймом ${name} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const user = await User.create({
      email,
      password: hashPassword,
      name,
      activationLink,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
  async activate(activationLink) {
    const user = await User.findOne({
      where: {
        activationLink,
      },
    });
    if (!user) {
      throw ApiError.BedRequest("Неккоректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BedRequest("Пользователь с таким email не был найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BedRequest("Неверный пароль");
    }
    if (!user.isActivated) {
      throw ApiError.NotVerified();
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnathorizedError();
    }
    const user = await User.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }

  async current(id) {
    const user = await User.findByPk(id);
    const userDto = new UserDto(user);
    if (!user) {
      return res.status(400).json({ message: "Не удалось найти пользователя" });
    }
    return userDto;
  }
}

module.exports = new UserService();
