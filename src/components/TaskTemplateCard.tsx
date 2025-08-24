import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Code } from 'lucide-react';
import type { TaskTemplate } from '../types/taskTemplate';

interface TaskTemplateCardProps {
  template: TaskTemplate;
  onEdit: (template: TaskTemplate) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const TaskTemplateCard: React.FC<TaskTemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSchemaPreview = () => {
    const properties = template.schema.properties || {};
    const propertyCount = Object.keys(properties).length;
    const requiredFields = template.schema.required?.length || 0;
    
    return `${propertyCount} fields, ${requiredFields} required`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>{getSchemaPreview()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(template.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(template)}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Edit template"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(template._id)}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete template"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Schema Preview</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(template.schema, null, 2).substring(0, 200)}
          {JSON.stringify(template.schema, null, 2).length > 200 && '...'}
        </pre>
      </div>
    </motion.div>
  );
};

export default TaskTemplateCard;
