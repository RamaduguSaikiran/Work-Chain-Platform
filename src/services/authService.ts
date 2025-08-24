import { findUserByUsername, findOrCreateUserByGoogle, findUserByEmail, createUser, recalculateUserPoints } from './userService';
import type { User } from '../types/user';
import { jwtDecode } from 'jwt-decode';

const USER_STORAGE_KEY = 'workchain_user';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (username: string, password?: string): Promise<User> => {
  await delay(500); // Simulate network request
  let user = await findUserByUsername(username);
  if (user) {
    // If this is the admin user, ensure the name is set to 'Ramadugu Sai Kiran'
    if (user.role === 'admin') {
      user.name = 'Ramadugu Sai Kiran';
    }
    user = await recalculateUserPoints(user._id); // Recalculate points on login
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  throw new Error('Invalid username or password');
};

export const signup = async (name: string, email: string, password?: string): Promise<User> => {
  await delay(500);
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const newUser = await createUser({ name, email, password });
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginWithGoogle = async (credential: string): Promise<User> => {
  await delay(500);
  // In a real backend, you would send this credential to your server
  // The server would verify it with Google's public keys
  // Then, it would find or create a user in the database
  
  // For the frontend simulation, we decode the JWT to get the profile
  const googleProfile: { name: string; email: string; picture: string; sub: string } = jwtDecode(credential);
  
  let user = await findOrCreateUserByGoogle(googleProfile);
  user = await recalculateUserPoints(user._id); // Recalculate points on login
  
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    return null;
  }
};
