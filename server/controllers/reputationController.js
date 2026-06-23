import Reputation from '../models/Reputation.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Helper: Calculate and save reputation score for a freelancer
 */
export const calculateReputationScore = async (userId) => {
  let rep = await Reputation.findOne({ userId });
  if (!rep) {
    rep = new Reputation({ userId });
  }

  // Projects completed: 2 pts each, max 20
  const projectsWeight = Math.min(rep.projectsCompleted * 2, 20);

  // Rating: rating * 10, max 50
  const ratingWeight = rep.rating * 10;

  // On time delivery: percent * 0.2, max 20
  const deliveryWeight = rep.onTimeDeliveryPercent * 0.2;

  // Average response time: max 10
  let responseWeight = 0;
  if (rep.avgResponseTime <= 2) responseWeight = 10;
  else if (rep.avgResponseTime <= 6) responseWeight = 7;
  else if (rep.avgResponseTime <= 12) responseWeight = 5;
  else if (rep.avgResponseTime <= 24) responseWeight = 3;

  // Penalty: disputes * 10
  const penalty = rep.disputesCount * 10;

  // Calculate sum
  let score = projectsWeight + ratingWeight + deliveryWeight + responseWeight - penalty;
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Level:
  let level = 'Beginner';
  if (score >= 90) level = 'Elite Freelancer';
  else if (score >= 75) level = 'Top Rated';
  else if (score >= 50) level = 'Intermediate';

  rep.reputationScore = score;
  rep.level = level;
  await rep.save();

  return rep;
};

/**
 * @desc    Get user reputation profile
 * @route   GET /api/reputation/:userId
 * @access  Public
 */
export const getFreelancerReputation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let reputation = await Reputation.findOne({ userId });
  if (!reputation) {
    // Lazy initialize default profile if not found
    reputation = await calculateReputationScore(userId);
  }

  res.json({
    success: true,
    reputation,
  });
});

/**
 * @desc    Trigger recalculation manually
 * @route   POST /api/reputation/recalculate/:userId
 * @access  Private (Admin/System)
 */
export const triggerRecalculate = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reputation = await calculateReputationScore(userId);

  res.json({
    success: true,
    reputation,
  });
});

/**
 * @desc    Get public top leaderboard list
 * @route   GET /api/reputation/leaderboard
 * @access  Public
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
  const { search, level, sort = 'score' } = req.query;

  // Find matching users if search name query exists
  let userQuery = { role: 'freelancer', isBanned: false };
  if (search) {
    userQuery.name = { $regex: search, $options: 'i' };
  }

  const users = await User.find(userQuery).select('_id');
  const userIds = users.map((u) => u._id);

  // Build reputation search query
  const repQuery = { userId: { $in: userIds } };
  if (level) {
    repQuery.level = level;
  }

  // Determine sort options
  let sortOption = { reputationScore: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'projects') sortOption = { projectsCompleted: -1 };

  const leaderboardList = await Reputation.find(repQuery)
    .populate('userId', 'name profileImage email bio skills')
    .sort(sortOption)
    .limit(100);

  // Filter out any entries that might not have user object (just in case)
  const leaderboard = leaderboardList.filter((item) => item.userId);

  res.json({
    success: true,
    leaderboard,
  });
});
