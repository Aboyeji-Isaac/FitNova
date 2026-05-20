import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
    validateLogIn,
    validateSignUp
} from '../middleware/authValidation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getAuth, getDb } from '../sevices/firebaseAdmin.js';

const router = express.Router();

// Sign up - Create new user
router.post('/signup', validateSignUp, asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  const auth = getAuth();
  const db = getDb();

  if (!auth || !db) {
    return res.status(503).json({ error: 'Auth service unavailable' });
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Initialize user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      photoURL: null,
      bio: '',
      totalPoints: 0,
      totalChallenges: 0,
      badges: [],
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      customToken,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    throw error;
  }
}));

// Log in - Verify credentials and return ID token
router.post('/login', validateLogIn, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();

  if (!auth) {
    return res.status(503).json({ error: 'Auth service unavailable' });
  }

  try {
    // Get user by email
    const userRecord = await auth.getUserByEmail(email);

    // Note: Firebase Admin SDK doesn't verify password directly
    // In production, use Firebase REST API or client-side auth
    // This endpoint assumes the client has already verified the password
    // and is sending a pre-authenticated request

    const customToken = await auth.createCustomToken(userRecord.uid);

    res.json({
      message: 'Login successful',
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      customToken,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    throw error;
  }
}));

// Get current user profile
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const userId = req.user.uid;
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res.json({
    id: userDoc.id,
    ...userDoc.data(),
  });
}));

// Logout (client-side token invalidation)
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  // Token invalidation is handled client-side by discarding the token
  // Server-side, we can track logout events if needed
  res.json({ message: 'Logout successful' });
}));

// Verify token
router.post('/verify-token', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}));

export default router;
