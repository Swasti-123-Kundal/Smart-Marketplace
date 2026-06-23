import express from 'express';
import {
  createProposal,
  getProjectProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
} from '../controllers/proposalController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import { proposalValidator } from '../validators/proposalValidator.js';

const router = express.Router();

// Freelancer
router.post('/', protect, authorize('freelancer'), proposalValidator, createProposal);
router.get('/my', protect, authorize('freelancer'), getMyProposals);

// Client
router.get('/project/:projectId', protect, authorize('client'), getProjectProposals);
router.put('/:id/accept', protect, authorize('client'), acceptProposal);
router.put('/:id/reject', protect, authorize('client'), rejectProposal);

export default router;
