import Notification from '../models/Notification.js';

/**
 * Create a notification and emit it via Socket.io if available.
 * @param {Object} io - Socket.io server instance
 * @param {Object} data - Notification data
 * @param {string} data.userId - Recipient user ID
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} [data.link] - Optional link
 * @param {Object} [data.metadata] - Optional metadata
 */
export const createNotification = async (io, data) => {
  try {
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || '',
      metadata: data.metadata || {},
    });

    // Emit real-time notification
    if (io) {
      io.to(`user_${data.userId}`).emit('new-notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
