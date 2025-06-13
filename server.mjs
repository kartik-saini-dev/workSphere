
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.BASE_URL,
      methods: ['GET', 'POST', 'Delete', 'PUT'],
    },
  });

  const usersInRoom = new Map();
  const onlineUsers = new Map();


  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    socket.on('setup', ({ userId }) => setupUser(userId, socket));
    socket.on('joinRoom', ({ userRoom, userId }) => joinRoom(userRoom, userId, socket));
    socket.on('message', (messageData) => handleMessage(messageData, socket));
    socket.on('updateMessage', ({ messageId, updatedText, userRoom, sender, receiver }) => updateMessage(messageId, sender, receiver, updatedText, userRoom, socket));
    socket.on('deleteMessage', ({ messageId, userRoom, sender, receiver }) => deleteMessage(messageId, sender, receiver, userRoom, socket));
    socket.on('markAsSeen', ({ userId, conversationId }) => markAsSeen(userId, conversationId, socket));
    socket.on('disconnect', () => handleDisconnect(socket));
    socket.on('leaveRoom', ({ userRoom, userId }) => {
      disconnectFromRoom(userRoom, userId, socket);
    });
    // Listen for typing event
    socket.on("typing", ({ room, user }) => {
      // Emit to all clients in the room except the sender
      socket.to(room).emit("userTyping", { user });
    });

    // Listen for stopTyping event
    socket.on("stopTyping", ({ room, user }) => {
      // Emit to all clients in the room except the sender
      socket.to(room).emit("userStoppedTyping", { user });
    });
  });



  function setupUser(userId, socket) {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, { socketId: socket.id });
    } else {
      const existingSocketId = onlineUsers.get(userId).socketId;
      if (existingSocketId !== socket.id) {
        onlineUsers.set(userId, { socketId: socket.id });
      }
    }
  }

  function joinRoom(userRoom, userId, socket) {

    if (socket.userRoom) {
      disconnectFromRoom(socket.userRoom, socket.userId, socket);
    }

    socket.join(userRoom);
    socket.userRoom = userRoom;
    socket.userId = userId;
    console.log("this user", userId, "has joined the room")
    if (!usersInRoom.has(userRoom)) {
      usersInRoom.set(userRoom, { participants: [] });
    }

    const participants = usersInRoom.get(userRoom).participants;

    if (!participants.includes(userId)) {
      participants.push(userId);
    }
  }

  async function handleMessage({ to, from, message, type, userRoom, createdAt }, socket) {
    try {
      const isRecipientOnline = usersInRoom.has(userRoom) && usersInRoom.get(userRoom).participants.includes(to);

      // Prepare the message data
      const messageData = {
        to,
        from,
        message,
        type,
        createdAt,
        seen: isRecipientOnline,
      };

      // Send the message to the server
      const response = await fetch(`${process.env.BASE_URL}/api/messages/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        const savedMessage = responseData.message; // The saved message
        const count = responseData.unseenMessageCount || 0; // Unseen count calculated by backend
        // Emit the message event to the room
        io.to(userRoom).emit("sendmessage", {
          _id: savedMessage._id,
          from,
          to,
          text: savedMessage.text,
          created_at: savedMessage.created_at,
          seen: isRecipientOnline,
          type,
        });
        if (onlineUsers.has(to) && !isRecipientOnline) {
          const receiver = onlineUsers.get(to).socketId;
          socket.to(receiver).emit("unseenReceived", { count, to, from });
        } else {
          console.log("ONe thing is missing");
        }
      } else {
        console.error("Error saving message:", responseData);
      }
    } catch (error) {
      console.error("Error in handleMessage:", error);
    }
  }


  async function updateMessage(messageId, sender, receiver, updatedText, userRoom, socket) {
    try {
      // API call to update message in the database
      const url = `${process.env.BASE_URL}/api/messages/update/?messageId=${messageId}&sender=${sender}&receiver=${receiver}`;
      const data = { text: updatedText };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          io.to(userRoom).emit('messageUpdated', { messageId, updatedText });


        }
        // Emit the update to all users in the room

      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }
  async function deleteMessage(messageId, sender, receiver, userRoom, socket) {
    try {
      // API call to delete message from the database using fetch
      const response = await fetch(
        `${process.env.BASE_URL}/api/messages/delete/?messageId=${messageId}&sender=${sender}&receiver=${receiver}`,
        {
          method: 'DELETE',
        }
      );

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json(); // Parse the response JSON

        if (data.success) {
          const count = data.unseenMessCount || 0;

          // Emit the delete message to all users in the room
          io.to(userRoom).emit('messageDeleted', { messageId });
          console.log(`Message ${messageId} deleted in room ${userRoom}`);

          // Check if the receiver is online and emit unseen count update
          if (onlineUsers.has(receiver)) {
            const receiverSocketId = onlineUsers.get(receiver).socketId; // Get the socket ID of the receiver
            socket.to(receiverSocketId).emit('unseenReceived', {
              count,
              to: receiver,
              from: sender,
            });
          } else {
            console.log("here misising in delete ");
          }
        }
      } else {
        console.error('Error deleting message:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
  const markAsSeen = async (userId, conversationId) => {
    try {
      const url = `${process.env.BASE_URL}/api/messages/markAsSeen`;
      const data = { userId, conversationId };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        const unseenMessagesCount = responseData.unseenMessCount;
        const unseenMessageIds = responseData.unseenMessageIds; // Include IDs here

        // Emit real-time update to the specific room
        io.to(conversationId).emit("messagesSeen", {
          unseenMessagesCount,
          unseenMessageIds, // Send the unseen message IDs
        });

        console.log(`Messages marked as seen for conversation: ${conversationId}`);
      }
    } catch (error) {
      console.error("Error in markAsSeen function:", error);
    }
  };


  function disconnectFromRoom(userRoom, userId, socket) {
    console.log("this user", userId, "has leave trigger the room")
    // Check if the room exists
    if (usersInRoom.has(userRoom)) {
      const participants = usersInRoom.get(userRoom).participants;

      // Remove the user from the participants list
      const updatedParticipants = participants.filter(
        (participantId) => participantId !== userId
      );

      if (updatedParticipants.length === 0) {
        // If no participants remain, delete the room
        usersInRoom.delete(userRoom);
        console.log(`Room ${userRoom} deleted as it is empty.`);
      } else {
        // Otherwise, update the participants list
        usersInRoom.set(userRoom, { participants: updatedParticipants });
      }

      console.log(`User ${userId} left room ${userRoom}`);
    }

    // Remove the user from the socket's room and user references
    socket.leave(userRoom);
    delete socket.userRoom;
    delete socket.userId;
  }

  function handleDisconnect(socket) {
    const userRoom = socket.userRoom;
    const userId = socket.userId;

    if (userRoom && userId) {
      disconnectFromRoom(userRoom, userId, socket);
    }


    console.log(`Socket ${socket.id} disconnected`);
  }


  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
