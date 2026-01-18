let ioInstance = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket) => {
    // Opcional: unir a rooms por mesa/sesión
    socket.on('join:session', (sessionId) => {
      if (sessionId) socket.join(`session:${sessionId}`);
    });

    socket.on('leave:session', (sessionId) => {
      if (sessionId) socket.leave(`session:${sessionId}`);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };