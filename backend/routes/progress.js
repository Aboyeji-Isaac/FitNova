import express from 'express';
import * as admin from 'firebase-admin';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  validateSubmitProgress,
  validateChallengeId,
} from '../middleware/validation.js';
import { getDb } from '../sevices/firebaseAdmin.js';

const router = express.Router();

// Submit progress
router.post('/', validateSubmitProgress, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const { challengeId, value, notes } = req.body;

  if (!challengeId || !value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create progress entry
  const progressEntry = {
    userId,
    challengeId,
    value,
    notes: notes || '',
    submittedAt: new Date(),
    verified: false,
  };

  const docRef = await db
    .collection('users')
    .doc(userId)
    .collection('progress')
    .add(progressEntry);

  // Update participant points (simplified: 10 points per submission)
  const points = 10;
  await db
    .collection('challenges')
    .doc(challengeId)
    .collection('participants')
    .doc(userId)
    .update({
      points: admin.firestore.FieldValue.increment(points),
      lastSubmittedAt: new Date(),
    });

  res.status(201).json({
    id: docRef.id,
    ...progressEntry,
    points,
  });
}));

// Get progress history
router.get('/:challengeId', validateChallengeId, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const { challengeId } = req.params;

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('progress')
    .where('challengeId', '==', challengeId)
    .orderBy('submittedAt', 'desc')
    .get();

  const progress = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ progress, total: progress.length });
}));

// Get today's progress
router.get('/daily/:challengeId', validateChallengeId, authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const { challengeId } = req.params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('progress')
    .where('challengeId', '==', challengeId)
    .where('submittedAt', '>=', today)
    .where('submittedAt', '<', tomorrow)
    .get();

  const progress = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({ progress, total: progress.length, date: today.toISOString() });
}));

export default router;
