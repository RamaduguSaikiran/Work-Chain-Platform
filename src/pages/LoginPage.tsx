import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, User, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const isGoogleOAuthEnabled = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID && 
  (import.meta as any).env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_NEW_CLIENT_ID_HERE';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle, loading } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        onLoginSuccess();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during Google login.');
      }
    } else {
      setError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. This is expected in some sandboxed environments. Please use the Developer Login below.');
  };

  const handleDeveloperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username) {
      setError('Please enter a username.');
      return;
    }
    try {
      await login(username);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {isGoogleOAuthEnabled && (
            <div className="flex justify-center mb-6">
              {loading ? (
                <div className="w-[300px] h-[44px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  shape="rectangular"
                  width="300px"
                  ux_mode="redirect"
                />
              )}
            </div>
          )}
          
          {isGoogleOAuthEnabled && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Note: Google Sign-In may not work in this sandboxed environment. Use the Developer Login.
            </p>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{isGoogleOAuthEnabled ? 'Or use Developer Login' : 'Developer Login'}</span>
            </div>
          </div>
          
          <form onSubmit={handleDeveloperLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Your Username"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Login as Developer</span>
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={onNavigateToSignup} className="font-medium text-blue-600 hover:underline">
                Sign Up
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
