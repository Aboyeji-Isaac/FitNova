import express from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  validateCreateChallenge,
  validateUpdateChallenge,
  validateChallengeId,
} from '../middleware/validation.js';
import { getDb } from '../services/firebaseAdmin.js';

const router = express.Router();

// Get all active challenges
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const snapshot = await db
    .collection('challenges')
    .where('status', '==', 'active')
    .orderBy('createdAt', 'desc')
    .get();

  const challenges = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ challenges, total: challenges.length });
}));

// Get challenge by ID
router.get('/:challengeId', validateChallengeId, optionalAuth, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;
  const challengeDoc = await db.collection('challenges').doc(challengeId).get();

  if (!challengeDoc.exists) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  // Get participant count
  const participantsSnap = await db
    .collection('challenges')
    .doc(challengeId)
    .collection('participants')
    .get();

  res.json({
    id: challengeDoc.id,
    ...challengeDoc.data(),
    participantCount: participantsSnap.size,
  });
}));

// Create a new challenge (admin only)
router.post('/', validateCreateChallenge, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  // TODO: Add admin role check
  const { title, description, startDate, endDate, rules, rewards } = req.body;

  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newChallenge = {
    title,
    description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    rules: rules || [],
    rewards: rewards || {},
    status: 'active',
    createdBy: req.user.uid,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await db.collection('challenges').add(newChallenge);

  res.status(201).json({
    id: docRef.id,
    ...newChallenge,
  });
}));

// Update challenge (admin only)
router.put('/:challengeId', validateChallengeId, validateUpdateChallenge, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;
  const updates = { ...req.body, updatedAt: new Date() };

  await db.collection('challenges').doc(challengeId).update(updates);

  const updated = await db.collection('challenges').doc(challengeId).get();

  res.json({
    id: updated.id,
    ...updated.data(),
  });
}));

// Delete challenge (admin only)
router.delete('/:challengeId', validateChallengeId, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;

  await db.collection('challenges').doc(challengeId).delete();

  res.json({ message: 'Challenge deleted successfully' });
}));

// Join challenge
router.post('/:challengeId/join', validateChallengeId, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;
  const userId = req.user.uid;

  // Add user to participants
  await db
    .collection('challenges')
    .doc(challengeId)
    .collection('participants')
    .doc(userId)
    .set({
      userId,
      joinedAt: new Date(),
      points: 0,
      status: 'active',
    });

  // Add challenge to user's joined challenges
  await db
    .collection('users')
    .doc(userId)
    .collection('joinedChallenges')
    .doc(challengeId)
    .set({
      challengeId,
      joinedAt: new Date(),
      status: 'active',
    });

  res.json({ message: 'Successfully joined challenge' });
}));

// Leave challenge
router.post('/:challengeId/leave', validateChallengeId, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;
  const userId = req.user.uid;

  await db
    .collection('challenges')
    .doc(challengeId)
    .collection('participants')
    .doc(userId)
    .delete();

  await db
    .collection('users')
    .doc(userId)
    .collection('joinedChallenges')
    .doc(challengeId)
    .delete();

  res.json({ message: 'Successfully left challenge' });
}));

export default router;
