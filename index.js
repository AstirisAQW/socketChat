const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Broadcast to all clients that a user has connected
    io.emit('user activity', 'A user connected');

    // Handle chat message event
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // Broadcast message to all clients
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('user activity', 'A user disconnected'); // Notify all clients
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
