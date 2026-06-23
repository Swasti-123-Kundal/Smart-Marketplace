import User from '../models/User.js';
import SkillVerification from '../models/SkillVerification.js';
import Reputation from '../models/Reputation.js';
import Availability from '../models/Availability.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

/**
 * @desc    Get own profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, user });
});

/**
 * @desc    Update own profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'bio', 'skills', 'portfolio'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound('User not found');

  res.json({ success: true, user });
});

/**
 * @desc    Upload profile avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload an image');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'worksphere/avatars');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: result.url },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    user,
  });
});

/**
 * @desc    Browse freelancers
 * @route   GET /api/users/freelancers
 * @access  Public
 */
export const getFreelancers = asyncHandler(async (req, res) => {
  const { search, skills, verifiedSkill, availabilityFilter, page = 1, limit = 12 } = req.query;
  const query = { role: 'freelancer', isBanned: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } },
    ];
  }

  if (skills) {
    const skillArr = skills.split(',').map((s) => s.trim());
    query.skills = { $in: skillArr };
  }

  if (verifiedSkill) {
    const verifiedUsers = await SkillVerification.find({
      skill: verifiedSkill,
      verified: true,
    }).select('userId');
    const userIds = verifiedUsers.map((v) => v.userId);
    query._id = { $in: userIds };
  }

  if (availabilityFilter === 'today') {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const avs = await Availability.find({ date: today, status: 'Available' }).select('userId');
    const ids = avs.map((a) => a.userId);
    if (query._id) {
      const existingIn = query._id.$in || [];
      query._id = { $in: existingIn.filter(id => ids.some(i => i.toString() === id.toString())) };
    } else {
      query._id = { $in: ids };
    }
  } else if (availabilityFilter === 'week') {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    end.setUTCHours(23, 59, 59, 999);
    const avs = await Availability.find({
      date: { $gte: start, $lte: end },
      status: 'Available'
    }).select('userId');
    const ids = avs.map((a) => a.userId);
    if (query._id) {
      const existingIn = query._id.$in || [];
      query._id = { $in: existingIn.filter(id => ids.some(i => i.toString() === id.toString())) };
    } else {
      query._id = { $in: ids };
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);
  const freelancersList = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  // Fetch verified skills for all retrieved freelancers
  const freelancerIds = freelancersList.map((f) => f._id);
  const verifications = await SkillVerification.find({
    userId: { $in: freelancerIds },
    verified: true,
  });

  const reputations = await Reputation.find({
    userId: { $in: freelancerIds },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayAvailabilities = await Availability.find({
    userId: { $in: freelancerIds },
    date: today,
  });

  const freelancers = freelancersList.map((f) => {
    const fObj = f.toObject();
    fObj.verifiedSkills = verifications
      .filter((v) => v.userId.toString() === f._id.toString())
      .map((v) => v.skill);

    const rep = reputations.find((r) => r.userId.toString() === f._id.toString());
    fObj.reputation = rep
      ? { score: rep.reputationScore, level: rep.level }
      : { score: 50, level: 'Beginner' };

    const todayAvail = todayAvailabilities.find((a) => a.userId.toString() === f._id.toString());
    fObj.todayAvailability = todayAvail 
      ? { status: todayAvail.status, slots: todayAvail.timeSlots } 
      : { status: 'Available', slots: [] };

    return fObj;
  });

  res.json({
    success: true,
    freelancers,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get freelancer by ID
 * @route   GET /api/users/freelancers/:id
 * @access  Public
 */
export const getFreelancerById = asyncHandler(async (req, res) => {
  const freelancer = await User.findOne({
    _id: req.params.id,
    role: 'freelancer',
    isBanned: false,
  });

  if (!freelancer) throw ApiError.notFound('Freelancer not found');

  res.json({ success: true, freelancer });
});
