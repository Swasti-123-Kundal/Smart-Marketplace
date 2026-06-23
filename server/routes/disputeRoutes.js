import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  raiseDispute,
  getDisputeByContract,
  replyToDispute,
  getAllDisputes,
  updateDisputeStatus,
  resolveDispute,
} from '../controllers/disputeController.js';

const router = express.Router();

router.post('/', protect, raiseDispute);
router.get('/contract/:contractId', protect, getDisputeByContract);
router.post('/:id/reply', protect, replyToDispute);
router.get('/admin', protect, getAllDisputes);
router.patch('/:id/status', protect, updateDisputeStatus);
router.post('/:id/resolve', protect, resolveDispute);

export default router;
