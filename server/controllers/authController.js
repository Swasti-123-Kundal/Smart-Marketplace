import { validationResult } from 'express-validator';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', errors.array().map((e) => e.msg));
  }

  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'client',
  });

  // Generate token & set cookie
  generateToken(res, user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      skills: user.skills,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', errors.array().map((e) => e.msg));
  }

  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if banned
  if (user.isBanned) {
    throw ApiError.forbidden('Your account has been suspended');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate token & set cookie
  generateToken(res, user._id, user.role);

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      skills: user.skills,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Logout user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json({
    success: true,
    user,
  });
});
