import React from 'react';
import type { TaskSubmission } from '../types/submission';

interface StatusBadgeProps {
  status: TaskSubmission['status'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusStyles: Record<TaskSubmission['status'], { text: string; bg: string; dot: string }> = {
    draft: {
      text: 'text-gray-700',
      bg: 'bg-gray-100',
      dot: 'bg-gray-400',
    },
    submitted: {
      text: 'text-cyan-700',
      bg: 'bg-cyan-100',
      dot: 'bg-cyan-400',
    },
    in_review: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
      dot: 'bg-yellow-400',
    },
    approved: {
      text: 'text-green-700',
      bg: 'bg-green-100',
      dot: 'bg-green-400',
    },
    rejected: {
      text: 'text-red-700',
      bg: 'bg-red-100',
      dot: 'bg-red-400',
    },
  };

  const styles = statusStyles[status] || statusStyles.draft;

  const formattedStatus = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
      <span>{formattedStatus}</span>
    </div>
  );
};

export default StatusBadge;
