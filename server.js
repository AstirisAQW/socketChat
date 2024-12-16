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
    try {
        console.log('a user connected');
        // Handle nickname setting
        socket.on('set nickname', (nickname) => {
            console.log('Received nickname:', nickname, 'Type:', typeof nickname);
            users[socket.id] = nickname;
            io.emit('user activity', `${nickname} joined the chat`);
            updateUserList();
        });

        // Handle chat messages with timestamps
        socket.on('chat message', (msg) => {
            try{
                if (!msg) {
                    return socket.emit('error', 'Message cannot be empty');
                }
    
                const nickname = users[socket.id] || 'Anonymous';
                const timestamp = Date.now();
    
                io.to(socket.id).emit('chat message', { msg, nickname: 'You', timestamp, isSelf: true });
                socket.broadcast.emit('chat message', { msg, nickname, timestamp, isSelf: false });
    
                console.log('a message was sent.');

            } catch (error) {
                console.error('Error sending chat message:', error);
            }
        });

        socket.on('typing', (nickname) => {
            socket.broadcast.emit('typing', nickname);
        });

        // Handle disconnects
        socket.on('disconnect', () => {
            console.log('a user disconnected');
            const nickname = users[socket.id] || 'A user';
            io.emit('user activity', `${nickname} left the chat`);
            delete users[socket.id];
            updateUserList();
        });

        // Update user list
        function updateUserList() {
            io.emit('update users', Object.values(users));
        }
    } catch (error) {
        console.error('Socket error:', error);
        socket.emit('error', 'An unexpected error occurred');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

// Global error handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});



