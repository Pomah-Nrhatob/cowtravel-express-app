module.exports = class ApiError extends Error {
  status;
  error;

  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static UnathorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static BedRequest(message) {
    return new ApiError(400, message);
  }

  static NotVerified() {
    return new ApiError(403, "Подтвердите почту");
  }
};
