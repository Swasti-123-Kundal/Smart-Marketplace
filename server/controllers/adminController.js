import User from '../models/User.js';
import Project from '../models/Project.js';
import Contract from '../models/Contract.js';
import Payment from '../models/Payment.js';
import Proposal from '../models/Proposal.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get platform statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalClients,
    totalFreelancers,
    totalProjects,
    openProjects,
    totalContracts,
    completedContracts,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ role: 'client' }),
    User.countDocuments({ role: 'freelancer' }),
    Project.countDocuments(),
    Project.countDocuments({ status: 'open' }),
    Contract.countDocuments(),
    Contract.countDocuments({ status: 'completed' }),
    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  // Monthly revenue for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Monthly new users
  const monthlyUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, role: { $ne: 'admin' } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalClients,
      totalFreelancers,
      totalProjects,
      openProjects,
      totalContracts,
      completedContracts,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue,
      monthlyUsers,
    },
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = { role: { $ne: 'admin' } };

  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    users,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Ban/Unban user
 * @route   PUT /api/admin/users/:id/ban
 * @access  Private (Admin)
 */
export const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.forbidden('Cannot ban admin');

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
    user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'admin') throw ApiError.forbidden('Cannot delete admin');

  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted successfully' });
});

/**
 * @desc    Get all projects (admin)
 * @route   GET /api/admin/projects
 * @access  Private (Admin)
 */
export const getAdminProjects = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate('clientId', 'name email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    projects,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Delete project (admin)
 * @route   DELETE /api/admin/projects/:id
 * @access  Private (Admin)
 */
export const deleteAdminProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Project removed successfully' });
});

/**
 * @desc    Get all contracts (admin)
 * @route   GET /api/admin/contracts
 * @access  Private (Admin)
 */
export const getAdminContracts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Contract.countDocuments(query);

  const contracts = await Contract.find(query)
    .populate('projectId', 'title')
    .populate('clientId', 'name email')
    .populate('freelancerId', 'name email')
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
 * @desc    Get all payments (admin)
 * @route   GET /api/admin/payments
 * @access  Private (Admin)
 */
export const getAdminPayments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Payment.countDocuments(query);

  const payments = await Payment.find(query)
    .populate('clientId', 'name email')
    .populate('freelancerId', 'name email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    payments,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});
