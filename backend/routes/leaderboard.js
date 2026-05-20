import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  validateLeaderboardQuery,
  validateChallengeId,
  validateUserId,
} from '../middleware/validation.js';
import { getDb } from '../sevices/firebaseAdmin.js';

const router = express.Router();

// Get challenge leaderboard
router.get('/:challengeId', validateChallengeId, validateLeaderboardQuery, optionalAuth, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId } = req.params;
  const limit = parseInt(req.query.limit) || 50;

  const snapshot = await db
    .collection('challenges')
    .doc(challengeId)
    .collection('leaderboard')
    .orderBy('points', 'desc')
    .limit(limit)
    .get();

  const leaderboard = snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  }));

  res.json({
    challengeId,
    leaderboard,
    total: leaderboard.length,
  });
}));

// Get global leaderboard (top users across all challenges)
router.get('/', validateLeaderboardQuery, optionalAuth, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const limit = parseInt(req.query.limit) || 100;

  const snapshot = await db
    .collection('users')
    .orderBy('totalPoints', 'desc')
    .limit(limit)
    .get();

  const leaderboard = snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    userId: doc.id,
    ...doc.data(),
  }));

  res.json({
    type: 'global',
    leaderboard,
    total: leaderboard.length,
  });
}));

// Get user's rank in challenge
router.get('/:challengeId/user/:userId', validateChallengeId, validateUserId, optionalAuth, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { challengeId, userId } = req.params;

  const snapshot = await db
    .collection('challenges')
    .doc(challengeId)
    .collection('leaderboard')
    .orderBy('points', 'desc')
    .get();

  const leaderboard = snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  }));

  const userRank = leaderboard.find((item) => item.userId === userId);

  if (!userRank) {
    return res.status(404).json({ error: 'User not found in leaderboard' });
  }

  res.json(userRank);
}));

export default router;
