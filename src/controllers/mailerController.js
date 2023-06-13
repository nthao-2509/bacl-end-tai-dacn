const nodemailer = require('nodemailer')
const { email_mailer, password_mailer, host, url } = require('../config/config')
const { transporter } = require('../config/sendEmailConfig')

const accessAccount = async (req, res) => {
  const { fromEmail, firstName, lastName } = req.body
  let message = await transporter.sendMail({
    from: `"Yêu cầu xác nhận tài khoản dành cho CỬA HÀNG "${fromEmail}`, // sender address
    to: 'nvtai.20it4@vku.udn.vn', // list of receivers
    subject: `YÊU CẦU MỞ TÀI KHOẢN ${fromEmail}`, // subject
    html: `
    <p>Họ tên: ${firstName} ${lastName}</p>
    <p>Email: ${fromEmail}</p>
    <a href="${url}/api/dacn-2023/access-email-salesman/${fromEmail}">${url}/api/dacn-2023/access-email-salesman/${fromEmail}</a>
    `,
  })
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({ msg: 'you should receive an email', info: message.messageId, preview: nodemailer.getTestMessageUrl(message) })
    })
    .catch((error) => {
      return res.status(500).json({ error })
    })
}

module.exports = { accessAccount }
