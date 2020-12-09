import app from './app';
import ChatService from './services/ChatService';

const PORT = process.env.PORT || 4000;
const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const ChatServiceInstance = new ChatService();

io.on('connection', function (socket: any) {
  socket.on('message', async function (data: any) {
    const { message, productId, buyerId, sellerId, userType } = data;

    io.emit('newMessage', message);

    ChatServiceInstance.sendMessage(Number(productId), Number(buyerId), Number(sellerId), message, userType);

    socket.on('disconnect', () => {});
  });
});

http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});
