const config = require('../config').knownClients.frontendOne
const { userAuth } = require('../utils')

module.exports = (socket, next) => {
  if (socket.handshake.headers['x-client'] !== config.id) {
    return next(new Error('unknown client'))
  }

  // check token
  const response = userAuth(socket.handshake.query.token)

  if (response instanceof Error) {
    return next(new Error(response.message))
  }

  // create an object like the following to store access informations into your DB
  // const data = {
  //   userAgent: socket.handshake.headers['user-agent'],
  //   realIp: socket.handshake.headers['x-real-ip'],
  //   fwd4Ip: socket.handshake.headers['x-forwarded-for'],
  //   client: socket.handshake.headers['x-client'],
  //   token: socket.handshake.query.token,
  //   user: response,
  // }

  // add user to socket
  socket.user = response
  return next()
}
