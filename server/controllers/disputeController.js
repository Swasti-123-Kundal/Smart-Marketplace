import Dispute from '../models/Dispute.js';
import Contract from '../models/Contract.js';
import Reputation from '../models/Reputation.js';
import { calculateReputationScore } from './reputationController.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Raise a dispute on a contract
 * @route   POST /api/disputes
 * @access  Private
 */
export const raiseDispute = asyncHandler(async (req, res) => {
  const { contractId, reason, description, proofs } = req.body;

  const contract = await Contract.findById(contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Contract not found');
  }

  const userId = req.user._id.toString();
  if (contract.clientId.toString() !== userId && contract.freelancerId.toString() !== userId) {
    throw ApiError.forbidden('You are not a party to this contract');
  }

  // Check if dispute already exists
  const existingDispute = await Dispute.findOne({ contractId });
  if (existingDispute) {
    throw ApiError.badRequest('A dispute has already been raised for this contract');
  }

  const dispute = await Dispute.create({
    contractId,
    raisedBy: req.user._id,
    reason,
    description,
    proofs: proofs || [],
  });

  // Notify counterparty
  const counterpartyId = contract.clientId.toString() === userId ? contract.freelancerId : contract.clientId;
  const io = req.app.get('io');
  await createNotification(io, {
    userId: counterpartyId,
    type: 'contract_updated',
    title: 'Dispute Raised ⚠️',
    message: `A dispute has been raised on "${contract.projectId.title}" for: ${reason}`,
    link: `/client/contracts/${contractId}`,
  });

  res.status(201).json({
    success: true,
    dispute,
  });
});

/**
 * @desc    Get dispute details for a contract
 * @route   GET /api/disputes/contract/:contractId
 * @access  Private
 */
export const getDisputeByContract = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const contract = await Contract.findById(contractId);

  if (!contract) {
    throw ApiError.notFound('Contract not found');
  }

  const userId = req.user._id.toString();
  if (
    contract.clientId.toString() !== userId &&
    contract.freelancerId.toString() !== userId &&
    req.user.role !== 'admin'
  ) {
    throw ApiError.forbidden('Not authorized to view dispute');
  }

  const dispute = await Dispute.findOne({ contractId })
    .populate('raisedBy', 'name profileImage email');

  res.json({
    success: true,
    dispute,
  });
});

/**
 * @desc    Submit reply/proofs for dispute
 * @route   POST /api/disputes/:id/reply
 * @access  Private
 */
export const replyToDispute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { replyText, replyProofs } = req.body;

  const dispute = await Dispute.findById(id);
  if (!dispute) {
    throw ApiError.notFound('Dispute not found');
  }

  const contract = await Contract.findById(dispute.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Contract associated with dispute not found');
  }

  const userId = req.user._id.toString();
  if (contract.clientId.toString() !== userId && contract.freelancerId.toString() !== userId) {
    throw ApiError.forbidden('Not authorized to reply to this dispute');
  }

  if (dispute.raisedBy.toString() === userId) {
    throw ApiError.badRequest('Only the counterparty can reply to this dispute');
  }

  dispute.replyText = replyText;
  dispute.replyProofs = replyProofs || [];
  if (dispute.status === 'Open') {
    dispute.status = 'Under Review';
  }
  await dispute.save();

  // Notify the person who raised the dispute
  const io = req.app.get('io');
  await createNotification(io, {
    userId: dispute.raisedBy,
    type: 'contract_updated',
    title: 'Dispute Replied',
    message: `A reply has been posted to the dispute on project "${contract.projectId.title}"`,
    link: `/client/contracts/${contract._id}`,
  });

  res.json({
    success: true,
    dispute,
  });
});

/**
 * @desc    Get all disputes
 * @route   GET /api/disputes/admin
 * @access  Private (Admin-only)
 */
export const getAllDisputes = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin privileges required');
  }

  const disputes = await Dispute.find()
    .populate({
      path: 'contractId',
      populate: [
        { path: 'clientId', select: 'name email profileImage' },
        { path: 'freelancerId', select: 'name email profileImage' },
        { path: 'projectId', select: 'title' },
      ],
    })
    .populate('raisedBy', 'name email profileImage')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    disputes,
  });
});

/**
 * @desc    Update dispute status
 * @route   PATCH /api/disputes/:id/status
 * @access  Private (Admin-only)
 */
export const updateDisputeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin privileges required');
  }

  const dispute = await Dispute.findById(id);
  if (!dispute) {
    throw ApiError.notFound('Dispute not found');
  }

  dispute.status = status;
  await dispute.save();

  res.json({
    success: true,
    dispute,
  });
});

/**
 * @desc    Resolve dispute with decision
 * @route   POST /api/disputes/:id/resolve
 * @access  Private (Admin-only)
 */
export const resolveDispute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision, adminRemarks } = req.body;

  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin privileges required');
  }

  const dispute = await Dispute.findById(id);
  if (!dispute) {
    throw ApiError.notFound('Dispute not found');
  }

  const contract = await Contract.findById(dispute.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Associated contract not found');
  }

  dispute.status = 'Resolved';
  dispute.decision = decision;
  dispute.adminRemarks = adminRemarks;
  dispute.resolvedAt = new Date();
  await dispute.save();

  // Handle decision logic
  if (decision === 'Refund Client') {
    contract.status = 'completed'; // Mark contract completed/closed
    await contract.save();

    // Increment freelancer's dispute count penalty
    try {
      let rep = await Reputation.findOne({ userId: contract.freelancerId });
      if (!rep) {
        rep = new Reputation({ userId: contract.freelancerId });
      }
      rep.disputesCount += 1;
      await rep.save();
      await calculateReputationScore(contract.freelancerId);
    } catch (repErr) {
      console.error('Failed to update freelancer dispute penalty:', repErr);
    }
  } else if (decision === 'Release Payment') {
    contract.status = 'completed';
    await contract.save();
  } else if (decision === 'Close Dispute') {
    // Just close/resolve without overriding contract status
  }

  // Notify both parties
  const io = req.app.get('io');
  const notifyParties = [contract.clientId, contract.freelancerId];

  for (const partyId of notifyParties) {
    await createNotification(io, {
      userId: partyId,
      type: 'contract_updated',
      title: 'Dispute Resolved ⚖️',
      message: `The dispute on "${contract.projectId.title}" has been resolved: "${decision}"`,
      link: `/client/contracts/${contract._id}`,
    });
  }

  res.json({
    success: true,
    dispute,
  });
});
