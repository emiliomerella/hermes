const jwt = require('jsonwebtoken')

const secret = process.env.AUTH_SECRET

module.exports = (token) => {
  try {
    return jwt.verify(token, secret)
  } catch (e) {
    // console.error(e);
    return e
  }
}
