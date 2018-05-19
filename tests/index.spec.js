const io = require('socket.io-client')
const jsonwebtoken = require('jsonwebtoken')
const request = require('request')

const mockFun = jest.fn()

beforeAll((done) => {
  require('../app')
  done()
  // setTimeout(() => done(), 3000)
})

describe('hermes exists', () => {
  test('GET / should reply 404', (done) => {
    request({
      method: 'GET',
      url: process.env.HOST,
    }, (err, res, body) => {
      expect(res.statusCode).toEqual(404)
      done()
    })
  })
})

describe('server to server communications', () => {
  test('should not connect to serviceOne namespace -> error: unknown client', (done) => {
    const options = {
      query: { secret: '123' },
      transportOptions: { polling: { extraHeaders: { 'x-client': '3456' }}},
    }
    io.connect(`${process.env.HOST}/serviceOne`, options)
    .on('error', (data) => {
      expect(data).toBe('unknown client')
      done()
    })
  })

  test('should not connect to serviceOne namespace -> error: forbidden', (done) => {
    const options = {
      query: { secret: '1234' },
      transportOptions: { polling: { extraHeaders: { 'x-client': '345' }}},
    }
    io.connect(`${process.env.HOST}/serviceOne`, options)
    .on('error', (data) => {
      expect(data).toBe('forbidden')
      done()
    })
  })

  test('should not connect to serviceTwo namespace -> error: Invalid namespace', (done) => {
    const options = {
      query: { secret: '123s' },
      transportOptions: { polling: { extraHeaders: { 'x-client': '345' }}},
    }
    io.connect(`${process.env.HOST}/serviceTwo`, options)
    .on('error', (data) => {
      expect(data).toBe('Invalid namespace')
      done()
    })
  })

  test('should connect to serviceOne namespace', (done) => {
    const options = {
      query: { secret: '123' },
      transportOptions: { polling: { extraHeaders: { 'x-client': '345' }}},
    }
    const conn = io.connect(`${process.env.HOST}/serviceOne`, options)
    .on('welcome', (data) => {
      expect(data).toBe('welcome to "serviceOne" namespace')
      done()
    })
    mockFun.mockReturnValueOnce(conn)
  })

  test('should communicate with serviceOne through its namespace', (done) => {
    const conn = mockFun()
    const message = 'this is just a test'

    conn.emit('new-message', message)
    conn.on('update:new-message', (data) => {
      expect(data).toBe(message)
      done()
    })
  })
})

describe('client to server communications', () => {
  test('a user should not connect to frontendOne namespace (wrong secret)', (done) => {
    const secret = process.env.AUTH_SECRET + '111'
    const user = {
      id: 'testUser',
      exp: Math.floor(Date.now() / 1000) + 100,
    }
    const token = jsonwebtoken.sign(user, secret)
    const options = {
      query: { token },
      transportOptions: { polling: { extraHeaders: { 'x-client': '123' }}},
      forceNew: true,
    }

    io.connect(`${process.env.HOST}/frontendOne`, options)
    .on('error', (data) => {
      expect(data).toBe('invalid signature')
      done()
    })
  })

  test('a user should not connect to frontendOne namespace (token expired)', (done) => {
    const secret = process.env.AUTH_SECRET
    const user = {
      id: 'testUser',
      exp: Math.floor(Date.now() / 1000) - 30,
    }
    const token = jsonwebtoken.sign(user, secret)
    const options = {
      query: { token },
      transportOptions: { polling: { extraHeaders: { 'x-client': '123' }}},
      forceNew: true,
    }

    io.connect(`${process.env.HOST}/frontendOne`, options)
    .on('error', (data) => {
      expect(data).toBe('jwt expired')
      done()
    })
  })

  test('a user should connect to frontendOne namespace', (done) => {
    const secret = process.env.AUTH_SECRET
    const user = {
      id: 'testUser',
      exp: Math.floor(Date.now() / 1000) + 1000,
    }
    const token = jsonwebtoken.sign(user, secret)
    const options = {
      query: { token },
      transportOptions: { polling: { extraHeaders: { 'x-client': '123' }}},
      forceNew: true,
    }

    const conn = io.connect(`${process.env.HOST}/frontendOne`, options)
    .on('welcome', (data) => {
      expect(data).toBe('welcome to "frontendOne" namespace')
      done()
    })
    mockFun.mockReturnValueOnce(conn)
  })

  test('a user should communicate with hermes through frontendOne namespace', (done) => {
    const conn = mockFun()
    const message = 'this is just a test'

    conn.emit('new-message', message)
    conn.on('update:new-message', (data) => {
      expect(data).toBe(message)
      done()
    })
  })
})
