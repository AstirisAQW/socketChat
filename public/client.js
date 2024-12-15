const form = document.getElementById('form');
const input = document.getElementById('input');
const messageList = document.getElementById('message-list');
const userList = document.getElementById('user-list');
const exitButton = document.getElementById('exit-button');  // Reference to the exit button

let socket;
let username;

// Prompt for username on page load
window.onload = () => {
    username = prompt("Enter your nickname:");
    if (!username) {
        username = "Anonymous";
    }
    initializeSocket();
};

// Initialize socket connection
function initializeSocket() {
    socket = io();

    // Send nickname to the server
    socket.emit('set nickname', username);

    // Handle receiving chat messages (no timestamp)
    socket.on('chat message', ({ msg, nickname, timestamp, isSelf }) => {
        const li = document.createElement('li');
        li.classList.add(isSelf ? 'self' : 'other'); // Apply bubble-specific class to the list item
    
        // Create the chat bubble for the message
        const messageBubble = document.createElement('div');
        messageBubble.textContent = isSelf ? msg : `${nickname}: ${msg}`;
        messageBubble.classList.add('chat-bubble'); // Style for the chat bubble
    
        // Create the timestamp element
        const timeElement = document.createElement('div');
        const timeString = new Date(timestamp).toLocaleTimeString(); // Convert milliseconds to readable time
        timeElement.textContent = timeString;
        timeElement.classList.add('timestamp'); // Style for the timestamp
    
        // Append elements to the list item
        li.appendChild(messageBubble);
        li.appendChild(timeElement);
    
        // Append the list item to the message list
        messageList.appendChild(li);
    
        // Auto-scroll to the latest message
        messageList.scrollTop = messageList.scrollHeight;
    });

    // Handle user activity (joined/left notifications)
    socket.on('user activity', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        li.classList.add('text-muted', 'fst-italic');
        messageList.appendChild(li);
        messageList.scrollTop = messageList.scrollHeight;
    });

    // Update the user list
    socket.on('update users', (users) => {
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            li.classList.add('list-group-item');
            userList.appendChild(li);
        });
    });

    // Handle "Exit" button click to disconnect the user
    exitButton.addEventListener('click', () => {
        socket.emit('disconnect');  // Disconnect from the server
        location.reload();  // Reload the page
    });
}

// Handle sending messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);  // Emit message to server
        input.value = '';  // Clear the input field
    }
});
