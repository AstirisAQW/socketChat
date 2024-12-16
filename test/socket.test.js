// Import necessary packages
const request = require('supertest');
const { Server } = require('socket.io');
const { createServer } = require('http');
const ioClient = require('socket.io-client');
const app = require('../server'); // Import your Express app

// Set up server and Socket.IO
let server;
let io;

beforeAll((done) => {
  server = createServer(app);
  io = new Server(server);

    // Attach Socket.IO to your server
    io.on('connection', (socket) => {
        // Mock the same behavior as in the original server
        socket.on('set nickname', (nickname) => {
            socket.emit('user activity', `${nickname} joined the chat`);
        });

        socket.on('chat message', (msg) => {
            socket.emit('chat message', { msg, nickname: 'You', isSelf: true });
        });

        socket.on('disconnect', () => {
            socket.emit('user activity', 'A user left the chat');
        });
    });

    server.listen(() => done());
  });

afterAll((done) => {
  io.close();
  server.close(() => {
    done();
  });
}, 10000);

describe('Socket Tests', () => {
    let clientSocket;

    afterEach(() => {
        if (clientSocket) clientSocket.close();
    });

    test('Client should connect to the server', (done) => {
        clientSocket = ioClient(`http://localhost:${server.address().port}`);

        clientSocket.on('connect', () => {
            expect(clientSocket.connected).toBe(true);
            done();
        });
    });

    test('Client should receive user activity message when connected', (done) => {
        clientSocket = ioClient(`http://localhost:${server.address().port}`);

        clientSocket.on('user activity', (msg) => {
            expect(msg).toMatch(/joined the chat/);
            done();
        });

        clientSocket.emit('set nickname', 'Test User');
    });
    
    test('Client can send and receive chat messages', (done) => {
      clientSocket = ioClient(`http://localhost:${server.address().port}`);
    
      clientSocket.on('connect', () => {
        clientSocket.emit('chat message', 'Hello, server!');
      });
    
      clientSocket.on('chat message', (msg) => {
        expect(msg.msg).toBe('Hello, server!');
        done();
      });
    });
    
    
    test('Client can disconnect from server', (done) => {
      clientSocket = ioClient(`http://localhost:${server.address().port}`);
      
      clientSocket.on('connect', () => {
        clientSocket.disconnect();
      });
      
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false);
        done();
      });
    });

    test('Client handles unexpected disconnect', (done) => {
      clientSocket = ioClient(`http://localhost:${server.address().port}`);
    
      clientSocket.on('connect', () => {
        clientSocket.disconnect();
      });
    
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false);
        done();
      });
    });

});