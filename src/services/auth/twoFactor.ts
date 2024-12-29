import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User } from '../../types';

// Generate secret and QR code for 2FA setup
export const generate2FASecret = async (userId: string, email: string) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, 'AdminDashboard', secret);
  
  // Generate QR code
  const qrCode = await QRCode.toDataURL(otpauth);
  
  // Store secret temporarily (will be confirmed after verification)
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    tempSecret: secret,
    twoFactorPending: true
  });

  return {
    secret,
    qrCode
  };
};

// Verify OTP token for 2FA setup
export const verify2FAToken = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const { tempSecret } = userDoc.data();
  
  if (!tempSecret) {
    throw new Error('No pending 2FA setup found');
  }

  const isValid = authenticator.verify({
    token,
    secret: tempSecret
  });

  if (isValid) {
    // Confirm 2FA setup
    await updateDoc(userRef, {
      twoFactorSecret: tempSecret,
      twoFactorEnabled: true,
      tempSecret: null,
      twoFactorPending: false,
      backupCodes: generateBackupCodes()
    });
  }

  return isValid;
};

// Generate backup codes
const generateBackupCodes = (): string[] => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substr(2, 10));
  }
  return codes;
};

// Verify OTP for login
export const verify2FALogin = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const { twoFactorSecret, backupCodes } = userDoc.data();

  // Check if it's a backup code
  if (backupCodes?.includes(token)) {
    // Remove used backup code
    await updateDoc(userRef, {
      backupCodes: backupCodes.filter((code: string) => code !== token)
    });
    return true;
  }

  // Verify TOTP
  return authenticator.verify({
    token,
    secret: twoFactorSecret
  });
};