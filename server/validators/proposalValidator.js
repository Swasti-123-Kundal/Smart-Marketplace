import { body } from 'express-validator';

export const proposalValidator = [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('coverLetter')
    .trim()
    .notEmpty()
    .withMessage('Cover letter is required')
    .isLength({ max: 1000 })
    .withMessage('Cover letter cannot exceed 1000 characters'),
  body('expectedBudget')
    .notEmpty()
    .withMessage('Expected budget is required')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value >= 100)
    .withMessage('Budget must be at least ₹100'),
];
