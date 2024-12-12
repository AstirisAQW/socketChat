// Client-side JavaScript
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname');
const setNicknameButton = document.getElementById('set-nickname');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typingNotification = document.getElementById('typing-notification'); // Add element for typing notification

let socket; // Declare the socket variable

let typingTimeout; // To manage the typing delay

// Set nickname and establish the connection
setNicknameButton.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();
  if (nickname) {
    socket = io();
    socket.emit('set nickname', nickname); // Send nickname to the server

    // Hide the nickname prompt and show the chat interface
    nicknameContainer.style.display = 'none';
    form.style.display = 'flex';

    // Listen for chat messages
    socket.on('chat message', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Listen for user activity (join/leave notifications)
    socket.on('user activity', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      item.classList.add('notification');
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Listen for typing notifications
    socket.on('typing', (nickname) => {
      typingNotification.textContent = `${nickname} is typing...`;
    });

    // Listen for stop typing notifications
    socket.on('stop typing', () => {
      typingNotification.textContent = '';
    });
  }
});

// Handle form submission (send chat messages)
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Emit 'typing' event when the user types
input.addEventListener('input', () => {
  socket.emit('typing'); // Notify the server that the user is typing

  // Clear any previous timeout and set a new one
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stop typing'); // Notify the server when the user stops typing
  }, 1000); // Adjust delay as needed (1000ms = 1 second)
});
