import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();

/**
 * Initialize Socket.io event handlers.
 * @param {import('socket.io').Server} io
 */
export const initializeSocket = (io) => {
  // Auth middleware for socket connections
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split('; ')
          ?.find((c) => c.startsWith('token='))
          ?.split('=')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`🔌 User connected: ${userId}`);

    // Join personal room for notifications
    socket.join(`user_${userId}`);

    // Track online status
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast online status
    io.emit('user-online', { userId, isOnline: true });

    // ---- Chat Events ----

    /**
     * Join a chat room
     */
    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`📫 User ${userId} joined room: ${roomId}`);
    });

    /**
     * Join workspace channel
     */
    socket.on('join-workspace', ({ projectId }) => {
      socket.join(`project_${projectId}`);
      console.log(`📫 User ${userId} joined project workspace room: project_${projectId}`);
    });

    /**
     * Workspace typing indicator
     */
    socket.on('workspace-typing', ({ projectId, isTyping }) => {
      socket.to(`project_${projectId}`).emit('workspace-user-typing', {
        userId,
        isTyping,
      });
    });

    /**
     * Workspace read receipt
     */
    socket.on('workspace-mark-read', ({ projectId }) => {
      socket.to(`project_${projectId}`).emit('workspace-messages-read', {
        userId,
        projectId,
      });
    });

    /**
     * Leave a chat room
     */
    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
    });

    /**
     * Send a message
     */
    socket.on('send-message', async ({ roomId, receiverId, message }) => {
      try {
        // Save message to DB
        const newMessage = await Message.create({
          sender: userId,
          receiver: receiverId,
          message,
          roomId,
        });

        // Populate sender info
        await newMessage.populate('sender', 'name profileImage');

        // Emit to room
        io.to(roomId).emit('receive-message', newMessage);

        // Emit notification to receiver if not in room
        const receiverSockets = await io.in(roomId).fetchSockets();
        const receiverInRoom = receiverSockets.some(
          (s) => s.userId === receiverId
        );

        if (!receiverInRoom) {
          io.to(`user_${receiverId}`).emit('new-message-notification', {
            roomId,
            sender: {
              _id: userId,
              name: newMessage.sender.name,
              profileImage: newMessage.sender.profileImage,
            },
            message: message.substring(0, 50),
          });
        }
      } catch (error) {
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    /**
     * Typing indicator
     */
    socket.on('typing', ({ roomId, isTyping }) => {
      socket.to(roomId).emit('user-typing', {
        userId,
        isTyping,
      });
    });

    /**
     * Mark messages as read
     */
    socket.on('mark-read', async ({ roomId }) => {
      try {
        await Message.updateMany(
          { roomId, receiver: userId, isRead: false },
          { isRead: true }
        );
        socket.to(roomId).emit('messages-read', { userId, roomId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    /**
     * Get online status of a user
     */
    socket.on('check-online', ({ userId: checkUserId }) => {
      const isOnline = onlineUsers.has(checkUserId) && onlineUsers.get(checkUserId).size > 0;
      socket.emit('online-status', { userId: checkUserId, isOnline });
    });

    // ---- Disconnect ----
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId}`);

      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          io.emit('user-online', { userId, isOnline: false });
        }
      }
    });
  });

  console.log('🔌 Socket.io initialized');
};
