const nodemailer = require('nodemailer');
// const Brevo = require('@getbrevo/brevo');
const pug = require('pug');
const htmlToText = require('html-to-text');

// const defaultClient = Brevo.ApiClient.instance;

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Koda Black <${process.env.BREVO_EMAIL}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Brevo
      return nodemailer.createTransport({
        // service: 'Brevo', // either provide service name OR host, port info
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        secure: false,
        logger: true,

        auth: {
          user: process.env.BREVO_EMAIL,
          pass: process.env.BREVO_PASSWORD,
        },
        debug: true,
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      // text,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to th natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
