import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { receiveMessage, setOnlineUsers, setPartnerTyping } from '../redux/slices/chatSlice';
import { addNotification } from '../redux/slices/notificationSlice';

// A single instance of socket to share across hooks
let socketInstance = null;

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      return;
    }

    if (!socketInstance) {
      // Connect to root path since we proxied in vite.config
      socketInstance = io('/', {
        autoConnect: true,
        transports: ['websocket'],
      });
      console.log('🔌 Connecting socket.io client...');
    }

    socketRef.current = socketInstance;

    // Listeners
    socketInstance.on('receive-message', (message) => {
      dispatch(receiveMessage(message));
    });

    socketInstance.on('user-typing', ({ userId, isTyping }) => {
      dispatch(setPartnerTyping({ userId, isTyping }));
    });

    socketInstance.on('new-message-notification', (notif) => {
      dispatch(
        addNotification({
          _id: notif.roomId + Date.now(),
          message: `New message from ${notif.sender.name}: ${notif.message}`,
          isRead: false,
          createdAt: new Date(),
        })
      );
    });

    socketInstance.on('user-online', ({ userId, isOnline }) => {
      // Typically you'd check list or map of online users
      // For simplicity, we can fetch all or just track online states in state
    });

    return () => {
      if (socketInstance) {
        socketInstance.off('receive-message');
        socketInstance.off('user-typing');
        socketInstance.off('new-message-notification');
        socketInstance.off('user-online');
      }
    };
  }, [user, dispatch]);

  const joinRoom = (roomId) => {
    socketInstance?.emit('join-room', { roomId });
  };

  const leaveRoom = (roomId) => {
    socketInstance?.emit('leave-room', { roomId });
  };

  const sendMessage = (roomId, receiverId, message) => {
    socketInstance?.emit('send-message', { roomId, receiverId, message });
  };

  const emitTyping = (roomId, isTyping) => {
    socketInstance?.emit('typing', { roomId, isTyping });
  };

  const markRead = (roomId) => {
    socketInstance?.emit('mark-read', { roomId });
  };

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    emitTyping,
    markRead,
  };
};

export default useSocket;
