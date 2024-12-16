# SocketChat: Socket.IO Chat Application**

## Overview
This project is a real-time chat application built using Node.js, Express, and Socket.IO. The application allows users to join a chat room, exchange messages in real-time, and see who is online. It features typing indicators, timestamped messages, and a user-friendly UI built with HTML, CSS, and JavaScript.

## Features
- Real-time Messaging: Users can send and receive messages instantly.
- User Nicknames: Users are prompted to set a nickname when they join.
- Online Users List: Displays a live list of users currently online.
- Typing Indicators: Shows when a user is typing.
- Message Timestamps: Displays the time messages are sent.
- Graceful Disconnections: Users are notified when someone leaves the chat.

## Architecture
**Technologies Used:**
- Node.js: Backend runtime.
- Express.js: Web framework for serving static files and handling routes.
- Socket.IO: For real-time bi-directional communication.
- Bootstrap: For responsive and clean UI design.
- Custom CSS: Additional styling to enhance the interface.

## Installation and Setup
**Prerequisites:**
- Node.js: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- npm (Node Package Manager): Should be installed along with Node.js.

**Setting Up the Server**
1. Clone the repository (or copy the files if you already have them).
```
  git clone https://your-repository-url.git
  cd your-repository-folder
```
2. Install Dependencies: Navigate to the folder containing the server.js and run:
```
  npm install
```
This will install the required packages, including Express and Socket.io.
3. Run the Server: To start the server, execute the following command:
```
  node server.js
```
This will start the application on http://localhost:3000.

### Accessing the Application
- Open a browser and navigate to http://localhost:3000.
- On the landing page, you will be prompted to enter a nickname.
- After entering the nickname, you will be able to start chatting with other users.

## Configuration Settings
This application does not require any specific configuration files or environment variables. All settings are handled within the application code, including:
- Port: The application runs on port 3000 by default (server.listen(3000)).
- Socket Events: Event names like set nickname, chat message, user activity, etc., are predefined.

## API Reference
### Server API
**server.js**:
The server is responsible for handling client connections via Socket.IO, managing chat messages, user activity, and broadcasting updates.
- io.on('connection', callback):
  - Parameters: callback (Function): This function is executed whenever a new client connects. The socket object is passed to this function.
  - Returns: No return value.
  - Possible Exceptions: Socket errors are caught by try-catch blocks and will trigger an 'error' event to the client.

- socket.on('set nickname', callback):
  - Parameters: nickname (String): The nickname the user chooses.
  - Returns: Updates the users object and emits a user activity event to broadcast to all clients.
  - Possible Exceptions: No exceptions are expected for this function, as it just stores the nickname.
- socket.on('chat message', callback):
  - Parameters: msg (String): The message the user sends.
  - Returns: Emits a chat message event to all connected users, including timestamp information and the sender's nickname.
  - Possible Exceptions: If msg is empty, an error message is sent back to the client.
- socket.on('typing', callback):
  - Parameters: nickname (String): The nickname of the user typing.
  - Returns: Broadcasts a typing event to other users.
- socket.on('disconnect'):
  - Parameters: None.
  - Returns: Removes the user from the users object and emits a user activity event when a user disconnects.
- updateUserList():
  - Parameters: None.
  - Returns: Emits an update users event to all clients with a list of current users.


### Client API
**client.js**:
Handles the client-side behavior, including establishing a Socket.IO connection, emitting and receiving events, and updating the DOM.
- socket.emit('set nickname', nickname):
  - Parameters: nickname (String): The nickname to be set for the user.
  - Returns: No return value.
  - Possible Exceptions: If the nickname exceeds 20 characters, an alert will be displayed on the UI.
- socket.on('chat message', callback):
  - Parameters: msg (String): The chat message received from the server.
  - nickname (String): The nickname of the message sender.
  - timestamp (Number): The timestamp of the message.
  - isSelf (Boolean): Indicates whether the message is from the current user.
  - Returns: Updates the message list in the UI.
  - Possible Exceptions: If the message exceeds 500 characters, an alert will be displayed.
- socket.on('typing', callback):
  - Parameters: nickname (String): The nickname of the user typing.
  - Returns: Updates the message list with a typing indicator.
  - Possible Exceptions: None.
- socket.on('user activity', callback):
  - Parameters: msg (String): The user activity message (e.g., user joined or left).
  - Returns: Adds the activity message to the UI.
  - Possible Exceptions: None.
- socket.on('update users', callback):
  - Parameters: users (Array): The list of current users.
  - Returns: Updates the user list in the UI.
  - Possible Exceptions: None.
- exitButton.addEventListener('click', callback):
  - Parameters: callback (Function): Executes when the user clicks the exit button.
  - Returns: Disconnects the socket and reloads the page.
  - Possible Exceptions: None.


## Troubleshooting
**Common Errors and Solutions**:
- Error: "Socket.IO connection failed"
  - Solution: Ensure the server is running (node server.js) and that the client is correctly connecting to the right port (localhost:3000).
- Error: "Message cannot be empty"
-   Solution: Check if the message input field is empty before sending. Ensure the client-side validation is working.
- Error: "Nickname must be less than 20 characters"
-   Solution: Ensure the nickname input is within the specified character limit.
- Error: "Message exceeds 500 characters"
-   Solution: Avoid sending messages that are too long. The client-side validation will alert users if the message exceeds the character limit.
- Error: "Failed to update user list"
-   Solution: This could be caused by issues in the updateUserList function. Make sure the server emits the update user event correctly.

## Test Instructions
**Manual Testing**
1. Start the Server: Run the server using node server.js.
2. Open Multiple Browser Tabs: Open multiple browser tabs or use different browsers to test real-time messaging and user activity.
3. Test Message Sending: Test sending messages from multiple users, ensuring they appear correctly in the chat window and display the correct nickname, timestamp, and alignment.
4. Test Typing Indicator: Verify that typing indicators appear when users are typing and disappear after 3 seconds of inactivity.
5. Test User List Updates: Check that the online user list updates properly as users join and leave.
6. Test Disconnect: Test disconnecting a user and verify that the chat updates accordingly.

## Future Improvements
1. Private Messaging: Allow users to send direct messages.
2. Rooms/Channels: Enable multiple chat rooms.
3. Persistent Storage: Store chat history using a database.
4. Enhanced UI: Improve animations and add themes.

## Conclusion
This Socket.IO chat application demonstrates real-time communication using a simple yet functional architecture. With additional features, it can serve as a foundation for more complex messaging platforms.
