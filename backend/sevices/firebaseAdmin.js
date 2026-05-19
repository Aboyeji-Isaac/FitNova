import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

let db = null;

export const initializeFirebase = () => {
  if (db) {
    console.log('Firebase Admin SDK already initialized');
    return;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      console.warn('⚠️  Firebase credentials incomplete. Check your .env file.');
      console.warn('Missing:', {
        projectId: !projectId ? 'FIREBASE_PROJECT_ID' : '✓',
        privateKey: !privateKey ? 'FIREBASE_PRIVATE_KEY' : '✓',
        clientEmail: !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : '✓',
      });
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin SDK initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  }
};

export const getDb = () => {
  if (!db) {
    console.error('Firebase Admin SDK not initialized');
  }
  return db;
};

export const verifyToken = async (token) => {
  if (!db) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
};

export const getAuth = () => {
  return admin.auth();
};
