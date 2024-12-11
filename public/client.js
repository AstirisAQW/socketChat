// Client-side JavaScript
const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname');
const setNicknameButton = document.getElementById('set-nickname');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let socket; // Declare the socket variable

// Set nickname and establish the connection
setNicknameButton.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();
  if (nickname) {
    // Establish the socket connection after nickname is set
    socket = io();

    // Send the nickname to the server
    socket.emit('set nickname', nickname);

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
