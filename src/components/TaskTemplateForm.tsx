import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, AlertCircle } from 'lucide-react';
import type { TaskTemplate, CreateTaskTemplateRequest } from '../types/taskTemplate';

interface TaskTemplateFormProps {
  template?: TaskTemplate;
  onSubmit: (data: CreateTaskTemplateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const TaskTemplateForm: React.FC<TaskTemplateFormProps> = ({
  template,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [name, setName] = useState(template?.name || '');
  const [schemaText, setSchemaText] = useState(
    template ? JSON.stringify(template.schema, null, 2) : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Template name is required');
      return;
    }

    let parsedSchema;
    try {
      parsedSchema = JSON.parse(schemaText || '{}');
    } catch (err) {
      setError('Invalid JSON schema format');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        schema: parsedSchema,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const exampleSchema = {
    type: 'object',
    description: "A schema for a standard bug report.",
    difficulty: 1.2,
    properties: {
      title: { type: 'string', title: 'Task Title' },
      description: { type: 'string', title: 'Description', format: 'textarea' },
      priority: { 
        type: 'string', 
        title: 'Priority',
        enum: ['low', 'medium', 'high']
      },
      attachment: {
        type: 'string',
        format: 'file',
        title: 'Attachment',
        description: 'Upload a relevant file (e.g., image, PDF).'
      }
    },
    required: ['title', 'description']
  };

  const insertExample = () => {
    setSchemaText(JSON.stringify(exampleSchema, null, 2));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? 'Edit Task Template' : 'Create Task Template'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bug Report Template"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="schema" className="block text-sm font-medium text-gray-700">
                JSON Schema
              </label>
              <button
                type="button"
                onClick={insertExample}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Insert Example
              </button>
            </div>
            <textarea
              id="schema"
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Paste your JSON schema here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Define the structure and validation rules. You can add a <code>"difficulty": number</code> property (e.g., 1.0) to the root of the schema to act as a point multiplier.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{template ? 'Update' : 'Create'} Template</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskTemplateForm;
