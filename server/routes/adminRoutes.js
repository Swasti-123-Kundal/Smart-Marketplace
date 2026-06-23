import express from 'express';
import {
  getStats,
  getAllUsers,
  toggleBanUser,
  deleteUser,
  getAdminProjects,
  deleteAdminProject,
  getAdminContracts,
  getAdminPayments,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);
router.get('/projects', getAdminProjects);
router.delete('/projects/:id', deleteAdminProject);
router.get('/contracts', getAdminContracts);
router.get('/payments', getAdminPayments);

export default router;
