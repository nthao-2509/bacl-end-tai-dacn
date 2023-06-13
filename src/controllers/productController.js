const { db, admin } = require('../config/firebaseAdmin')
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
const adminSelectProduct = async (req, res) => {
  try {
    const selectProductByIdUser = (await db.collection('product').get()).docs.map((doc) => doc.data())
    const allUser = (await db.collection('account').get()).docs.map((doc) => ({ informationUser: doc.data(), idUser: doc.id }))

    selectProductByIdUser.forEach(async (doc, index) => {
      selectProductByIdUser[index].informationUser = allUser.filter(({ idUser }) => idUser === doc.idUser)?.[0]?.informationUser
    })

    res.status(200).json({ message: 'success', data: selectProductByIdUser })
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

const ProductPortfolio = async (req, res) => {
  const { name } = req.body
  try {
    const id = uuidv4()

    const parameters = {
      id,
      name: name,
      code: name
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .split(' ')
        .join('-'),
      created: admin.firestore.Timestamp.fromDate(new Date()),
    }
    await db.collection('productPortfolio').doc(id).set(parameters)
    res.send({
      data: 'success',
    })
  } catch (error) {
    res.send({
      data: 'error',
    })
  }
}
const selectProductPortfolio = async (req, res) => {
  console.log(123123)
  try {
    const selectProductPortfolio = (await db.collection('productPortfolio').get()).docs.map((doc) => doc.data())

    res.send({
      data: selectProductPortfolio,
    })
  } catch (error) {
    res.send({
      data: 'error',
    })
  }
}

module.exports = {
  postProductController,
  selectProductByUser,
  selectAllProduct,
  selectProductBySlug,
  adminSelectProduct,
  ProductPortfolio,
  selectProductPortfolio,
}
