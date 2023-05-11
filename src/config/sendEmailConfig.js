const { email_mailer, password_mailer } = require('./config')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: email_mailer,
    pass: password_mailer,
  },
})

module.exports = {
  transporter,
}
