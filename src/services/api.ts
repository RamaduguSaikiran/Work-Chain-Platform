import axios from 'axios';

// Mock API service for development
// In production, this would connect to your actual Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check endpoint
export const checkHealth = async () => {
  try {
    // Mock response for development
    // Replace with actual API call: return api.get('/api/health');
    return {
      data: {
        status: 'success',
        message: 'WorkChain API is running smoothly',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'connected',
      },
    };
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
