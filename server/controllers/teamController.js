import TeamInvitation from '../models/TeamInvitation.js';
import TeamMember from '../models/TeamMember.js';
import TeamTask from '../models/TeamTask.js';
import TeamFile from '../models/TeamFile.js';
import TeamMessage from '../models/TeamMessage.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import ProjectActivity from '../models/ProjectActivity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * Helper: check if user is a member of the project team or is the client
 */
const verifyProjectAccess = async (projectId, userId, allowClient = true) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  if (allowClient && project.clientId.toString() === userId) {
    return { project, isClient: true };
  }

  const member = await TeamMember.findOne({ projectId, userId });
  if (!member) throw ApiError.forbidden('You do not have access to this project workspace');

  return { project, isClient: false };
};

/**
 * @desc    Invite a freelancer to join a project team
 * @route   POST /api/team/invite
 * @access  Private (Client-only)
 */
export const inviteMember = asyncHandler(async (req, res) => {
  const { projectId, freelancerEmail, role } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project client can invite members');
  }

  const freelancer = await User.findOne({ email: freelancerEmail, role: 'freelancer' });
  if (!freelancer) throw ApiError.notFound('Freelancer with this email not found');

  // Check if already a member
  const existingMember = await TeamMember.findOne({ projectId, userId: freelancer._id });
  if (existingMember) throw ApiError.conflict('Freelancer is already a member of this project');

  // Check if pending invitation exists
  const existingInvite = await TeamInvitation.findOne({ projectId, freelancerId: freelancer._id, status: 'pending' });
  if (existingInvite) throw ApiError.conflict('An invitation is already pending for this freelancer');

  const invitation = await TeamInvitation.create({
    projectId,
    clientId: req.user._id,
    freelancerId: freelancer._id,
    role,
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: freelancer._id,
    type: 'team_invite',
    title: 'Team Invitation Received 🤝',
    message: `You are invited to join project "${project.title}" as a ${role}`,
    link: `/freelancer/team-invitations`,
  });

  res.status(201).json({
    success: true,
    invitation,
  });
});

/**
 * @desc    Get pending team invitations for the logged-in freelancer
 * @route   GET /api/team/invitations/my
 * @access  Private (Freelancer-only)
 */
export const getMyInvitations = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw ApiError.forbidden('Only freelancers can view invitations');
  }

  const invitations = await TeamInvitation.find({ freelancerId: req.user._id, status: 'pending' })
    .populate('projectId', 'title description budget deadline')
    .populate('clientId', 'name email profileImage');

  res.json({
    success: true,
    invitations,
  });
});

/**
 * @desc    Accept or reject team invitation
 * @route   POST /api/team/invitations/:id/respond
 * @access  Private (Freelancer-only)
 */
export const respondToInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body; // Boolean

  if (req.user.role !== 'freelancer') {
    throw ApiError.forbidden('Only freelancers can respond to invitations');
  }

  const invitation = await TeamInvitation.findById(id);
  if (!invitation) throw ApiError.notFound('Invitation not found');

  if (invitation.freelancerId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized to respond to this invitation');
  }

  if (invitation.status !== 'pending') {
    throw ApiError.badRequest('Invitation has already been responded to');
  }

  invitation.status = accept ? 'accepted' : 'rejected';
  await invitation.save();

  if (accept) {
    // Add to TeamMembers
    await TeamMember.create({
      projectId: invitation.projectId,
      userId: req.user._id,
      role: invitation.role,
    });

    // Notify client
    const project = await Project.findById(invitation.projectId);
    const io = req.app.get('io');
    await createNotification(io, {
      userId: invitation.clientId,
      type: 'team_invite_accepted',
      title: 'Invitation Accepted! 🎉',
      message: `${req.user.name} accepted your invite for "${project.title}"`,
      link: `/client/workspace/${invitation.projectId}`,
    });
  }

  res.json({
    success: true,
    invitation,
  });
});

/**
 * @desc    Get active members and pending invitations for a project team
 * @route   GET /api/team/project/:projectId/members
 * @access  Private (Contract Parties)
 */
export const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const members = await TeamMember.find({ projectId }).populate('userId', 'name email profileImage skills bio');
  const pendingInvitations = await TeamInvitation.find({ projectId, status: 'pending' })
    .populate('freelancerId', 'name email profileImage');

  res.json({
    success: true,
    members,
    pendingInvitations,
  });
});

/**
 * @desc    Remove a member from the project team
 * @route   DELETE /api/team/project/:projectId/members/:userId
 * @access  Private (Client-only)
 */
export const removeMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project client can remove team members');
  }

  const deletedMember = await TeamMember.findOneAndDelete({ projectId, userId });
  if (!deletedMember) throw ApiError.notFound('Member not found on this team');

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId,
    type: 'team_removed',
    title: 'Removed from team ⚠️',
    message: `You were removed from team for project "${project.title}"`,
    link: `/freelancer/dashboard`,
  });

  res.json({
    success: true,
    message: 'Member removed successfully',
  });
});

/**
 * Workspace tasks controllers
 */
export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, deadline } = req.body;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const task = await TeamTask.create({
    projectId,
    title,
    description,
    assignedTo: assignedTo || null,
    deadline: deadline || null,
  });

  // Log timeline activity
  await ProjectActivity.create({
    projectId,
    userId,
    activityType: 'task_created',
    message: `Task created: "${task.title}"`,
  });

  res.status(201).json({ success: true, task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const tasks = await TeamTask.find({ projectId })
    .populate('assignedTo', 'name profileImage')
    .sort({ createdAt: -1 });

  res.json({ success: true, tasks });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status, assignedTo, title, description, deadline } = req.body;

  const task = await TeamTask.findById(taskId);
  if (!task) throw ApiError.notFound('Task not found');

  const userId = req.user._id.toString();
  await verifyProjectAccess(task.projectId, userId);

  const oldStatus = task.status;
  if (status !== undefined) task.status = status;
  if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (deadline !== undefined) task.deadline = deadline || null;

  await task.save();

  // Log timeline activity if status changed
  if (status !== undefined && status !== oldStatus) {
    await ProjectActivity.create({
      projectId: task.projectId,
      userId,
      activityType: 'task_created', // we reuse task_created or generic type
      message: `Task "${task.title}" status updated to ${status}`,
    });
  }

  res.json({ success: true, task });
});

/**
 * Workspace files controllers
 */
export const uploadFile = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, url } = req.body;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const teamFile = await TeamFile.create({
    projectId,
    uploadedBy: req.user._id,
    name,
    url,
  });

  // Log timeline activity
  await ProjectActivity.create({
    projectId,
    userId,
    activityType: 'file_uploaded',
    message: `Shared new file deliverable: "${name}"`,
  });

  res.status(201).json({ success: true, file: teamFile });
});

export const getFiles = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const files = await TeamFile.find({ projectId })
    .populate('uploadedBy', 'name profileImage')
    .sort({ createdAt: -1 });

  res.json({ success: true, files });
});

/**
 * Workspace chat controllers
 */
export const sendChatMessage = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { text } = req.body;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const message = await TeamMessage.create({
    projectId,
    senderId: req.user._id,
    text,
  });

  await message.populate('senderId', 'name profileImage');

  // Emit chat message event to room
  const io = req.app.get('io');
  io.to(`project_${projectId}`).emit('team_message', message);

  res.status(201).json({ success: true, message });
});

export const getChatMessages = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const messages = await TeamMessage.find({ projectId })
    .populate('senderId', 'name profileImage')
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

export const getActivities = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  const activities = await ProjectActivity.find({ projectId })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 });

  res.json({ success: true, activities });
});

export const markChatAsRead = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id.toString();

  await verifyProjectAccess(projectId, userId);

  // Add userId to readBy in TeamMessage
  await TeamMessage.updateMany(
    { projectId, 'readBy.userId': { $ne: req.user._id } },
    { $addToSet: { readBy: { userId: req.user._id, readAt: new Date() } } }
  );

  res.json({ success: true, message: 'Messages marked as read' });
});
