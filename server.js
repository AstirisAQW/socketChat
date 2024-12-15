const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let users = {}; // Track users by socket ID

io.on('connection', (socket) => {
    // Handle nickname setting
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;
        io.emit('user activity', `${nickname} joined the chat`);
        updateUserList();
    });

    // Handle chat messages with timestamps
    socket.on('chat message', (msg) => {
        const nickname = users[socket.id] || 'Anonymous';
        const timestamp = Date.now(); // Get the timestamp in milliseconds
        
        // Emit the message with timestamp to the sender
        io.to(socket.id).emit('chat message', { msg, nickname: 'You', timestamp, isSelf: true });
        
        // Broadcast the message with timestamp to others
        socket.broadcast.emit('chat message', { msg, nickname, timestamp, isSelf: false });
    });

    socket.on('typing', (nickname) => {
        // Broadcast to all users that someone is typing
        socket.broadcast.emit('typing', nickname);
    });

    // Handle disconnects
    socket.on('disconnect', () => {
        const nickname = users[socket.id] || 'A user';
        io.emit('user activity', `${nickname} left the chat`);
        delete users[socket.id];
        updateUserList();
    });

    // Update user list
    function updateUserList() {
        io.emit('update users', Object.values(users));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
