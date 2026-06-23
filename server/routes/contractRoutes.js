import express from 'express';
import {
  getContracts,
  getContract,
  updateContractStatus,
} from '../controllers/contractController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getContracts);
router.get('/:id', protect, getContract);
router.put('/:id/status', protect, updateContractStatus);

export default router;
