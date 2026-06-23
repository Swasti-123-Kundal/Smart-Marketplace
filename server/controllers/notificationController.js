import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const total = await Notification.countDocuments({ userId: req.user._id });
  const unreadCount = await Notification.countDocuments({
    userId: req.user._id,
    isRead: false,
  });

  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true }
  );

  res.json({ success: true, message: 'Notification marked as read' });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});
