import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { 
  signInWithGoogle,
  signInWithGithub,
  signInWithFacebook,
  setPasswordForSocialUser
} from '../services/auth/providers';
import {
  generate2FASecret,
  verify2FAToken,
  verify2FALogin
} from '../services/auth/twoFactor';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSocialAuth = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const authFunctions = {
        google: signInWithGoogle,
        github: signInWithGithub,
        facebook: signInWithFacebook
      };

      const user = await authFunctions[provider]();
      
      // Check if user needs to set up password
      const needsPassword = !user.providerData.some(
        provider => provider.providerId === 'password'
      );

      if (needsPassword) {
        navigate('/setup-password');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const setup2FA = async () => {
    if (!user?.email) return;
    
    try {
      const { qrCode } = await generate2FASecret(user.uid, user.email);
      setTwoFactorPending(true);
      return qrCode;
    } catch (error: any) {
      toast.error('Failed to setup 2FA');
      throw error;
    }
  };

  const confirm2FA = async (token: string) => {
    if (!user) return false;
    
    try {
      const isValid = await verify2FAToken(user.uid, token);
      if (isValid) {
        setTwoFactorPending(false);
        toast.success('2FA enabled successfully');
      }
      return isValid;
    } catch (error: any) {
      toast.error('Invalid verification code');
      return false;
    }
  };

  return {
    user,
    loading,
    twoFactorPending,
    signInWithGoogle: () => handleSocialAuth('google'),
    signInWithGithub: () => handleSocialAuth('github'),
    signInWithFacebook: () => handleSocialAuth('facebook'),
    setPasswordForSocialUser,
    setup2FA,
    confirm2FA,
    verify2FALogin
  };
};