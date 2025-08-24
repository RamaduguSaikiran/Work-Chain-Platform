import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, Loader2, File, AlertTriangle, User, Calendar, Award, Download, Paperclip, MessageSquare } from 'lucide-react';
import type { TaskSubmission } from '../types/submission';
import StatusBadge from './StatusBadge';
import ProofTrailTimeline from './ProofTrailTimeline';

interface SubmissionDetailModalProps {
  submission: TaskSubmission;
  onClose: () => void;
  onApprove: (id: string, qualityScore: number, reviewNotes: string) => Promise<void>;
  onReject: (id: string, reviewNotes: string) => Promise<void>;
}

const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  onClose,
  onApprove,
  onReject,
}) => {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleApprove = async () => {
    setLoading('approve');
    // Default quality score to 1.0 for simplicity, per user request to simplify the UI
    await onApprove(submission._id, 1.0, reviewNotes);
    setLoading(null);
  };

  const handleReject = async () => {
    setLoading('reject');
    await onReject(submission._id, reviewNotes);
    setLoading(null);
  };

  const renderValue = (value: any) => {
    if (typeof value === 'string' && value.includes('\n')) {
      return (
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-3 rounded-md">
          {value}
        </pre>
      );
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-sm text-gray-700">{String(value)}</p>;
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Review Submission
            </h2>
            <StatusBadge status={submission.status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <File className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Template</p>
                <p className="text-sm font-medium text-gray-800">{submission.templateName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Submitted By</p>
                <p className="text-sm font-medium text-gray-800">{submission.submittedBy}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Submitted On</p>
                <p className="text-sm font-medium text-gray-800">{new Date(submission.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Points Awarded */}
          {submission.pointsAwarded && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <Award className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Points Awarded</p>
                <p className="text-lg font-bold text-green-700">{submission.pointsAwarded}</p>
              </div>
            </div>
          )}

          {/* Form Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Submitted Data</h3>
            {Object.entries(submission.formData).map(([key, value]) => {
              if (submission.files && submission.files[key]) return null; // Skip file fields here
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 capitalize mb-1">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {renderValue(value)}
                </div>
              );
            })}
          </div>

          {/* Attached Files */}
          {submission.files && Object.keys(submission.files).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Attached Files</h3>
              <div className="space-y-3">
                {Object.entries(submission.files).map(([key, file]) => (
                  <div key={key} className="bg-gray-50 border rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          {submission.validationResults?.warnings && submission.validationResults.warnings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Validation Warnings</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
                {submission.validationResults.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Notes Display */}
          {submission.reviewNotes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Feedback</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{submission.reviewNotes}</p>
              </div>
            </div>
          )}

          {/* Proof Trail */}
          <div className="pt-4 border-t">
            <ProofTrailTimeline submissionId={submission._id} />
          </div>
        </div>

        {/* Actions */}
        {submission.status === 'in_review' && (
          <div className="p-6 border-t bg-gray-50 rounded-b-xl space-y-4">
            <div>
              <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Review Notes (Optional)
              </label>
              <textarea
                id="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide feedback for the user..."
                disabled={!!loading}
              />
            </div>
            <div className="flex items-center justify-end gap-4">
                <button
                  onClick={handleReject}
                  disabled={!!loading}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading === 'reject' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsDown className="w-5 h-5" />}
                  <span>Reject</span>
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!!loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading === 'approve' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp className="w-5 h-5" />}
                  <span>Approve</span>
                </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubmissionDetailModal;
