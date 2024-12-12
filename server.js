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

let users = {}; // Track connected users by socket ID

io.on('connection', (socket) => {
    // Listen for the 'set nickname' event
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname; // Store the user's nickname
        console.log(`${nickname} connected`);
        io.emit('user activity', `${nickname} has joined the chat`); // Notify others
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        const nickname = users[socket.id] || 'Anonymous';
        console.log(`${nickname}: ${msg}`);
        io.emit('chat message', `${nickname}: ${msg}`); // Prepend nickname to the message
    });

    // Handle typing events
    socket.on('typing', () => {
        const nickname = users[socket.id] || 'Anonymous';
        socket.broadcast.emit('typing', nickname); // Notify others that this user is typing
    });

    // Handle stop typing events
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing'); // Notify others that the user has stopped typing
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const nickname = users[socket.id] || 'A user';
        console.log(`${nickname} disconnected`);
        io.emit('user activity', `${nickname} has left the chat`); // Notify others
        delete users[socket.id]; // Remove user from tracking
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
    console.log('http://localhost:3000');
});
