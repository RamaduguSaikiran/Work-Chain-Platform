import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Database, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { checkHealth } from '../services/api';
import type { HealthResponse } from '../types/api';

const HealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await checkHealth();
        setHealth(response.data);
      } catch (err) {
        setError('Failed to connect to backend API');
        console.error('Health check error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    if (error) return <XCircle className="w-5 h-5 text-red-500" />;
    if (health?.status === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking system status...';
    if (error) return error;
    return health?.message || 'Unknown status';
  };

  const getStatusColor = () => {
    if (loading) return 'border-blue-200 bg-blue-50';
    if (error) return 'border-red-200 bg-red-50';
    if (health?.status === 'success') return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-lg border p-4 ${getStatusColor()}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        {getStatusIcon()}
        <h3 className="font-semibold text-gray-800">System Status</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{getStatusText()}</p>
      
      {health && (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">API: v{health.version}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              DB: {health.database === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HealthStatus;
