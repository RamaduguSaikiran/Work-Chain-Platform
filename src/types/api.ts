export interface HealthResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
}

export interface ApiError {
  message: string;
  status?: number;
}
