const express = require('express')
const router = express.Router()
const path = require('path')

const { postLoginController, login, accessAccountSalesman } = require('../controllers/loginController')
const validateEmailAndPassword = require('../middleware/validate-email-and-password')
const { accessAccount } = require('../controllers/mailerController')

//

const Resize = require('../controllers/resize')
const upload = require('../middleware/uploadMiddleware')
const {
  postProductController,
  selectProductByUser,
  selectAllProduct,
  selectProductBySlug,
  adminSelectProduct,
  ProductPortfolio,
  selectProductPortfolio,
} = require('../controllers/productController')
const { postCartItemsController } = require('../controllers/cartController')
const { selectAllUser, selectInfoUserById, updateStatusUser } = require('../controllers/userController')

router.post('/sign-up', postLoginController)
router.post('/send-email/access-account-salesman', accessAccount)
router.post('/sign-in', validateEmailAndPassword, login)
router.get('/access-email-salesman/:email', accessAccountSalesman)
// API upload product
router.post('/add-product', postProductController)
router.post('/select-product-by-id-user', selectProductByUser)
router.get('/select-product', selectAllProduct)
router.post('/detail-product', selectProductBySlug)
router.get('/select-product-admin', adminSelectProduct)
//CART
router.post('/add-to-cart', postCartItemsController)
router.post('/select-data-cart', postCartItemsController)
// User
router.get('/select-all-user', selectAllUser)
router.post('/update-status-user', updateStatusUser)

//Product Portfolio
router.post('/post-product-portfolio', ProductPortfolio)
router.get('/select-product-portfolio', selectProductPortfolio)

router.post('/upload-image-product', upload.single('file'), async function (req, res) {
  // folder upload
  const imagePath = path.join(__dirname, '../../upload_images')

  // call class Resize
  const fileUpload = new Resize(imagePath)
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' })
  }
  const filename = await fileUpload.save(req.file.buffer)
  // fileUpload.filepath(req.file.originalname)
  console.log(filename)

  return res.status(200).json({ name: filename })
})
module.exports = {
  routes: router,
}
