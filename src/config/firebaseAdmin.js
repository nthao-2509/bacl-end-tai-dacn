const admin = require('firebase-admin')
const { firebaseConfig } = require('./config')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

module.exports = { admin, db }
