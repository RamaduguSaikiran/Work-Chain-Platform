import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Code, Users } from 'lucide-react';
import type { TaskTemplate } from '../types/taskTemplate';

interface TaskTemplateMarketCardProps {
  template: TaskTemplate;
  onSelect: (template: TaskTemplate) => void;
}

const TaskTemplateMarketCard: React.FC<TaskTemplateMarketCardProps> = ({
  template,
  onSelect,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSchemaInfo = () => {
    const properties = template.schema.properties || {};
    const propertyCount = Object.keys(properties).length;
    const requiredFields = template.schema.required?.length || 0;
    
    return { propertyCount, requiredFields };
  };

  const { propertyCount, requiredFields } = getSchemaInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Code className="w-4 h-4" />
                <span>{propertyCount} fields</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{requiredFields} required</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Form Preview</h4>
          <div className="space-y-1">
            {Object.keys(template.schema.properties || {}).slice(0, 3).map((key) => {
              const property = template.schema.properties[key];
              const isRequired = template.schema.required?.includes(key);
              return (
                <div key={key} className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isRequired ? 'bg-red-400' : 'bg-gray-300'}`} />
                  <span className="text-gray-600">
                    {property.title || key} ({property.type})
                  </span>
                </div>
              );
            })}
            {Object.keys(template.schema.properties || {}).length > 3 && (
              <div className="text-xs text-gray-500 pl-4">
                +{Object.keys(template.schema.properties || {}).length - 3} more fields
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(template.createdAt)}</span>
          </div>
          
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Start Task →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskTemplateMarketCard;
