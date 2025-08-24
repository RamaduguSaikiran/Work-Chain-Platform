import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Award, Hash } from 'lucide-react';
import type { TaskSubmission } from '../types/submission';
import StatusBadge from './StatusBadge';

interface SubmissionCardProps {
  submission: TaskSubmission;
  onClick: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer group transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {submission.formData.title || 'Untitled Submission'}
          </h3>
          <StatusBadge status={submission.status} />
        </div>
        {submission.pointsAwarded && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            <Award className="w-4 h-4" />
            <span className="font-bold">{submission.pointsAwarded}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>Template: {submission.templateName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Submitted on: {formatDate(submission.createdAt)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
        <span>Submission ID</span>
        <div className="flex items-center space-x-1 font-mono">
          <Hash className="w-3 h-3" />
          <span>{submission._id}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmissionCard;
