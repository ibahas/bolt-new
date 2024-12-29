import { 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  updatePassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { AuthProvider } from '../../types';

// Provider instances
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Helper to create/update user document
const handleUserDocument = async (user: FirebaseUser, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userData = {
      email: user.email,
      name: user.displayName,
      avatar: user.photoURL,
      role: 'user',
      createdAt: new Date(),
      twoFactorEnabled: false,
      providers: [user.providerData[0]?.providerId || 'password'],
      ...additionalData
    };

    await setDoc(userRef, userData);
    return userData;
  }

  // Update providers list if new provider
  const currentData = userDoc.data();
  const providers = currentData.providers || [];
  const newProvider = user.providerData[0]?.providerId;
  
  if (newProvider && !providers.includes(newProvider)) {
    await updateDoc(userRef, {
      providers: [...providers, newProvider],
      ...additionalData
    });
  }

  return userDoc.data();
};

// Social auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await handleUserDocument(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please enable popups for this site.');
    }
    throw error;
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await handleUserDocument(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address.');
    }
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await handleUserDocument(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address.');
    }
    throw error;
  }
};

// Password management for social auth users
export const setPasswordForSocialUser = async (
  user: FirebaseUser,
  newPassword: string
) => {
  try {
    // Link password provider to social auth account
    const credential = EmailAuthProvider.credential(user.email!, newPassword);
    await linkWithCredential(user, credential);
    
    // Update user document
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasPassword: true
    });
  } catch (error: any) {
    if (error.code === 'auth/provider-already-linked') {
      // If already has password, just update it
      await updatePassword(user, newPassword);
    } else {
      throw error;
    }
  }
};