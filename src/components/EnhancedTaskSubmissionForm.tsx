import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Send, ArrowLeft, AlertCircle, CheckCircle, Shield, FileUp } from 'lucide-react';
import DynamicFormField from './DynamicFormField';
import ValidationDisplay from './ValidationDisplay';
import ReceiptDisplay from './ReceiptDisplay';
import { generateFormFields } from '../utils/formGenerator';
import { createSubmission } from '../services/submissionApi';
import { preflightValidation } from '../services/validationService';
import { useAuth } from '../hooks/useAuth';
import type { TaskTemplate } from '../types/taskTemplate';
import type { FormField } from '../types/submission';
import type { ValidationResult } from '../types/validation';

interface EnhancedTaskSubmissionFormProps {
  template: TaskTemplate;
  onBack: () => void;
  onSuccess: () => void;
  onLoginRequired: () => void;
}

const EnhancedTaskSubmissionForm: React.FC<EnhancedTaskSubmissionFormProps> = ({
  template,
  onBack,
  onSuccess,
  onLoginRequired,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);

  const fields: FormField[] = generateFormFields(template.schema);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (validationResult) { setValidationResult(null); setShowValidation(false); }
    if (errors[fieldName]) { setErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; }); }
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (file) { setFiles(prev => ({ ...prev, [fieldName]: file })); } 
    else { setFiles(prev => { const newFiles = { ...prev }; delete newFiles[fieldName]; return newFiles; }); }
    if (validationResult) { setValidationResult(null); setShowValidation(false); }
  };

  const runPreflightValidation = async () => {
    try {
      setValidating(true);
      setErrors({});
      const response = await preflightValidation({ templateId: template._id, formData, files });
      setValidationResult(response.validation);
      setShowValidation(true);
      setMessage({ type: response.success ? 'success' : 'error', text: response.message });
      return response.success;
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Validation failed' });
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'submitted') => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    let validationPassed = false;
    if (status === 'submitted') {
      validationPassed = await runPreflightValidation();
      if (!validationPassed) {
        return;
      }
    }

    try {
      setLoading(true);
      setErrors({});
      const finalStatus = status === 'submitted' && validationPassed ? 'in_review' : status;
      
      const response = await createSubmission({
        templateId: template._id,
        formData,
        status: finalStatus as any,
        submittedBy: user!._id,
        files,
      });

      if (response.success && response.receiptHash) {
        setReceiptHash(response.receiptHash);
      } else {
        setMessage({ type: 'success', text: 'Draft saved successfully!' });
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save submission' });
    } finally {
      setLoading(false);
    }
  };
  
  if (receiptHash) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ReceiptDisplay receiptHash={receiptHash} />
        <div className="text-center mt-6">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">Fill out the form below to submit your task</p>
            </div>
          </div>
          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className={`flex items-center space-x-2 p-3 rounded-lg ${
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
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                {field.type === 'file' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
                    <div className="flex items-center space-x-3">
                      <input type="file" onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*,application/pdf" />
                      {files[field.name] && <div className="flex items-center space-x-1 text-sm text-green-600"><FileUp className="w-4 h-4" /><span>{files[field.name].name}</span></div>}
                    </div>
                    {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
                  </div>
                ) : (
                  <DynamicFormField field={field} value={formData[field.name]} onChange={(value) => handleFieldChange(field.name, value)} error={errors[field.name]} />
                )}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {showValidation && validationResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-6">
                <ValidationDisplay validation={validationResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Pre-flight validation ensures quality submissions</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>Please log in to submit your task</span>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <button onClick={() => handleSubmit('draft')} disabled={loading || validating || !isAuthenticated} className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {loading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Draft</span>
              </button>
              <button onClick={() => handleSubmit('submitted')} disabled={loading || validating || !isAuthenticated} className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {validating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Validating...</span></>
                 : loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
                 : <><Send className="w-4 h-4" /><span>Submit Task</span></>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedTaskSubmissionForm;
