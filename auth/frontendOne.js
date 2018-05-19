const config = require('../config').knownClients.frontendOne
const { userAuth } = require('../utils')

module.exports = (socket, next) => {
  const handshake = {
    userAgent: socket.handshake.headers['user-agent'],
    realIp: socket.handshake.headers['x-real-ip'],
    fwd4Ip: socket.handshake.headers['x-forwarded-for'],
    client: socket.handshake.headers['x-client'],
    token: socket.handshake.query.token,
  }
  // console.log(handshake);

  if (handshake.client !== config.id) {
    return next(new Error('unknown client'))
  }

  const response = userAuth(handshake.token)

  if (response instanceof Error) {
    return next(new Error(response.message))
  }

  next()
}
