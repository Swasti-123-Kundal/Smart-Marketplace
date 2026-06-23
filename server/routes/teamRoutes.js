import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  inviteMember,
  getMyInvitations,
  respondToInvitation,
  getProjectMembers,
  removeMember,
  createTask,
  getTasks,
  updateTask,
  uploadFile,
  getFiles,
  sendChatMessage,
  getChatMessages,
  getActivities,
  markChatAsRead,
} from '../controllers/teamController.js';

const router = express.Router();

router.post('/invite', protect, inviteMember);
router.get('/invitations/my', protect, getMyInvitations);
router.post('/invitations/:id/respond', protect, respondToInvitation);

// Project specific endpoints
router.get('/project/:projectId/members', protect, getProjectMembers);
router.delete('/project/:projectId/members/:userId', protect, removeMember);

router.post('/project/:projectId/tasks', protect, createTask);
router.get('/project/:projectId/tasks', protect, getTasks);
router.put('/tasks/:taskId', protect, updateTask);

router.post('/project/:projectId/files', protect, uploadFile);
router.get('/project/:projectId/files', protect, getFiles);

router.post('/project/:projectId/chat', protect, sendChatMessage);
router.get('/project/:projectId/chat', protect, getChatMessages);
router.post('/project/:projectId/chat/read', protect, markChatAsRead);
router.get('/project/:projectId/activities', protect, getActivities);

export default router;
