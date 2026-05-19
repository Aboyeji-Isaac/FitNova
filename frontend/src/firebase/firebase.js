// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpj716FDEKIQVGeirCUMUfZ-INkTKL9vw",
  authDomain: "fitnova-6df1e.firebaseapp.com",
  projectId: "fitnova-6df1e",
  storageBucket: "fitnova-6df1e.firebasestorage.app",
  messagingSenderId: "143636126443",
  appId: "1:143636126443:web:8e2d3a9ef66cf94eab3cae",
  measurementId: "G-V9C7GTPXR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;