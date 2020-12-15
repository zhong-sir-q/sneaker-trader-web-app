import app from './app';
import ChatService from './services/ChatService';

import { Socket } from 'socket.io';
import { promisifiedPool } from './config/mysql';
import moment from 'moment';

const PORT = process.env.PORT || 4000;
const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const ChatServiceInstance = new ChatService(promisifiedPool);

io.on('connection', function (socket: Socket) {
  socket.on('message', function (msgPayload: any) {
    const { message, productId, buyerId, sellerId, userType } = msgPayload;

    io.emit(`newMessage_${productId}_${buyerId}_${sellerId}`, msgPayload);

    ChatServiceInstance.sendMessage(Number(productId), Number(buyerId), Number(sellerId), message, userType);
  });
});

http.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});
