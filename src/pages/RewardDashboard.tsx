import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, XCircle, TrendingUp, Calendar, FileText, Star, Zap, Clock } from 'lucide-react';
import * as submissionApi from '../services/submissionApi';
import { useAuth } from '../hooks/useAuth';
import type { TaskSubmission, RewardCalculation } from '../types/submission';
import StatusBadge from '../components/StatusBadge';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4"
  >
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

const RewardCalculationDetail: React.FC<{ calc: RewardCalculation }> = ({ calc }) => (
  <div className="bg-gray-100 rounded-lg p-3 mt-3">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-gray-600">
      <div className="flex items-center space-x-1.5">
        <Award className="w-3 h-3 text-gray-400" />
        <span>Base: {calc.basePoints}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Zap className="w-3 h-3 text-gray-400" />
        <span>Difficulty: {calc.difficultyMultiplier.toFixed(1)}x</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Star className="w-3 h-3 text-gray-400" />
        <span>Quality: {calc.qualityMultiplier.toFixed(1)}x</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Clock className="w-3 h-3 text-gray-400" />
        <span>Timeliness: {calc.timelinessBonus.toFixed(1)}x</span>
      </div>
    </div>
  </div>
);

const RewardDashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await submissionApi.getAllSubmissions();
        if (response.success && Array.isArray(response.data)) {
          const userSubmissions = response.data.filter(s => s.submittedBy === user._id);
          setSubmissions(userSubmissions);
        }
      } catch (error) {
        console.error('Failed to load submissions', error);
      } finally {
        setLoading(false);
      }
    };
    loadSubmissions();
  }, [user]);

  const rewardHistory = useMemo(() => {
    return submissions
      .filter(s => typeof s.pointsAwarded === 'number')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [submissions]);

  const approvedTasks = useMemo(() => rewardHistory.filter(s => s.status === 'approved'), [rewardHistory]);
  const rejectedTasks = useMemo(() => rewardHistory.filter(s => s.status === 'rejected'), [rewardHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rewards</h1>
          <p className="text-gray-600">An overview of your points and contribution history.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Award className="w-6 h-6 text-yellow-600" />} label="Total Points" value={user?.points.toLocaleString() || 0} color="bg-yellow-100" />
          <StatCard icon={<CheckCircle className="w-6 h-6 text-green-600" />} label="Approved Tasks" value={approvedTasks.length} color="bg-green-100" />
          <StatCard icon={<XCircle className="w-6 h-6 text-red-600" />} label="Rejected Tasks" value={rejectedTasks.length} color="bg-red-100" />
        </div>

        {/* Reward History */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Reward History</span>
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-6 animate-pulse flex justify-between items-center">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))
            ) : rewardHistory.length === 0 ? (
              <div className="text-center p-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">No rewards yet</h3>
                <p>Complete tasks from the marketplace to start earning points!</p>
              </div>
            ) : (
              <AnimatePresence>
                {rewardHistory.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusBadge status={item.status} />
                          <h3 className="font-semibold text-gray-800">{item.formData.title || 'Untitled Task'}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1.5">
                            <FileText className="w-4 h-4" />
                            <span>{item.templateName}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Reviewed on {formatDate(item.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold text-right flex-shrink-0 ${item.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.status === 'approved' ? '+' : ''}{item.pointsAwarded} points
                      </div>
                    </div>
                    {item.rewardCalculation && (
                       <details className="mt-4 text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">View Calculation</summary>
                        <RewardCalculationDetail calc={item.rewardCalculation} />
                      </details>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardDashboard;
