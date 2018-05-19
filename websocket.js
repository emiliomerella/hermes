const socket = require('socket.io')

const { knownClients } = require('./config')
const auth = require('./auth/')
const eventManager = require('./eventManager')

module.exports = (server) => {
  try {
    const io = socket(server)

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
  }
}
