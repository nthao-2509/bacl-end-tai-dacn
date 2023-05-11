const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('../src/config/config')
const cors = require('cors')

const firebaseAdmin = require('firebase-admin')
const credentialsFireBase = require('../src/config/serviceAccountKey.json')

const router = require('./routes')
const corsOptions = require('../src/config/corsOption')
const credentials = require('../src/middleware/credentials')

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(credentialsFireBase),
// })

require('../src/config/firebaseConfig')

app.use(express.json())
app.use(credentials)
app.use(cors(corsOptions))
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/image', express.static('upload_images'))
app.use('/json-data', express.static('jsonData'))

app.use('/api/dacn-2023', router.routes)

const PORT = config.port || 8080
app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT)
})
