import app from './app';
import ChatService from './services/ChatService';
const PORT = process.env.PORT || 4000;
var http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
  });
const chatHistory: any = [];
const ChatServiceInstance = new ChatService();

io.on('connection', function(socket: any) {
    console.log('A user connected');
    socket.on("join", async function(room: any) {
      socket.join(room);
      io.emit("roomJoined", room);
    });
    socket.on("message", async function(data: any) {
        const { message, productId, buyerId, sellerId, userType} = data;
        io.emit("newMessage", message);
        chatHistory.push(data);
    ChatServiceInstance.sendMessage(Number(productId), Number(buyerId), Number(sellerId), message, userType)
      .then(() => console.log('Sent message'))
      .catch(() => {console.log('llll')});

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });
 
});

export default chatHistory;
 
 http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
 });