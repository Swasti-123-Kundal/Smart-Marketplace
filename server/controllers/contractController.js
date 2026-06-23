import Contract from '../models/Contract.js';
import Project from '../models/Project.js';
import Reputation from '../models/Reputation.js';
import { calculateReputationScore } from './reputationController.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Get user's contracts
 * @route   GET /api/contracts
 * @access  Private
 */
export const getContracts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};

  // Show contracts based on user role
  if (req.user.role === 'client') {
    query.clientId = req.user._id;
  } else {
    query.freelancerId = req.user._id;
  }

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Contract.countDocuments(query);

  const contracts = await Contract.find(query)
    .populate('projectId', 'title description')
    .populate('clientId', 'name profileImage')
    .populate('freelancerId', 'name profileImage')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    contracts,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single contract
 * @route   GET /api/contracts/:id
 * @access  Private (contract parties)
 */
export const getContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id)
    .populate('projectId', 'title description budget deadline skillsRequired')
    .populate('clientId', 'name profileImage email')
    .populate('freelancerId', 'name profileImage email skills');

  if (!contract) throw ApiError.notFound('Contract not found');

  // Only contract parties can view
  const userId = req.user._id.toString();
  if (
    contract.clientId._id.toString() !== userId &&
    contract.freelancerId._id.toString() !== userId &&
    req.user.role !== 'admin'
  ) {
    throw ApiError.forbidden('Not authorized');
  }

  res.json({ success: true, contract });
});

/**
 * @desc    Update contract status
 * @route   PUT /api/contracts/:id/status
 * @access  Private
 */
export const updateContractStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contract = await Contract.findById(req.params.id).populate('projectId', 'title');
  if (!contract) throw ApiError.notFound('Contract not found');

  const userId = req.user._id.toString();
  const isClient = contract.clientId.toString() === userId;
  const isFreelancer = contract.freelancerId.toString() === userId;

  if (!isClient && !isFreelancer) {
    throw ApiError.forbidden('Not authorized');
  }

  // Status transition rules
  const validTransitions = {
    pending: ['in_progress'],
    in_progress: ['submitted'],
    submitted: ['completed', 'in_progress'],
    completed: [],
  };

  if (!validTransitions[contract.status]?.includes(status)) {
    throw ApiError.badRequest(
      `Cannot transition from "${contract.status}" to "${status}"`
    );
  }

  // Freelancer can start and submit
  if (status === 'in_progress' && isFreelancer) {
    contract.startedAt = new Date();
  }

  // Freelancer submits work
  if (status === 'submitted' && isFreelancer) {
    // Notify client
    const io = req.app.get('io');
    await createNotification(io, {
      userId: contract.clientId,
      type: 'contract_updated',
      title: 'Work Submitted',
      message: `Freelancer has submitted work for "${contract.projectId.title}"`,
      link: `/client/contracts`,
    });
  }

  // Client marks as completed
  if (status === 'completed' && isClient) {
    contract.completedAt = new Date();
    // Also update project status
    await Project.findByIdAndUpdate(contract.projectId._id, { status: 'completed' });

    const io = req.app.get('io');
    await createNotification(io, {
      userId: contract.freelancerId,
      type: 'contract_updated',
      title: 'Contract Completed! 🎉',
      message: `Contract for "${contract.projectId.title}" has been marked as completed`,
      link: `/freelancer/contracts`,
    });

    // Auto-update reputation metrics
    try {
      // Find all completed contracts for this freelancer (including this one, but since we haven't saved contract yet, we can do it after save or fetch manually)
      // Let's save contract first to make sure it's included in DB query
      await contract.save();
      
      const completedContracts = await Contract.find({
        freelancerId: contract.freelancerId,
        status: 'completed',
      });

      const totalCompleted = completedContracts.length;
      const onTimeCount = completedContracts.filter(
        (c) => c.completedAt && c.completedAt <= c.deadline
      ).length;
      const onTimePercent = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 100;

      let rep = await Reputation.findOne({ userId: contract.freelancerId });
      if (!rep) {
        rep = new Reputation({ userId: contract.freelancerId });
      }

      rep.projectsCompleted = totalCompleted;
      rep.onTimeDeliveryPercent = onTimePercent;
      await rep.save();

      // Recalculate score
      await calculateReputationScore(contract.freelancerId);
    } catch (repErr) {
      console.error('Failed to auto-update reputation on contract completion:', repErr);
    }
  }

  contract.status = status;
  await contract.save();

  res.json({ success: true, contract });
});
