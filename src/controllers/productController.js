const { db } = require('../config/firebaseAdmin')
const { v4: uuidv4 } = require('uuid')

const postProductController = async (req, res) => {
  const { idUser, address, detailProduct, images, nameProduct, priceProduct, thongSoKyThuat } = req.body
  try {
    const id = uuidv4()

    const parameters = {
      idUser,
      idProduct: id,
      slug: nameProduct
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .split(' ')
        .join('-'),
      address,
      detailProduct,
      images,
      nameProduct,
      priceProduct,
      thongSoKyThuat: {
        dongSanPham: thongSoKyThuat.dongSanPham,
        hangSanPham: thongSoKyThuat.hangSanPham,
        namDangKy: thongSoKyThuat.namDangKy,
        tinhTrangBaoHanh: thongSoKyThuat.tinhTrangBaoHanh,
        xuatXu: thongSoKyThuat.xuatXu,
      },
    }

    await db.collection('product').doc(id).set(parameters)
    res.send({
      message: 'success',
    })
  } catch (error) {
    res.send({
      message: 'error',
    })
  }
}

const selectAllProduct = async (req, res) => {
  try {
    const selectProductByIdUser = await db.collection('product').get()
    const newArrayProduct = []
    selectProductByIdUser.forEach((doc) => {
      newArrayProduct.push(doc.data())
    })
    res.status(200).json({ message: 'success', data: newArrayProduct })
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}
const selectProductByUser = async (req, res) => {
  const { idUser } = req.body
  try {
    const selectProductByIdUser = await db.collection('product').where('idUser', '==', idUser).get()
    const newArrayProduct = []
    selectProductByIdUser.forEach((doc) => {
      newArrayProduct.push(doc.data())
    })
    res.status(200).json({ message: 'success', data: newArrayProduct })
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}
const selectProductBySlug = async (req, res) => {
  const { slug } = req.body
  try {
    const selectProductByIdUser = await db.collection('product').where('slug', '==', slug).get()

    selectProductByIdUser.forEach((doc) => {
      res.status(200).json({ message: 'success', data: doc.data() })
    })
  } catch (error) {
    res.status(500).json({ message: 'Fail' })
  }
}

module.exports = {
  postProductController,
  selectProductByUser,
  selectAllProduct,
  selectProductBySlug,
}
