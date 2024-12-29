import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', result.user.uid), {
    name,
    email,
    role: 'user',
    createdAt: new Date(),
    twoFactorEnabled: false
  });

  return result.user;
};

export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Check if user document exists
  const userDoc = await getDoc(doc(db, 'users', result.user.uid));
  
  if (!userDoc.exists()) {
    // Create user document if it doesn't exist
    await setDoc(doc(db, 'users', result.user.uid), {
      name: result.user.displayName,
      email: result.user.email,
      role: 'user',
      createdAt: new Date(),
      twoFactorEnabled: false,
      avatar: result.user.photoURL
    });
  }
  
  return result.user;
};