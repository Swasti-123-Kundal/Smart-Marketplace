import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect routes — verify JWT from HTTP-only cookie.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  // Also check Authorization header as fallback
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authenticated. Please login.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    if (user.isBanned) {
      // Clear cookie
      res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
      throw ApiError.forbidden('Your account has been suspended');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized('Invalid token');
  }
});
