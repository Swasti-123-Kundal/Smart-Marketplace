import Availability from '../models/Availability.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Set or update availability for a date
 * @route   POST /api/availability
 * @access  Private (Freelancer)
 */
export const setAvailability = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw ApiError.forbidden('Only freelancers can set availability');
  }

  const { date, status, timeSlots } = req.body;
  if (!date || !status) {
    throw ApiError.badRequest('Date and status are required');
  }

  const parsedDate = new Date(date);
  // Clear time parts to maintain start-of-day uniqueness
  parsedDate.setUTCHours(0, 0, 0, 0);

  // Find or update availability
  const availability = await Availability.findOneAndUpdate(
    { userId: req.user._id, date: parsedDate },
    {
      userId: req.user._id,
      date: parsedDate,
      status,
      timeSlots: timeSlots || [],
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    availability,
  });
});

/**
 * @desc    Get current freelancer's own availability
 * @route   GET /api/availability/my
 * @access  Private (Freelancer)
 */
export const getMyAvailability = asyncHandler(async (req, res) => {
  if (req.user.role !== 'freelancer') {
    throw ApiError.forbidden('Only freelancers have availability profiles');
  }

  const availability = await Availability.find({ userId: req.user._id }).sort({ date: 1 });
  res.json({
    success: true,
    availability,
  });
});

/**
 * @desc    Get any user's availability schedule (e.g. for Client profiles preview)
 * @route   GET /api/availability/user/:userId
 * @access  Private
 */
export const getUserAvailability = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const availability = await Availability.find({ userId }).sort({ date: 1 });
  res.json({
    success: true,
    availability,
  });
});
