import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, FileText, ChevronRight } from 'lucide-react';
import type { TaskSubmission } from '../types/submission';
import StatusBadge from './StatusBadge';

interface ReviewSubmissionCardProps {
  submission: TaskSubmission;
  onClick: () => void;
}

const ReviewSubmissionCard: React.FC<ReviewSubmissionCardProps> = ({ submission, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>Template: {submission.templateName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>Submitted by: {submission.submittedBy}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Submitted on: {formatDate(submission.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewSubmissionCard;
