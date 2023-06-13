const { db } = require('../config/firebaseAdmin')
const { getAuth } = require('firebase-admin/auth')

const selectAllUser = async (req, res) => {
  try {
    const selectUser = await db.collection('account').where('role', '!=', 'admin').get()
    const userArray = []
    selectUser.forEach((doc) => {
      userArray.push({ ...doc.data(), id: doc.id })
    })
    res.status(200).json({ message: 'success', data: userArray })
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}
const selectInfoUserById = async (req, res) => {
  try {
    const selectUser = await db.collection('account').doc(req.body.idUser).get()
    res.status(200).json({ message: 'success', data: selectUser.data() })
  } catch (error) {
    res.status(500).json({
      message: 'Fail',
    })
  }
}
const deleteUser = async (req, res) => {
  const { idUser } = req.body
  try {
    const responseDeleteAuth = await getAuth.deleteUser(idUser)
  } catch (error) {}
}
const updateUser = async (req, res) => {}
const updateStatusUser = async (req, res) => {
  const { idUser, status } = req.body
  try {
    const response = await db.collection('account').doc(idUser).get()
    response.ref.update({ active: status })
    res.status(200).json({ data: 'success' })
  } catch (error) {
    res.status(500).json({
      data: 'Fail',
    })
  }
}
module.exports = {
  selectAllUser,
  selectInfoUserById,
  deleteUser,
  updateUser,
  updateStatusUser,
}
