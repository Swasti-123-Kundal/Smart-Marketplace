import Milestone from '../models/Milestone.js';
import Contract from '../models/Contract.js';
import Payment from '../models/Payment.js';
import ProjectActivity from '../models/ProjectActivity.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Create milestone for a contract
 * @route   POST /api/milestones/contract/:contractId
 * @access  Private (Client-only)
 */
export const createMilestone = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { title, description, amount } = req.body;

  if (req.user.role !== 'client') {
    throw ApiError.forbidden('Only clients can create milestones');
  }

  const contract = await Contract.findById(contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Contract not found');
  }

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You do not own this contract');
  }

  // Calculate sum of existing milestones
  const existingMilestones = await Milestone.find({ contractId });
  const totalExisting = existingMilestones.reduce((sum, m) => sum + m.amount, 0);

  if (totalExisting + parseFloat(amount) > contract.budget) {
    throw ApiError.badRequest(
      `Milestone allocation exceeds total budget. Remaining budget allocation: ₹${contract.budget - totalExisting}`
    );
  }

  const milestone = await Milestone.create({
    contractId,
    title,
    description,
    amount,
    status: 'pending',
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.freelancerId,
    type: 'contract_updated',
    title: 'New Milestone Created',
    message: `A new milestone of ₹${amount} has been added to "${contract.projectId.title}"`,
    link: `/freelancer/contracts/${contractId}`,
  });

  res.status(201).json({
    success: true,
    milestone,
  });
});

/**
 * @desc    Get milestones for a contract
 * @route   GET /api/milestones/contract/:contractId
 * @access  Private
 */
export const getContractMilestones = asyncHandler(async (req, res) => {
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
    throw ApiError.forbidden('Not authorized to view milestones for this contract');
  }

  const milestones = await Milestone.find({ contractId }).sort({ createdAt: 1 });

  res.json({
    success: true,
    milestones,
  });
});

/**
 * @desc    Submit milestone work
 * @route   POST /api/milestones/:id/submit
 * @access  Private (Freelancer-only)
 */
export const submitMilestone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { submissionText, submissionLink } = req.body;

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    throw ApiError.notFound('Milestone not found');
  }

  const contract = await Contract.findById(milestone.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Associated contract not found');
  }

  if (contract.freelancerId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the assigned freelancer can submit work');
  }

  if (milestone.status !== 'pending') {
    throw ApiError.badRequest(`Cannot submit milestone in "${milestone.status}" status`);
  }

  milestone.status = 'submitted';
  milestone.submissionText = submissionText || '';
  milestone.submissionLink = submissionLink || '';
  milestone.submittedAt = new Date();
  await milestone.save();

  // Log timeline activity
  await ProjectActivity.create({
    projectId: contract.projectId._id,
    userId: req.user._id,
    activityType: 'milestone_submitted',
    message: `Freelancer submitted work for milestone: "${milestone.title}"`,
  });

  // Notify client
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.clientId,
    type: 'contract_updated',
    title: 'Milestone Deliverable Submitted',
    message: `Freelancer submitted work for milestone "${milestone.title}" under project "${contract.projectId.title}"`,
    link: `/client/contracts/${contract._id}`,
  });

  res.json({
    success: true,
    milestone,
  });
});

/**
 * @desc    Approve milestone
 * @route   POST /api/milestones/:id/approve
 * @access  Private (Client-only)
 */
export const approveMilestone = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    throw ApiError.notFound('Milestone not found');
  }

  const contract = await Contract.findById(milestone.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Associated contract not found');
  }

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the contract client can approve milestones');
  }

  if (milestone.status !== 'submitted') {
    throw ApiError.badRequest('Only submitted milestones can be approved');
  }

  milestone.status = 'approved';
  milestone.actionedAt = new Date();
  await milestone.save();

  // Log timeline activity
  await ProjectActivity.create({
    projectId: contract.projectId._id,
    userId: req.user._id,
    activityType: 'milestone_approved',
    message: `Client approved milestone deliverables: "${milestone.title}"`,
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.freelancerId,
    type: 'contract_updated',
    title: 'Milestone Approved',
    message: `Milestone "${milestone.title}" has been approved. Payment will be released soon.`,
    link: `/freelancer/contracts/${contract._id}`,
  });

  res.json({
    success: true,
    milestone,
  });
});

/**
 * @desc    Reject milestone
 * @route   POST /api/milestones/:id/reject
 * @access  Private (Client-only)
 */
export const rejectMilestone = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    throw ApiError.notFound('Milestone not found');
  }

  const contract = await Contract.findById(milestone.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Associated contract not found');
  }

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the contract client can reject milestones');
  }

  if (milestone.status !== 'submitted') {
    throw ApiError.badRequest('Only submitted milestones can be rejected');
  }

  milestone.status = 'pending';
  milestone.actionedAt = new Date();
  // Append feedback into submissionText to let the freelancer know what to fix
  milestone.submissionText = `REJECTED FEEDBACK: ${feedback}\n\nPrevious submission: ${milestone.submissionText}`;
  await milestone.save();

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.freelancerId,
    type: 'contract_updated',
    title: 'Milestone Revision Requested',
    message: `Milestone "${milestone.title}" requires revisions. Feedback: "${feedback}"`,
    link: `/freelancer/contracts/${contract._id}`,
  });

  res.json({
    success: true,
    milestone,
  });
});

/**
 * @desc    Pay milestone
 * @route   POST /api/milestones/:id/pay
 * @access  Private (Client-only)
 */
export const payMilestone = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const milestone = await Milestone.findById(id);
  if (!milestone) {
    throw ApiError.notFound('Milestone not found');
  }

  const contract = await Contract.findById(milestone.contractId).populate('projectId', 'title');
  if (!contract) {
    throw ApiError.notFound('Associated contract not found');
  }

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the contract client can trigger payments');
  }

  if (milestone.status !== 'approved') {
    throw ApiError.badRequest('Only approved milestones can be paid');
  }

  milestone.status = 'paid';
  await milestone.save();

  // Log timeline activity
  await ProjectActivity.create({
    projectId: contract.projectId._id,
    userId: req.user._id,
    activityType: 'payment_released',
    message: `Payment of ₹${milestone.amount} released for milestone: "${milestone.title}"`,
  });

  // Create payment record
  await Payment.create({
    clientId: contract.clientId,
    freelancerId: contract.freelancerId,
    contractId: contract._id,
    amount: milestone.amount,
    status: 'paid',
    razorpayOrderId: 'milestone_' + milestone._id,
    razorpayPaymentId: 'mock_pay_' + Math.random().toString(36).substring(2, 11),
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.freelancerId,
    type: 'contract_updated',
    title: 'Milestone Payment Released 💸',
    message: `Payment of ₹${milestone.amount} for "${milestone.title}" has been released!`,
    link: `/freelancer/contracts/${contract._id}`,
  });

  res.json({
    success: true,
    milestone,
  });
});
