import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
