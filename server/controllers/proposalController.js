import { validationResult } from 'express-validator';
import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';
import Contract from '../models/Contract.js';
import TeamMember from '../models/TeamMember.js';
import ProjectActivity from '../models/ProjectActivity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Submit a proposal
 * @route   POST /api/proposals
 * @access  Private (Freelancer)
 */
export const createProposal = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', errors.array().map((e) => e.msg));
  }

  const { projectId, coverLetter, expectedBudget } = req.body;

  // Check project exists and is open
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');
  if (project.status !== 'open') throw ApiError.badRequest('Project is no longer accepting proposals');

  // Check for duplicate proposal
  const existing = await Proposal.findOne({
    projectId,
    freelancerId: req.user._id,
  });
  if (existing) throw ApiError.conflict('You have already applied to this project');

  const proposal = await Proposal.create({
    projectId,
    freelancerId: req.user._id,
    coverLetter,
    expectedBudget,
  });

  // Notify client
  const io = req.app.get('io');
  await createNotification(io, {
    userId: project.clientId,
    type: 'new_proposal',
    title: 'New Proposal Received',
    message: `${req.user.name} submitted a proposal for "${project.title}"`,
    link: `/client/proposals`,
  });

  await proposal.populate('freelancerId', 'name profileImage skills');

  res.status(201).json({ success: true, proposal });
});

/**
 * @desc    Get proposals for a project
 * @route   GET /api/proposals/project/:projectId
 * @access  Private (Client - project owner)
 */
export const getProjectProposals = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  const proposals = await Proposal.find({ projectId: req.params.projectId })
    .populate('freelancerId', 'name profileImage skills bio')
    .sort({ createdAt: -1 });

  res.json({ success: true, proposals });
});

/**
 * @desc    Get freelancer's own proposals
 * @route   GET /api/proposals/my
 * @access  Private (Freelancer)
 */
export const getMyProposals = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { freelancerId: req.user._id };

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Proposal.countDocuments(query);

  const proposals = await Proposal.find(query)
    .populate({
      path: 'projectId',
      select: 'title budget deadline status clientId',
      populate: { path: 'clientId', select: 'name profileImage' },
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    proposals,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Accept a proposal (creates contract)
 * @route   PUT /api/proposals/:id/accept
 * @access  Private (Client)
 */
export const acceptProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('projectId');
  if (!proposal) throw ApiError.notFound('Proposal not found');

  if (proposal.projectId.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  if (proposal.status !== 'pending') {
    throw ApiError.badRequest('Proposal has already been processed');
  }

  // Accept this proposal
  proposal.status = 'accepted';
  await proposal.save();

  // Reject other pending proposals for this project
  await Proposal.updateMany(
    { projectId: proposal.projectId._id, _id: { $ne: proposal._id }, status: 'pending' },
    { status: 'rejected' }
  );

  // Update project status
  await Project.findByIdAndUpdate(proposal.projectId._id, { status: 'in_progress' });

  // Create contract
  const contract = await Contract.create({
    projectId: proposal.projectId._id,
    clientId: req.user._id,
    freelancerId: proposal.freelancerId,
    budget: proposal.expectedBudget,
    deadline: proposal.projectId.deadline,
    status: 'pending',
  });

  // Automatically add freelancer to team roster
  await TeamMember.create({
    projectId: proposal.projectId._id,
    userId: proposal.freelancerId,
    role: 'Freelancer',
  });

  // Log Workspace Timeline Initial Activity
  await ProjectActivity.create({
    projectId: proposal.projectId._id,
    userId: req.user._id,
    activityType: 'workspace_joined',
    message: 'Contract created. Team Workspace initialized and Freelancer joined the project roster.',
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: proposal.freelancerId,
    type: 'proposal_accepted',
    title: 'Proposal Accepted! 🎉',
    message: `Your proposal for "${proposal.projectId.title}" has been accepted`,
    link: `/freelancer/contracts`,
  });

  await createNotification(io, {
    userId: proposal.freelancerId,
    type: 'contract_created',
    title: 'New Contract Created',
    message: `A contract for "${proposal.projectId.title}" has been created`,
    link: `/freelancer/contracts`,
  });

  res.json({
    success: true,
    message: 'Proposal accepted and contract created',
    proposal,
    contract,
  });
});

/**
 * @desc    Reject a proposal
 * @route   PUT /api/proposals/:id/reject
 * @access  Private (Client)
 */
export const rejectProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('projectId');
  if (!proposal) throw ApiError.notFound('Proposal not found');

  if (proposal.projectId.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  if (proposal.status !== 'pending') {
    throw ApiError.badRequest('Proposal has already been processed');
  }

  proposal.status = 'rejected';
  await proposal.save();

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: proposal.freelancerId,
    type: 'proposal_rejected',
    title: 'Proposal Update',
    message: `Your proposal for "${proposal.projectId.title}" was not selected`,
    link: `/freelancer/proposals`,
  });

  res.json({ success: true, message: 'Proposal rejected', proposal });
});
