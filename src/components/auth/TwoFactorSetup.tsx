import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [token, setToken] = useState('');
  const { setup2FA, confirm2FA } = useAuth();

  const handleSetup = async () => {
    try {
      const qrCodeUrl = await setup2FA();
      setQrCode(qrCodeUrl);
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
    }
  };

  const handleVerify = async () => {
    if (token.length !== 6) return;
    
    const isValid = await confirm2FA(token);
    if (isValid) {
      setQrCode('');
      setToken('');
    }
  };

  return (
    <div className="space-y-6">
      {!qrCode ? (
        <button
          onClick={handleSetup}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Enable Two-Factor Authentication
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code with your authenticator app
          </p>

          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter 6-digit code"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={token.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Verify and Enable
          </button>
        </div>
      )}
    </div>
  );
};