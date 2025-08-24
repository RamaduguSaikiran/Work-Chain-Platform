import React from 'react';
import { AlertCircle, X, PlusCircle } from 'lucide-react';
import type { FormField } from '../types/submission';

interface DynamicFormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClasses = error ? "border-red-300" : "border-gray-300";

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseClasses} ${errorClasses} resize-none`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'checklist':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
          />
        );

      case 'text-array':
        const values = Array.isArray(value) ? value : [''];
        
        const handleArrayChange = (index: number, newValue: string) => {
          const newValues = [...values];
          newValues[index] = newValue;
          onChange(newValues);
        };

        const addField = () => {
          onChange([...values, '']);
        };

        const removeField = (index: number) => {
          if (values.length > 1) {
            const newValues = values.filter((_, i) => i !== index);
            onChange(newValues);
          } else {
            onChange(['']);
          }
        };

        return (
          <div className="space-y-2">
            {values.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(index, e.target.value)}
                  className={`${baseClasses} ${errorClasses}`}
                  placeholder={`${field.label} #${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  disabled={values.length === 1 && item === ''}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addField}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium pt-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add {field.label}</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {field.description && (
        <p className="text-xs text-gray-500">{field.description}</p>
      )}
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default DynamicFormField;
