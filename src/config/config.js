'use strict'

const dotenv = require('dotenv')
const assert = require('assert')

dotenv.config()
const {
  PORT,
  HOST,
  HOST_URL,
  SERVER_KEY,
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STROAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
  USER_MAILER,
  PASSWORD_MAILER,
} = process.env

assert(PORT, 'PORT is required')
assert(HOST, 'HOST is required')

module.exports = {
  email_mailer: USER_MAILER,
  password_mailer: PASSWORD_MAILER,
  port: PORT,
  host: HOST,
  url: HOST_URL,
  FCM_TOKEN: SERVER_KEY,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STROAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
  },
}
