import { FIREBASE_ENABLED, db, auth } from './firebaseConfig';


let authService;

if (FIREBASE_ENABLED) {
  // Load Firebase stuff
  const {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } = await import('firebase/auth');
  const { doc, setDoc, getDoc } = await import('firebase/firestore');
  const axios = (await import('axios')).default;

  const API_URL = '/api/auth';

  const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  };

  const createUserProfile = async (user, additionalData) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { email } = user;
      const createdAt = new Date();
      await setDoc(userRef, {
        id: user.uid,
        email,
        createdAt,
        points: 0,
        role: 'user',
        ...additionalData,
      });
    }
    return getUserProfile(user.uid);
  };

  const register = async (userData) => {
    const { email, password, firstName, lastName } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile = await createUserProfile(user, {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
    });
    await axios.post(`${API_URL}/register`, { uid: user.uid, email, firstName, lastName });
    return { user: userProfile };
  };

  const login = async (credentials) => {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile = await getUserProfile(user.uid);
    await axios.post(`${API_URL}/login`, { uid: user.uid });
    return { user: userProfile };
  };

  const logout = async () => {
    await signOut(auth);
    await axios.post(`${API_URL}/logout`);
    return true;
  };

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          unsubscribe();
          if (user) {
            const userProfile = await getUserProfile(user.uid);
            resolve(userProfile);
          } else {
            resolve(null);
          }
        },
        reject
      );
    });
  };

  const updateProfile = async (userId, userData) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData, { merge: true });
    await axios.put(`${API_URL}/profile`, { uid: userId, ...userData });
    return await getUserProfile(userId);
  };

  authService = { register, login, logout, getCurrentUser, updateProfile };
} else {
  // Mock service
  authService = (await import('./mockAuthService.js')).default;
}

export default authService;
