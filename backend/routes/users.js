import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  validateUpdateProfile,
  validateUserId,
} from '../middleware/validation.js';
import { getDb } from '../services/firebaseAdmin.js';

const router = express.Router();

// Get user profile
router.get('/profile/:userId', validateUserId, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { userId } = req.params;

  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's challenges
  const challengesSnap = await db
    .collection('users')
    .doc(userId)
    .collection('joinedChallenges')
    .get();

  const challenges = challengesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({
    id: userDoc.id,
    ...userDoc.data(),
    challenges,
  });
}));

// Update user profile
router.put('/profile', validateUpdateProfile, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const { displayName, photoURL, bio, preferences } = req.body;

  const updates = {
    displayName: displayName || req.user.name,
    photoURL,
    bio,
    preferences,
    updatedAt: new Date(),
  };

  // Remove undefined fields
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  await db.collection('users').doc(userId).set(updates, { merge: true });

  const updated = await db.collection('users').doc(userId).get();

  res.json({
    id: updated.id,
    ...updated.data(),
  });
}));

// Get user's active challenges
router.get('/challenges/active', authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('joinedChallenges')
    .where('status', '==', 'active')
    .get();

  const challenges = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ challenges, total: challenges.length });
}));

// Get user stats
router.get('/stats/:userId', validateUserId, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { userId } = req.params;

  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: 'User not found' });
  }

  const progressSnap = await db
    .collection('users')
    .doc(userId)
    .collection('progress')
    .get();

  const challengesSnap = await db
    .collection('users')
    .doc(userId)
    .collection('joinedChallenges')
    .get();

  res.json({
    userId,
    totalChallenges: challengesSnap.size,
    totalProgress: progressSnap.size,
    totalPoints: userDoc.data()?.totalPoints || 0,
    badges: userDoc.data()?.badges || [],
  });
}));

export default router;
