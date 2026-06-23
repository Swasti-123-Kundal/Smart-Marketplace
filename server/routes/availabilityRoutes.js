import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  setAvailability,
  getMyAvailability,
  getUserAvailability,
} from '../controllers/availabilityController.js';

const router = express.Router();

router.post('/', protect, setAvailability);
router.get('/my', protect, getMyAvailability);
router.get('/user/:userId', protect, getUserAvailability);

export default router;
