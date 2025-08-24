import React from 'react';
import { motion } from 'framer-motion';
import { X, File, User, Calendar, Award, Download, Paperclip, MessageSquare } from 'lucide-react';
import type { TaskSubmission } from '../types/submission';
import StatusBadge from './StatusBadge';
import ProofTrailTimeline from './ProofTrailTimeline';

interface UserSubmissionDetailModalProps {
  submission: TaskSubmission;
  onClose: () => void;
}

const UserSubmissionDetailModal: React.FC<UserSubmissionDetailModalProps> = ({
  submission,
  onClose,
}) => {
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
              Submission Details
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <File className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Template</p>
                <p className="text-sm font-medium text-gray-800">{submission.templateName}</p>
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
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Points Awarded</p>
                <p className="text-lg font-bold text-yellow-700">{submission.pointsAwarded}</p>
              </div>
            </div>
          )}

          {/* Admin Feedback */}
          {(submission.status === 'approved' || submission.status === 'rejected') && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Feedback</h3>
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                submission.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <MessageSquare className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  submission.status === 'approved' ? 'text-green-600' : 'text-red-600'
                }`} />
                {submission.reviewNotes ? (
                  <p className={`text-sm whitespace-pre-wrap ${
                    submission.status === 'approved' ? 'text-green-800' : 'text-red-800'
                  }`}>{submission.reviewNotes}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">The admin did not provide any feedback.</p>
                )}
              </div>
            </div>
          )}

          {/* Form Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Submitted Data</h3>
            {Object.entries(submission.formData).map(([key, value]) => {
              if (submission.files && submission.files[key]) return null;
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Attached Files</h3>
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

          {/* Proof Trail */}
          <div className="pt-4 border-t">
            <ProofTrailTimeline submissionId={submission._id} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserSubmissionDetailModal;
