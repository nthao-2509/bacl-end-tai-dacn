const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
const { getAuth: getClientAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { getAuth: getAdminAuth } = require('firebase-admin/auth')
const { db } = require('../config/firebaseAdmin')
const { default: axios } = require('axios')
const { url, email_mailer } = require('../config/config')
const { transporter } = require('../config/sendEmailConfig')

const postLoginController = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, typeProduct } = req.body

    await admin.auth().createUser({
      email: email,
      password: password,
      emailVerified: false,
      disable: false,
    })
    const id = uuidv4()
    const parameters = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
      typeProduct: typeProduct,
      active: role === 'salesman' ? 0 : 1,
    }
    if (role === 'salesman') {
      await axios.post(`${url}/api/dacn-2023/send-email/access-account-salesman`, {
        fromEmail: email,
        firstName: firstName,
        lastName: lastName,
        typeProduct: typeProduct,
      })
    }
    await db.collection('account').doc(id).set(parameters)
    res.send({
      message: 'success',
    })
  } catch (error) {
    res.send({
      message: 'error',
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const credential = await signInWithEmailAndPassword(getClientAuth(), email, password)
    const token = await getAdminAuth().createCustomToken(credential.user.uid)
    const getInformationUser = await db.collection('account').where('email', '==', email).get()
    getInformationUser.forEach((doc) => {
      if (doc.data().active === 1 || doc.data().role === 'admin') {
        res.status(200).json({ message: 'success', token, role: doc.data().role, idUser: doc.id })
      } else {
        res.status(200).json({ message: 'no-active' })
      }
    })
  } catch (error) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      res.status(203).json({ message: 'Fail' })
    } else {
      res.status(500).json({ message: 'Fail' })
    }
  }
}
const accessAccountSalesman = async (req, res) => {
  const { email } = req.params
  const getInformationUser = await db.collection('account').where('email', '==', email).get()
  getInformationUser.forEach(async (doc) => {
    const { firstName, lastName, email } = doc.data()
    if (doc.exists) {
      doc.ref.update({ active: 1 })
      await transporter.sendMail({
        from: email_mailer, // sender address
        to: email, // list of receivers
        subject: `YÊU CẦU KÍCH HOẠT TÀI KHOẢN`, // subject
        html: `
        <div style="padding: 20px 0 ;">
        <p>Xin chào : <strong>${firstName} ${lastName}</strong></p>
        <p>Tài khoản với tên đăng nhập <strong>${email}</strong> của bạn đã được kích hoạt thành công.</p>
        <a href="http://localhost:3000/sign-in" style="padding: 11px 20px; background-color: #FB2E86; color: #ffffff;margin: 10px 0;
            text-decoration: none;
            border-radius: 10px; ">
        ĐĂNG NHẬP
        </a></div>
        `,
      })
      res.send({
        message: 'success',
      })
    }
  })
}

module.exports = { postLoginController, login, accessAccountSalesman }
