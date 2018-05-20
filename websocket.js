const socket = require('socket.io')

const { knownClients } = require('./config')
const auth = require('./auth/')
const eventManager = require('./eventManager')

module.exports = (server) => {
  try {
    const io = socket(server)

    // since we're going to use namespaces middlewares,
    // be warned that if any middleware would be added to 'io',
    // all namespaces middleware (and the whole server itself) won't work anymore.
    // for further informations on this, see here:
    // - https://github.com/socketio/socket.io/issues/3082
    // - https://github.com/socketio/socket.io/pull/3197
    const namespaces = Object.keys(knownClients).reduce((all, client) => {
      if (knownClients[client].ws) {
        const ns = io.of(`/${client}`)
        ns.use(auth[client])
        eventManager[client](ns)
        all[client] = ns
      }
      return all
    }, {})

    return { io, namespaces }
  } catch (e) {
    console.error(e)
    return {}
  }
}
