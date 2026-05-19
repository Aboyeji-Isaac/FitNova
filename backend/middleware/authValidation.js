import { body, validationResult } from 'express-validator';

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

export const validateSignUp = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and numbers'),
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Display name must be between 2 and 100 characters'),
  handleValidationErrors,
];

export const validateLogIn = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateRefreshToken = [
  body('refreshToken')
    .trim()
    .notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors,
];
