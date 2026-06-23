import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getFreelancerReputation,
  triggerRecalculate,
  getLeaderboard,
} from '../controllers/reputationController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:userId', getFreelancerReputation);
router.post('/recalculate/:userId', protect, triggerRecalculate);

export default router;
