const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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
});
