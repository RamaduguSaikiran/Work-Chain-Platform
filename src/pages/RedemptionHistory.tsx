import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Gift, 
  Calendar, 
  Award, 
  Filter, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Copy
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface RedemptionRecord {
  id: string;
  cardValue: number;
  pointsUsed: number;
  redeemedAt: Date;
  status: 'pending' | 'completed' | 'failed';
  code?: string;
}

interface RedemptionHistoryProps {
  onBackToRedemption: () => void;
}

const RedemptionHistory: React.FC<RedemptionHistoryProps> = ({ onBackToRedemption }) => {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [filteredRedemptions, setFilteredRedemptions] = useState<RedemptionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const history = localStorage.getItem(`redemption_history_${user._id}`);
      if (history) {
        const parsedHistory = JSON.parse(history).map((item: any) => ({
          ...item,
          redeemedAt: new Date(item.redeemedAt)
        }));
        setRedemptions(parsedHistory);
        setFilteredRedemptions(parsedHistory);
      }
    }
  }, [user]);

  useEffect(() => {
    let filtered = redemptions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cardValue.toString().includes(searchTerm) ||
        r.pointsUsed.toString().includes(searchTerm)
      );
    }

    setFilteredRedemptions(filtered);
  }, [redemptions, statusFilter, searchTerm]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalRedeemed = redemptions.reduce((sum, r) => sum + r.cardValue, 0);
  const totalPointsUsed = redemptions.reduce((sum, r) => sum + r.pointsUsed, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToRedemption}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Redemption History</h1>
                <p className="text-gray-600">Track all your Google Play card redemptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Redeemed</p>
                <p className="text-2xl font-bold text-gray-900">${totalRedeemed}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Points Used</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsUsed.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{redemptions.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by code, amount, or points..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Redemption List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {filteredRedemptions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No redemptions found</h3>
              <p className="text-gray-500">
                {redemptions.length === 0 
                  ? "You haven't redeemed any cards yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRedemptions.map((redemption, index) => (
                <motion.div
                  key={redemption.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          ${redemption.cardValue} Google Play Card
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{redemption.redeemedAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{redemption.pointsUsed} points used</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {redemption.code && (
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                            {redemption.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(redemption.code!)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {copiedCode === redemption.code && (
                            <span className="text-xs text-green-600">Copied!</span>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(redemption.status)}`}>
                        {getStatusIcon(redemption.status)}
                        <span className="capitalize">{redemption.status}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedemptionHistory;
