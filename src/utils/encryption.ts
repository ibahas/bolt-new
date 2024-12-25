import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-encryption-key'; // In production, use environment variables

export function encryptMessage(message: string): string {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
}

export function decryptMessage(encryptedMessage: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}