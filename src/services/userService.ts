import type { User } from '../types/user';
import { getSubmissionsFromStorage, saveSubmissionsToStorage } from './submissionApi';

const USERS_STORAGE_KEY = 'workchain_mock_users';

const initialUsers: User[] = [
  { _id: 'SK123', name: 'Sai Kiran', email: 'alice@example.com', password: 'password123', points: 0, role: 'user' },
  { _id: 'AR123', name: 'Razak', email: 'bob@example.com', password: 'password123', points: 0, role: 'user' },
  { _id: 'user789', name: 'Charlie', email: 'charlie@example.com', password: 'password123', points: 0, role: 'user' },
  { _id: 'user101', name: 'Diana', email: 'diana@example.com', password: 'password123', points: 0, role: 'user' },
  { _id: 'user222', name: 'Eve', email: 'eve@example.com', password: 'password123', points: 0, role: 'user' },
  { _id: 'admin_user', name: 'Ramadugu Sai Kiran', email: 'admin@workchain.app', password: 'adminpassword', points: 9999, role: 'admin' },
];

const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const initializeAndGetUsers = (): User[] => {
  const allSubmissions = getSubmissionsFromStorage();
  const usersWithCalculatedPoints = initialUsers.map(user => {
    if (user.role === 'admin') return user;
    const userSubmissions = allSubmissions.filter(s => s.submittedBy === user._id);
    const totalPoints = userSubmissions.reduce((sum, s) => sum + (s.pointsAwarded || 0), 0);
    return { ...user, points: totalPoints };
  });
  saveUsersToStorage(usersWithCalculatedPoints);
  return usersWithCalculatedPoints;
};

const getUsersFromStorage = (): User[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse users from localStorage", e);
  }
  return initializeAndGetUsers();
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  await delay(100);
  const users = getUsersFromStorage();
  
  // For debugging purposes
  console.log('Attempting login with username:', username);
  console.log('Available users:', users.map(u => ({ id: u._id, name: u.name, role: u.role })));
  
  // Check for admin login
  if (username.toLowerCase() === 'ramadugu sai kiran' || username.toLowerCase() === 'admin') {
    console.log('Admin login detected');
    return users.find(u => u.role === 'admin');
  }
  
  // For regular users, try exact case match first, then case-insensitive
  let user = users.find(u => u.name === username && u.role === 'user');
  if (!user) {
    console.log('No exact match found, trying case-insensitive match');
    user = users.find(u => u.name.toLowerCase() === username.toLowerCase() && u.role === 'user');
  }
  
  console.log('Found user:', user ? user.name : 'Not found');
  return user;
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  await delay(100);
  const users = getUsersFromStorage();
  return users.find(u => u.email?.toLowerCase() === email.toLowerCase());
};

export const createUser = async (details: { name: string; email: string; password?: string }): Promise<User> => {
  await delay(150);
  let users = getUsersFromStorage();
  const newUser: User = {
    _id: `user_${Date.now()}`,
    name: details.name,
    email: details.email,
    password: details.password,
    points: 0,
    role: 'user',
  };
  users.push(newUser);
  saveUsersToStorage(users);
  console.log('New user created via signup:', newUser);
  return newUser;
};

export const findOrCreateUserByGoogle = async (googleProfile: {
  name: string;
  email: string;
  picture: string;
  sub: string;
}): Promise<User> => {
  await delay(200);
  let users = getUsersFromStorage();
  let user = users.find(u => u.googleId === googleProfile.sub || u.email === googleProfile.email);

  if (user) {
    user.picture = googleProfile.picture;
    user.googleId = googleProfile.sub;
  } else {
    user = {
      _id: `user_${Date.now()}`,
      name: googleProfile.name,
      email: googleProfile.email,
      picture: googleProfile.picture,
      googleId: googleProfile.sub,
      points: 0,
      role: 'user',
    };
    users.push(user);
  }
  
  saveUsersToStorage(users);
  return user;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  await delay(100);
  const users = getUsersFromStorage();
  return users.find(u => u._id === id);
};

export const recalculateUserPoints = async (userId: string): Promise<User> => {
  await delay(50);
  let allSubmissions = getSubmissionsFromStorage();

  let pointFixApplied = false;
  allSubmissions.forEach(submission => {
    if (submission.submittedBy === userId) {
      // FIX: If a task is rejected but has no points or incorrect points, assign consolation points.
      if (submission.status === 'rejected' && submission.pointsAwarded !== 10) {
        submission.pointsAwarded = 10;
        pointFixApplied = true;
      }
    }
  });

  if (pointFixApplied) {
    saveSubmissionsToStorage(allSubmissions);
  }
  
  const userSubmissions = allSubmissions.filter(s => s.submittedBy === userId);
  const totalPoints = userSubmissions.reduce((sum, s) => sum + (s.pointsAwarded || 0), 0);

  let users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u._id === userId);

  if (userIndex === -1) {
    throw new Error(`User with id ${userId} not found for point recalculation.`);
  }

  const updatedUser = { ...users[userIndex], points: totalPoints };
  users[userIndex] = updatedUser;
  saveUsersToStorage(users);

  console.log(`Recalculated points for ${updatedUser.name}. New total: ${totalPoints}`);
  
  // Dispatch event to notify UI of the update
  window.dispatchEvent(new CustomEvent('user_updated', { detail: updatedUser }));

  return updatedUser;
};
