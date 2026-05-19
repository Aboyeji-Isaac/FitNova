import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

export const getAll = async (collectionName) => {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getById = async (collectionName, id) => {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const create = async (collectionName, data) =>
  addDoc(collection(db, collectionName), data);

export const update = async (collectionName, id, data) =>
  updateDoc(doc(db, collectionName, id), data);

export const remove = async (collectionName, id) =>
  deleteDoc(doc(db, collectionName, id));
