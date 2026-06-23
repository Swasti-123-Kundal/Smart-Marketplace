import { body } from 'express-validator';

export const projectValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value >= 100)
    .withMessage('Budget must be at least ₹100'),
  body('deadline')
    .notEmpty()
    .withMessage('Deadline is required')
    .isISO8601()
    .withMessage('Please enter a valid date'),
  body('skillsRequired')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('skillsRequired.*')
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
];
