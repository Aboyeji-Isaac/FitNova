import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getDb } from '../sevices/firebaseAdmin.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
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

const validateProfileSetup = [
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Display name must be between 2 and 100 characters'),
  body('photoURL')
    .optional()
    .trim()
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

// Complete profile setup (first-time only)
router.post('/setup', authMiddleware, validateProfileSetup, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const { displayName, photoURL, bio, preferences } = req.body;

  // Check if user already completed setup
  const userDoc = await db.collection('users').doc(userId).get();
  if (userDoc.exists && userDoc.data().setupCompleted) {
    return res.status(409).json({ error: 'Profile already setup' });
  }

  const updates = {
    displayName,
    photoURL: photoURL || null,
    bio: bio || '',
    preferences: preferences || {},
    setupCompleted: true,
    updatedAt: new Date(),
  };

  await db.collection('users').doc(userId).set(updates, { merge: true });

  const updated = await db.collection('users').doc(userId).get();

  res.status(201).json({
    message: 'Profile setup completed',
    id: updated.id,
    ...updated.data(),
  });
}));

// Check onboarding status
router.get('/status', authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userData = userDoc.data();
  res.json({
    userId,
    setupCompleted: userData.setupCompleted || false,
    profileComplete: !!(userData.displayName && userData.email),
    joinedChallenges: userData.totalChallenges || 0,
    totalPoints: userData.totalPoints || 0,
  });
}));

export default router;
