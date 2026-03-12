require('dotenv').config()
require('module-alias/register')
const app = require('./app')
const http = require('http')
const socketIo = require('socket.io')
const SocketService = require('./services/socketService')

const PORT = process.env.PORT || 5000

// Create server
const server = http.createServer(app)

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Initialize socket service
const socketService = new SocketService(io)

// Make io and socketService available globally
global.io = io;
global.socketService = socketService;

// Add middleware to make io available in requests
app.use((req, res, next) => {
  req.io = io
  req.socketService = socketService
  next()
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Socket.IO server initialized`)
})
