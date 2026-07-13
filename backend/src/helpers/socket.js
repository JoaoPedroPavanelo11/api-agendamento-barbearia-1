let io = null;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    const origensPermitidas = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000'];
    io = new Server(httpServer, { cors: { origin: origensPermitidas } });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io nao inicializado');
    return io;
  },
};
