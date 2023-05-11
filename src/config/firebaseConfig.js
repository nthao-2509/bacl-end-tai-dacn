const firebase = require('firebase/app')
const _config = require('./config')

firebase.initializeApp(_config.firebaseConfig)
