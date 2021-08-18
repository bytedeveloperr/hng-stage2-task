const mail = require("@sendgrid/mail")

class Mail {
  constructor(apiKey = process.env.SENDGRID_API_KEY) {
    mail.setApiKey(apiKey)
  }

  setBody({ to, from, subject, text, html } = {}) {
    this.body = {
      to,
      subject,
      text: text || html,
      html,
      from: from || "abdulrahmanyusuf125@gmail.com",
    }
  }

  async send() {
    return await mail.send(this.body)
  }
}

module.exports = Mail
