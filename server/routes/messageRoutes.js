import express from 'express';
import {
  getChatHistory,
  getConversations,
  getRoom,
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/room/:userId', protect, getRoom);
router.get('/:roomId', protect, getChatHistory);

export default router;
