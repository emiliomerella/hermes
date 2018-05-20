const jwt = require('jsonwebtoken')

const secret = process.env.AUTH_SECRET

module.exports = (token) => {
  // here we can authorize users by checking the incoming token.
  // adapt this to work properly in your arch
  try {
    return jwt.verify(token, secret)
  } catch (e) {
    return e
  }
}
