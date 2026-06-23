import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createMilestone,
  getContractMilestones,
  submitMilestone,
  approveMilestone,
  rejectMilestone,
  payMilestone,
} from '../controllers/milestoneController.js';

const router = express.Router();

router.post('/contract/:contractId', protect, createMilestone);
router.get('/contract/:contractId', protect, getContractMilestones);
router.post('/:id/submit', protect, submitMilestone);
router.post('/:id/approve', protect, approveMilestone);
router.post('/:id/reject', protect, rejectMilestone);
router.post('/:id/pay', protect, payMilestone);

export default router;
