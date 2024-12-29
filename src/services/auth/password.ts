import { 
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import type { User } from 'firebase/auth';

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const confirmReset = async (code: string, newPassword: string): Promise<void> => {
  await confirmPasswordReset(auth, code, newPassword);
};

export const changePassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const credential = EmailAuthProvider.credential(
    user.email!,
    currentPassword
  );
  
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};