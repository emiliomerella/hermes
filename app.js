/* eslint global-require: 0 */
require('dotenv').load()

const cors = require('cors')
const app = require('express')()

app.use(cors())

const { serverConfig } = require('./config')

let server

if (serverConfig.https) {
  const http = require('https')
  const fs = require('fs')
  server = http.createServer({
    pfx: fs.readFileSync(serverConfig.ssl.pfx),
    passphrase: serverConfig.ssl.passphrase,
  }, app)
} else {
  const http = require('http')
  server = http.createServer(app)
}

// in case we'd need, this returns an object containing:
// - io [object]          The socket io interface
// - namespaces [object]  The allowed namespaces for this server
require('./websocket')(server)

server.listen(process.env.PORT, () => {
  console.log(`${process.env.NAME} is listening on port ${process.env.PORT}...`)
})
