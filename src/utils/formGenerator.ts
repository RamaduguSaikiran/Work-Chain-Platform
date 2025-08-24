import type { FormField } from '../types/submission';

export const generateFormFields = (schema: Record<string, any>): FormField[] => {
  const fields: FormField[] = [];
  const properties = schema.properties || {};
  const required = schema.required || [];

  Object.keys(properties).forEach(key => {
    const property = properties[key];
    const field: FormField = {
      name: key,
      label: property.title || key.charAt(0).toUpperCase() + key.slice(1),
      type: 'text', // default type
      required: required.includes(key),
      description: property.description,
    };

    // Determine field type based on schema
    switch (property.type) {
      case 'string':
        if (property.format === 'file') {
          field.type = 'file';
        } else if (property.format === 'date') {
          field.type = 'date';
        } else if (property.enum) {
          field.type = 'select';
          field.options = property.enum;
        } else if (property.format === 'textarea' || key.toLowerCase().includes('description') || key.toLowerCase().includes('steps')) {
          field.type = 'textarea';
        } else {
          field.type = 'text';
        }
        break;
      case 'number':
      case 'integer':
        field.type = 'number';
        break;
      case 'boolean':
        field.type = 'checkbox';
        break;
      case 'array':
        if (property.items?.type === 'string' && property.items.enum) {
          field.type = 'checklist';
          field.options = property.items.enum;
        } else if (property.items?.type === 'string') {
          field.type = 'text-array';
        }
        break;
    }

    // Set placeholder
    if (property.examples && property.examples.length > 0) {
      field.placeholder = property.examples[0];
    } else if (property.default) {
      field.placeholder = property.default.toString();
    }

    fields.push(field);
  });

  return fields;
};

export const validateFormData = (formData: Record<string, any>, fields: FormField[]): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const value = formData[field.name];

    if (field.required) {
      let isEmpty = false;
      if (field.type === 'text-array') {
        isEmpty = !value || !Array.isArray(value) || value.length === 0 || (value.length === 1 && value[0] === '');
      } else {
        isEmpty = !value || (Array.isArray(value) && value.length === 0);
      }
      
      if (isEmpty) {
        errors[field.name] = `${field.label} is required`;
      }
    }

    if (field.type === 'number' && value && isNaN(Number(value))) {
      errors[field.name] = `${field.label} must be a valid number`;
    }
  });

  return errors;
};
