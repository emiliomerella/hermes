module.exports = (ns) => {

  ns.on('connect', (socket) => {
    console.log(`[ INFO ] - frontendOne - client connected`)
    socket.emit('welcome', 'welcome to "frontendOne" namespace')

    socket.on('new-message', data => ns.emit('update:new-message', data))

    // socket.on('anEvent', data => nsController.anEvent(data))

    socket.on('disconnect', reason => console.log(`[ INFO ] - frontendOne - client disconnected (${reason}).`))
  })

  return ns
}
