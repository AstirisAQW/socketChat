const form = document.getElementById('form');
const input = document.getElementById('input');
const messageList = document.getElementById('message-list');
const userList = document.getElementById('user-list');
const exitButton = document.getElementById('exit-button');  // Reference to the exit button

let socket;
let username;

// Prompt for username on page load
window.onload = () => {
    const nicknameModal = document.getElementById('nickname-modal');
    const nicknameInput = document.getElementById('nickname-input');
    const nicknameSubmit = document.getElementById('nickname-submit');

    // Show modal
    nicknameModal.style.visibility = 'visible';
    nicknameModal.style.opacity = '1';

    // Handle submitting nickname
    nicknameSubmit.addEventListener('click', () => {
        username = nicknameInput.value.trim() || "Anonymous";  // Fallback to "Anonymous" if empty
        if (username) {
            nicknameModal.style.visibility = 'hidden';  // Hide modal
            nicknameModal.style.opacity = '0';
            initializeSocket();  // Initialize the socket connection
        }
    });

    // Close the modal if user presses "Enter"
    nicknameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            nicknameSubmit.click();
        }
    });
};

// Initialize socket connection
function initializeSocket() {
    socket = io();

    // Set up a global error handler for IO errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        alert('An unexpected error occurred. Please reload the page and try again.');
    });

    // Send nickname to the server
    socket.emit('set nickname', username);

    // Handle receiving chat messages (no timestamp)
    socket.on('chat message', ({ msg, nickname, timestamp, isSelf }) => {
        try {
            const li = document.createElement('li');
            li.classList.add(isSelf ? 'self' : 'other'); // Apply bubble-specific class to the list item
            
            // Create the username element
            const usernameElement = document.createElement('div');
            usernameElement.textContent = nickname;
            usernameElement.classList.add('username');  // Apply class for styling the username
            
            // Create the chat bubble for the message
            const messageBubble = document.createElement('div');
            messageBubble.textContent = isSelf ? msg : `${msg}`;
            messageBubble.classList.add('chat-bubble'); // Style for the chat bubble
            
            // Create the timestamp element
            const timeElement = document.createElement('div');
            const timeString = new Date(timestamp).toLocaleTimeString(); // Convert milliseconds to readable time
            timeElement.textContent = timeString;
            timeElement.classList.add('timestamp'); // Style for the timestamp
            
            // Append username, message bubble, and timestamp to the list item
            li.appendChild(usernameElement);  // Append the username
            li.appendChild(messageBubble);  // Append the chat bubble
            li.appendChild(timeElement);  // Append the timestamp
            
            // Append the list item to the message list
            messageList.appendChild(li);
            
            // Auto-scroll to the latest message
            messageList.scrollTop = messageList.scrollHeight;
        } catch (error) {
            console.error('Error handling chat message:', error);
        }
    });

    input.addEventListener('input', () => {
        try {
            socket.emit('typing', username);
        } catch (error) {
            console.error('Error sending typing notification:', error);
        }
    });
    
    // Handle typing notifications
    socket.on('typing', (nickname) => {
        try {
            let typingIndicator = document.getElementById('typing-indicator');
            if (!typingIndicator) {
                typingIndicator = document.createElement('li');
                typingIndicator.id = 'typing-indicator';
                typingIndicator.classList.add('text-muted', 'fst-italic');
                messageList.appendChild(typingIndicator);
            }
            typingIndicator.textContent = `${nickname} is typing...`;
        
            // Remove the typing indicator after 3 seconds if the user stops typing
            clearTimeout(typingIndicator.timeout);
            typingIndicator.timeout = setTimeout(() => {
                typingIndicator.remove();
            }, 3000);
        } catch (error) {
            console.error('Error handling typing notification:', error);
        }
    });
    

    // Handle user activity (joined/left notifications)
    socket.on('user activity', (msg) => {
        try {
            const li = document.createElement('li');
            li.textContent = msg;
            li.classList.add('text-muted', 'fst-italic');
            messageList.appendChild(li);
            messageList.scrollTop = messageList.scrollHeight;
        } catch (error) {
            console.error('Error handling user activity:', error);
        }
    });

    // Update the user list
    socket.on('update users', (users) => {
        try {
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user;
                li.classList.add('list-group-item');
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Error updating user list:', error);
        }
    });

    // Handle "Exit" button click to disconnect the user
    exitButton.addEventListener('click', () => {
        try {
            socket.disconnect();  // Properly disconnect the socket
            location.reload();  // Reload the page to reset the UI
        } catch (error) {
            console.error('Error disconnecting socket:', error);
        }
    });
}

// Handle sending messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        try {
            socket.emit('chat message', input.value);  // Emit message to server
            input.value = '';  // Clear the input field
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    }
});

