import React from 'react';
import { Github, Mail, Facebook } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SocialAuth: React.FC = () => {
  const { signInWithGoogle, signInWithGithub, signInWithFacebook } = useAuth();

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => signInWithGoogle()}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Mail className="h-5 w-5" />
        </button>

        <button
          onClick={() => signInWithGithub()}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Github className="h-5 w-5" />
        </button>

        <button
          onClick={() => signInWithFacebook()}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Facebook className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};