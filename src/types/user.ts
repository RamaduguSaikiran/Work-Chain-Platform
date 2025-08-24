export interface User {
  _id: string;
  name: string;
  email?: string;
  password?: string; // For developer/email signup
  picture?: string;
  googleId?: string;
  points: number;
  role: 'admin' | 'user';
}
