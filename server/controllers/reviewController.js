import Review from '../models/Review.js';
import Contract from '../models/Contract.js';
import Reputation from '../models/Reputation.js';
import { calculateReputationScore } from './reputationController.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private (Client)
 */
export const createReview = asyncHandler(async (req, res) => {
  const { contractId, rating, comment } = req.body;

  // Validate contract
  const contract = await Contract.findById(contractId).populate('projectId', 'title');
  if (!contract) throw ApiError.notFound('Contract not found');

  if (contract.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the client can leave a review');
  }

  if (contract.status !== 'completed') {
    throw ApiError.badRequest('Can only review completed contracts');
  }

  // Check for existing review
  const existingReview = await Review.findOne({ contractId });
  if (existingReview) throw ApiError.conflict('Review already exists for this contract');

  const review = await Review.create({
    clientId: req.user._id,
    freelancerId: contract.freelancerId,
    contractId,
    rating,
    comment,
  });

  // Notify freelancer
  const io = req.app.get('io');
  await createNotification(io, {
    userId: contract.freelancerId,
    type: 'new_review',
    title: 'New Review Received',
    message: `You received a ${rating}⭐ review for "${contract.projectId.title}"`,
    link: `/freelancer/profile`,
  });

  // Auto-update reputation metrics
  try {
    const freelancerReviews = await Review.find({ freelancerId: contract.freelancerId });
    const totalRatingSum = freelancerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = freelancerReviews.length > 0 ? totalRatingSum / freelancerReviews.length : 5.0;

    let rep = await Reputation.findOne({ userId: contract.freelancerId });
    if (!rep) {
      rep = new Reputation({ userId: contract.freelancerId });
    }

    rep.rating = parseFloat(avgRating.toFixed(1));
    await rep.save();

    // Recalculate score
    await calculateReputationScore(contract.freelancerId);
  } catch (repErr) {
    console.error('Failed to auto-update reputation on review submission:', repErr);
  }

  await review.populate('clientId', 'name profileImage');

  res.status(201).json({ success: true, review });
});

/**
 * @desc    Get reviews for a freelancer
 * @route   GET /api/reviews/freelancer/:id
 * @access  Public
 */
export const getFreelancerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ freelancerId: req.params.id })
    .populate('clientId', 'name profileImage')
    .populate('contractId', 'projectId')
    .sort({ createdAt: -1 });

  // Calculate average rating
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  res.json({
    success: true,
    reviews,
    averageRating: parseFloat(averageRating),
    totalReviews: reviews.length,
  });
});
