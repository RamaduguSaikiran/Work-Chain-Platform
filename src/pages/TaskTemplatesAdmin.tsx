import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, AlertCircle, CheckCircle } from 'lucide-react';
import TaskTemplateCard from '../components/TaskTemplateCard';
import TaskTemplateForm from '../components/TaskTemplateForm';
import * as taskTemplateApi from '../services/taskTemplateApi';
import type { TaskTemplate, CreateTaskTemplateRequest } from '../types/taskTemplate';

const TaskTemplatesAdmin: React.FC = () => {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await taskTemplateApi.getAllTaskTemplates();
      if (response.success && Array.isArray(response.data)) {
        setTemplates(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load task templates' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (data: CreateTaskTemplateRequest) => {
    try {
      setSubmitting(true);
      const response = await taskTemplateApi.createTaskTemplate(data);
      if (response.success) {
        await loadTemplates();
        setShowForm(false);
        setMessage({ type: 'success', text: 'Task template created successfully!' });
      }
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTemplate = async (data: CreateTaskTemplateRequest) => {
    if (!editingTemplate) return;
    
    try {
      setSubmitting(true);
      const response = await taskTemplateApi.updateTaskTemplate(editingTemplate._id, data);
      if (response.success) {
        await loadTemplates();
        setEditingTemplate(null);
        setShowForm(false);
        setMessage({ type: 'success', text: 'Task template updated successfully!' });
      }
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task template?')) return;
    
    try {
      const response = await taskTemplateApi.deleteTaskTemplate(id);
      if (response.success) {
        await loadTemplates();
        setMessage({ type: 'success', text: 'Task template deleted successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete task template' });
    }
  };

  const handleEditTemplate = (template: TaskTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Templates</h1>
            <p className="text-gray-600">Manage reusable task templates with JSON schemas</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Template</span>
          </motion.button>
        </div>

        {/* Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
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
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No templates found' : 'No task templates yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first task template to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template) => (
              <TaskTemplateCard
                key={template._id}
                template={template}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                loading={submitting}
              />
            ))}
          </motion.div>
        )}

        {/* Template Form Modal */}
        <AnimatePresence>
          {showForm && (
            <TaskTemplateForm
              template={editingTemplate || undefined}
              onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              onCancel={handleCancelForm}
              loading={submitting}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskTemplatesAdmin;
