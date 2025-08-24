import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import DynamicFormField from './DynamicFormField';
import { generateFormFields, validateFormData } from '../utils/formGenerator';
import { createSubmission } from '../services/submissionApi';
import type { TaskTemplate } from '../types/taskTemplate';
import type { FormField } from '../types/submission';

interface TaskSubmissionFormProps {
  template: TaskTemplate;
  onBack: () => void;
  onSuccess: () => void;
}

const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({
  template,
  onBack,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fields: FormField[] = generateFormFields(template.schema);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    const validationErrors = validateFormData(formData, fields);
    
    if (Object.keys(validationErrors).length > 0 && status === 'submitted') {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      
      await createSubmission({
        templateId: template._id,
        formData,
        status,
      });

      setMessage({
        type: 'success',
        text: status === 'draft' ? 'Draft saved successfully!' : 'Task submitted successfully!',
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save submission',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">Fill out the form below to submit your task</p>
            </div>
          </div>

          {/* Message Banner */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <DynamicFormField
                  field={field}
                  value={formData[field.name]}
                  onChange={(value) => handleFieldChange(field.name, value)}
                  error={errors[field.name]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={() => handleSubmit('submitted')}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Submit Task</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskSubmissionForm;
