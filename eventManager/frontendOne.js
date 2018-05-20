const { validator } = require('../middlewares')

module.exports = (ns) => {
  ns.on('connect', (socket) => {
    if (socket.user) {
      // TODO: create a room
    } else {
      return
    }

    console.log(`[ INFO ] - frontendOne - client ${socket.user.id} connected`);
    socket.emit('welcome', 'welcome to "frontendOne" namespace')

    socket.use(validator)

    socket.on('new-message', data => ns.emit('update:new-message', data))

    // socket.on('anEvent', data => nsController.anEvent(data))

    socket.on('disconnect', reason => console.log(`[ INFO ] - frontendOne - client disconnected (${reason}).`))
  })

  return ns
}
