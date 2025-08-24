import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, FileX, MessageSquareX } from 'lucide-react';
import type { ValidationResult, ValidationError } from '../types/validation';

interface ValidationDisplayProps {
  validation: ValidationResult;
  className?: string;
}

const ValidationDisplay: React.FC<ValidationDisplayProps> = ({
  validation,
  className = ''
}) => {
  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'file_type':
      case 'file_size':
        return <FileX className="w-4 h-4" />;
      case 'forbidden_content':
      case 'min_words':
      case 'max_words':
        return <MessageSquareX className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getErrorTypeLabel = (errorType: string) => {
    switch (errorType) {
      case 'file_type': return 'Invalid File Type';
      case 'file_size': return 'File Too Large';
      case 'forbidden_content': return 'Prohibited Content';
      case 'min_words': return 'Too Few Words';
      case 'max_words': return 'Too Many Words';
      case 'required': return 'Required Field';
      default: return 'Validation Error';
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {validation.isValid ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Validation Passed</p>
              <p className="text-green-700 text-sm">Your submission meets all requirements</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Validation Errors */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-red-800 font-medium">
                  Validation Failed ({validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''})
                </h3>
              </div>
              
              <div className="space-y-3">
                {validation.errors.map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-red-100 rounded-lg"
                  >
                    <div className="text-red-600 mt-0.5">
                      {getErrorIcon(error.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-red-800 capitalize">
                          {error.field}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded-full">
                          {getErrorTypeLabel(error.type)}
                        </span>
                      </div>
                      <p className="text-sm text-red-700">{error.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warnings */}
      <AnimatePresence>
        {validation.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-yellow-800 font-medium">
                Suggestions ({validation.warnings.length})
              </h3>
            </div>
            
            <div className="space-y-2">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-yellow-700">
                  <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidationDisplay;
