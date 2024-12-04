const nodemailer = require("nodemailer");
const ApiError = require("../exceptions/apiError");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendResetTokenPassword(to, link, next) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Сброс пароля" + process.env.API_URL,
        text: "",
        html: `
                    <div>
                        <h1>Для сброса пароля перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                    `,
      });
    } catch (e) {
      throw ApiError.BedRequest(
        "Не получается отправить вам письмо. Проверьте, верно ли указана почта"
      );
    }
  }

  async sendActivationMail(to, link, next) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Активация аккаунта" + process.env.API_URL,
        text: "",
        html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                    `,
      });
    } catch (e) {
      throw ApiError.BedRequest(
        "Не получается отправить вам письмо. Проверьте, верно ли указана почта"
      );
    }
  }
}

module.exports = new MailService();
