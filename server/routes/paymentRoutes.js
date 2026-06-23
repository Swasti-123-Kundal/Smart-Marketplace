import express from 'express';
import {
  createPaymentOrder,
  verifyPaymentHandler,
  getPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, authorize('client'), createPaymentOrder);
router.post('/verify', protect, authorize('client'), verifyPaymentHandler);
router.get('/', protect, getPayments);

export default router;
