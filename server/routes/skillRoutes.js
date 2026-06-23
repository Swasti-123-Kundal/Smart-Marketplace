import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getQuiz, submitQuiz, getVerifications } from '../controllers/skillController.js';

const router = express.Router();

router.get('/quiz/:skill', protect, getQuiz);
router.post('/verify/:skill', protect, submitQuiz);
router.get('/verifications', protect, getVerifications);

export default router;
