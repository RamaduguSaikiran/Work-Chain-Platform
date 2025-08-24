import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    const handleUserUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<User>;
      setUser(prevUser => {
        if (prevUser && customEvent.detail._id === prevUser._id) {
          // Update the session storage for consistency
          localStorage.setItem('workchain_user', JSON.stringify(customEvent.detail));
          return customEvent.detail;
        }
        return prevUser;
      });
    };

    window.addEventListener('user_updated', handleUserUpdate);

    return () => {
      window.removeEventListener('user_updated', handleUserUpdate);
    };
  }, []);

  const login = async (username: string) => {
    const loggedInUser = await authService.login(username);
    setUser(loggedInUser);
  };
  
  const signup = async (name: string, email: string, password?: string) => {
    const newUser = await authService.signup(name, email, password);
    setUser(newUser);
  };

  const loginWithGoogle = async (credential: string) => {
    const loggedInUser = await authService.loginWithGoogle(credential);
    setUser(loggedInUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
