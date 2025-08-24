import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, LogIn } from 'lucide-react';
import TaskTemplateMarketCard from '../components/TaskTemplateMarketCard';
import EnhancedTaskSubmissionForm from '../components/EnhancedTaskSubmissionForm';
import { getAllTaskTemplates } from '../services/taskTemplateApi';
import { useAuth } from '../hooks/useAuth';
import type { TaskTemplate } from '../types/taskTemplate';

interface TaskMarketplaceProps {
  onLoginRequired: () => void;
}

const TaskMarketplace: React.FC<TaskMarketplaceProps> = ({ onLoginRequired }) => {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getAllTaskTemplates();
      if (response.success && Array.isArray(response.data)) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    if (!isAuthenticated) {
      onLoginRequired();
    } else {
      setSelectedTemplate(template);
    }
  };

  const handleBackToMarketplace = () => {
    setSelectedTemplate(null);
  };

  const handleSubmissionSuccess = () => {
    setSelectedTemplate(null);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedTaskSubmissionForm
          template={selectedTemplate}
          onBack={handleBackToMarketplace}
          onSuccess={handleSubmissionSuccess}
          onLoginRequired={onLoginRequired}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Marketplace</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse available task templates and submit your work. All submissions go through pre-flight validation to ensure quality and compliance.
            </p>
          </motion.div>
        </div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center justify-center space-x-3 mb-8"
          >
            <LogIn className="w-5 h-5" />
            <p>
              You are browsing as a guest. Please{' '}
              <button onClick={onLoginRequired} className="font-bold underline hover:text-blue-600">
                log in
              </button>{' '}
              to submit a task.
            </p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search task templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-gray-400 mb-4"><Search className="w-16 h-16 mx-auto" /></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? 'No templates found' : 'No task templates available'}</h3>
            <p className="text-gray-600">{searchTerm ? 'Try adjusting your search terms' : 'Check back later for new task templates'}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div key={template._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <TaskTemplateMarketCard template={template} onSelect={handleTemplateSelect} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredTemplates.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
            <p className="text-gray-600">Showing {filteredTemplates.length} of {templates.length} available task templates</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskMarketplace;
