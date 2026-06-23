import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private (Client)
 */
export const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', errors.array().map((e) => e.msg));
  }

  const project = await Project.create({
    ...req.body,
    clientId: req.user._id,
  });

  res.status(201).json({ success: true, project });
});

/**
 * @desc    Get all projects (browse with filters)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req, res) => {
  const { search, skills, minBudget, maxBudget, status, page = 1, limit = 12 } = req.query;
  const query = {};

  // Text search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Skills filter
  if (skills) {
    const skillArr = skills.split(',').map((s) => s.trim());
    query.skillsRequired = { $in: skillArr };
  }

  // Budget range
  if (minBudget || maxBudget) {
    query.budget = {};
    if (minBudget) query.budget.$gte = parseInt(minBudget);
    if (maxBudget) query.budget.$lte = parseInt(maxBudget);
  }

  // Status filter
  if (status) {
    query.status = status;
  } else {
    // By default show only open projects for browsing
    query.status = 'open';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate('clientId', 'name profileImage')
    .populate('proposalCount')
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
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('clientId', 'name profileImage email')
    .populate('proposalCount');

  if (!project) throw ApiError.notFound('Project not found');

  res.json({ success: true, project });
});

/**
 * @desc    Get client's own projects
 * @route   GET /api/projects/my
 * @access  Private (Client)
 */
export const getMyProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { clientId: req.user._id };

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate('proposalCount')
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
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Client - owner)
 */
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized to update this project');
  }

  const allowedUpdates = ['title', 'description', 'budget', 'deadline', 'skillsRequired', 'status'];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, project });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Client - owner)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');

  if (project.clientId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized to delete this project');
  }

  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Project deleted successfully' });
});
