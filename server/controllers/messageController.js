import Message from '../models/Message.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Generate deterministic room ID from two user IDs.
 */
const generateRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

/**
 * @desc    Get chat history for a room
 * @route   GET /api/messages/:roomId
 * @access  Private
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await Message.find({ roomId: req.params.roomId })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Mark messages as read
  await Message.updateMany(
    {
      roomId: req.params.roomId,
      receiver: req.user._id,
      isRead: false,
    },
    { isRead: true }
  );

  const total = await Message.countDocuments({ roomId: req.params.roomId });

  res.json({
    success: true,
    messages: messages.reverse(), // Chronological order
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get user's conversations
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all unique rooms this user participates in
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$roomId',
        lastMessage: { $first: '$message' },
        lastMessageAt: { $first: '$createdAt' },
        sender: { $first: '$sender' },
        receiver: { $first: '$receiver' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { lastMessageAt: -1 },
    },
  ]);

  // Populate other user's info
  const populated = await Promise.all(
    conversations.map(async (conv) => {
      const otherUserId =
        conv.sender.toString() === userId.toString() ? conv.receiver : conv.sender;
      const otherUser = await User.findById(otherUserId).select(
        'name profileImage role'
      );
      return {
        roomId: conv._id,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount,
        otherUser,
      };
    })
  );

  res.json({ success: true, conversations: populated });
});

/**
 * @desc    Get or create room ID
 * @route   GET /api/messages/room/:userId
 * @access  Private
 */
export const getRoom = asyncHandler(async (req, res) => {
  const otherUser = await User.findById(req.params.userId).select('name profileImage role');
  if (!otherUser) throw ApiError.notFound('User not found');

  const roomId = generateRoomId(req.user._id.toString(), req.params.userId);

  res.json({
    success: true,
    roomId,
    otherUser,
  });
});
