import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  getMyProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import { projectValidator } from '../validators/projectValidator.js';

const router = express.Router();

// Public
router.get('/', getProjects);

// Private (Client)
router.get('/user/my', protect, authorize('client'), getMyProjects);

// Public
router.get('/:id', getProject);

router.post('/', protect, authorize('client'), projectValidator, createProject);
router.put('/:id', protect, authorize('client'), updateProject);
router.delete('/:id', protect, authorize('client'), deleteProject);

export default router;
