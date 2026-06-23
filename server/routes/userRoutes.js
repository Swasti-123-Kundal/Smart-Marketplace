import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getFreelancers,
  getFreelancerById,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();

// Public
router.get('/freelancers', getFreelancers);
router.get('/freelancers/:id', getFreelancerById);

// Private
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadSingle, uploadAvatar);

export default router;
