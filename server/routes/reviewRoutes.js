import express from 'express';
import { createReview, getFreelancerReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('client'), createReview);
router.get('/freelancer/:id', getFreelancerReviews);

export default router;
