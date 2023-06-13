const { v4: uuidv4 } = require('uuid')
const { db } = require('../config/firebaseAdmin')

const postCartItemsController = async (req, res) => {
  const { cartItems, idUser } = req.body
  try {
    const idCards = uuidv4()
    const parameters = {
      idCards,
      idUser,
      cartItems,
      status: 0,
    }
    if (cartItems?.length === 0) {
      await db.collection('carts').doc(idUser).delete()
    } else {
      const docDataCart = await db.collection('carts').doc(idUser).get()
      if (docDataCart.exists) {
        docDataCart.ref.update({ cartItems: cartItems })
      } else {
        await db.collection('carts').doc(idUser).set(parameters)
      }
      res.send({
        message: 'success',
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}
const selectCartByIdUser = async (req, res) => {
  const { idUser } = req.body
  try {
    const docDataCart = await db.collection('carts').doc(idUser).get()
    res.send({
      message: 'success',
      data: docDataCart.data(),
    })
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}

module.exports = { postCartItemsController, selectCartByIdUser }
