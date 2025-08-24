import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox, CheckCircle, XCircle, AlertCircle, ArrowUpDown } from 'lucide-react';
import * as submissionApi from '../services/submissionApi';
import type { TaskSubmission } from '../types/submission';
import ReviewSubmissionCard from '../components/ReviewSubmissionCard';
import SubmissionDetailModal from '../components/SubmissionDetailModal';

type SortKey = 'date_asc' | 'date_desc' | 'template_asc' | 'template_desc';

const AdminReviewDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date_asc');
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionApi.getAllSubmissions();
      if (response.success && Array.isArray(response.data)) {
        setSubmissions(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load submissions' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (
    id: string,
    action: 'approve' | 'reject',
    details: { qualityScore?: number; reviewNotes: string }
  ) => {
    const originalSubmissions = [...submissions];
    const submissionToUpdate = originalSubmissions.find(s => s._id === id);
    if (!submissionToUpdate) return;
    
    // Optimistic UI update
    setSubmissions(prev => prev.filter(s => s._id !== id));
    setSelectedSubmission(null);
    
    try {
      const updatePayload = action === 'approve'
        ? { status: 'approved' as const, qualityScore: details.qualityScore, reviewNotes: details.reviewNotes }
        : { status: 'rejected' as const, reviewNotes: details.reviewNotes };
        
      await submissionApi.updateSubmission(id, updatePayload);
      setMessage({ type: 'success', text: `Submission successfully ${action}d!` });
    } catch (error) {
      // Revert UI on failure
      setSubmissions(originalSubmissions);
      setMessage({ type: 'error', text: `Failed to ${action} submission` });
    }
  };

  const handleApproveSubmission = (id: string, qualityScore: number, reviewNotes: string) => {
    handleReviewAction(id, 'approve', { qualityScore, reviewNotes });
  };

  const handleRejectSubmission = (id: string, reviewNotes: string) => {
    handleReviewAction(id, 'reject', { reviewNotes });
  };

  const reviewSubmissions = useMemo(() => {
    return submissions
      .filter(s => s.status === 'in_review' || s.status === 'submitted')
      .filter(s => 
        (s.formData.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortKey) {
          case 'date_desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'template_asc':
            return a.templateName.localeCompare(b.templateName);
          case 'template_desc':
            return b.templateName.localeCompare(a.templateName);
          case 'date_asc':
          default:
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      });
  }, [submissions, searchTerm, sortKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Dashboard</h1>
          <p className="text-gray-600">Approve or reject submissions pending review.</p>
        </div>

        {/* Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats & Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-lg font-medium text-gray-800">
            <span className="text-blue-600 font-bold">{reviewSubmissions.length}</span> submissions pending
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
              <select
                id="sort"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="date_asc">Oldest First</option>
                <option value="date_desc">Newest First</option>
                <option value="template_asc">Template A-Z</option>
                <option value="template_desc">Template Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded mb-6 w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {reviewSubmissions.length > 0 ? (
                reviewSubmissions.map((submission) => (
                  <motion.div
                    key={submission._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReviewSubmissionCard
                      submission={submission}
                      onClick={() => setSelectedSubmission(submission)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-xl border border-dashed md:col-span-2 lg:col-span-3"
                >
                  <div className="text-green-500 mb-4">
                    <CheckCircle className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    All caught up!
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No submissions match your search.' : 'There are no submissions pending review.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Submission Detail Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <SubmissionDetailModal
              submission={selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminReviewDashboard;
