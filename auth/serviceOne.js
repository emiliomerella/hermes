const config = require('../config').knownClients.serviceOne

module.exports = (socket, next) => {
  const handshake = {
    realIp: socket.handshake.headers['x-real-ip'],
    fwd4Ip: socket.handshake.headers['x-forwarded-for'],
    client: socket.handshake.headers['x-client'],
    secret: socket.handshake.query.secret,
  }
  // console.log(handshake);

  if (handshake.client !== config.id) {
    return next(new Error('unknown client'))
  }

  if (handshake.secret !== config.secret) {
    return next(new Error('forbidden'))
  }

  next()
}
