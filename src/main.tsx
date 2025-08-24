import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Temporarily disable Google OAuth for local development
const isGoogleOAuthEnabled = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_NEW_CLIENT_ID_HERE';

if (!isGoogleOAuthEnabled) {
  console.warn("Google OAuth is disabled. Using username login only.");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isGoogleOAuthEnabled ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    ) : (
      <AuthProvider>
        <App />
      </AuthProvider>
    )}
  </StrictMode>,
);
