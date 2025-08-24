import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListChecks } from 'lucide-react';
import * as submissionApi from '../services/submissionApi';
import { useAuth } from '../hooks/useAuth';
import type { TaskSubmission } from '../types/submission';
import SubmissionCard from '../components/SubmissionCard';
import UserSubmissionDetailModal from '../components/UserSubmissionDetailModal';

const MySubmissions: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);

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

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => 
      (s.formData.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.templateName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [submissions, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
          <p className="text-gray-600">Track the status and history of your contributions.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-lg font-medium text-gray-800">
            You have <span className="text-blue-600 font-bold">{filteredSubmissions.length}</span> submissions
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded mb-6 w-1/4"></div>
                <div className="space-y-3"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div></div>
              </div>
            ))}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-xl border border-dashed">
            <div className="text-gray-400 mb-4"><ListChecks className="w-16 h-16 mx-auto" /></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-gray-600">Head to the Task Marketplace to get started!</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission, index) => (
              <motion.div key={submission._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <SubmissionCard submission={submission} onClick={() => setSelectedSubmission(submission)} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedSubmission && (
            <UserSubmissionDetailModal
              submission={selectedSubmission}
              onClose={() => setSelectedSubmission(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MySubmissions;
