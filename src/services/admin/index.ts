import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User } from '../../types';

export const getAdminUsers = async () => {
  const q = query(
    collection(db, 'users'),
    where('role', 'in', ['admin', 'super_admin'])
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as User[];
};

export const updateUserRole = async (userId: string, role: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role });
};

export const deleteUser = async (userId: string) => {
  await deleteDoc(doc(db, 'users', userId));
};

export const createAdmin = async (userData: Partial<User>) => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    role: 'admin',
    createdAt: new Date()
  });
  return docRef.id;
};