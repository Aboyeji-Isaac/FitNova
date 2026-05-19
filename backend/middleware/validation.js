import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Challenges validation
export const validateCreateChallenge = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('rules')
    .optional()
    .isArray().withMessage('Rules must be an array'),
  body('rewards')
    .optional()
    .isObject().withMessage('Rewards must be an object'),
  handleValidationErrors,
];

export const validateUpdateChallenge = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  body('status')
    .optional()
    .isIn(['active', 'closed', 'archived']).withMessage('Status must be active, closed, or archived'),
  handleValidationErrors,
];

export const validateChallengeId = [
  param('challengeId')
    .trim()
    .notEmpty().withMessage('Challenge ID is required'),
  handleValidationErrors,
];

// Users validation
export const validateUpdateProfile = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Display name must be between 2 and 100 characters'),
  body('photoURL')
    .optional()
    .isURL().withMessage('Photo URL must be a valid URL'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object'),
  handleValidationErrors,
];

export const validateUserId = [
  param('userId')
    .trim()
    .notEmpty().withMessage('User ID is required'),
  handleValidationErrors,
];

// Progress validation
export const validateSubmitProgress = [
  body('challengeId')
    .trim()
    .notEmpty().withMessage('Challenge ID is required'),
  body('value')
    .notEmpty().withMessage('Progress value is required')
    .isFloat({ min: 0 }).withMessage('Progress value must be a positive number'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
  handleValidationErrors,
];

// Leaderboard validation
export const validateLeaderboardQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  handleValidationErrors,
];

// Generic validators
export const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Offset must be a non-negative number'),
  handleValidationErrors,
];
