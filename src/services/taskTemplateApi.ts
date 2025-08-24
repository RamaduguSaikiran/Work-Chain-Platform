import type { TaskTemplate, CreateTaskTemplateRequest, UpdateTaskTemplateRequest, TaskTemplateResponse } from '../types/taskTemplate';

const TEMPLATES_STORAGE_KEY = 'workchain_mock_templates';

const initialTemplates: TaskTemplate[] = [
  {
    _id: '1',
    name: 'Bug Report Template',
    schema: {
      type: 'object',
      difficulty: 1.2,
      properties: {
        title: { type: 'string', title: 'Bug Title' },
        description: { type: 'string', title: 'Description', format: 'textarea' },
        severity: { 
          type: 'string', 
          title: 'Severity',
          enum: ['low', 'medium', 'high', 'critical']
        },
        steps: { type: 'string', title: 'Steps to Reproduce', format: 'textarea' },
        screenshot: {
          type: 'string',
          format: 'file',
          title: 'Screenshot/Recording',
          description: 'Upload a screenshot or a short video of the bug (max 10MB).',
        }
      },
      required: ['title', 'description', 'severity', 'screenshot']
    },
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString(),
    deadline: new Date('2025-01-20').toISOString(),
  },
  {
    _id: '2',
    name: 'Feature Request Template',
    schema: {
      type: 'object',
      difficulty: 1.5,
      properties: {
        title: { type: 'string', title: 'Feature Title' },
        description: { type: 'string', title: 'Feature Description', format: 'textarea' },
        priority: { 
          type: 'string', 
          title: 'Priority',
          enum: ['low', 'medium', 'high']
        },
        requirements: { type: 'array', title: 'Requirements', items: { type: 'string' } },
        attachment: {
          type: 'string',
          format: 'file',
          title: 'Supporting Attachment',
          description: 'Optional: Upload mockups, documents, or other relevant files (max 10MB).'
        }
      },
      required: ['title', 'description', 'priority']
    },
    createdAt: new Date('2025-01-09').toISOString(),
    updatedAt: new Date('2025-01-09').toISOString(),
    deadline: new Date('2025-01-19').toISOString(),
  },
  {
    _id: '3',
    name: 'Onboarding Checklist Template',
    schema: {
      type: 'object',
      difficulty: 1.8,
      properties: {
        employeeName: { type: 'string', title: 'New Employee Name' },
        startDate: { type: 'string', title: 'Start Date', format: 'date' },
        department: {
          type: 'string',
          title: 'Department',
          enum: ['Engineering', 'Marketing', 'Sales', 'Human Resources']
        },
        equipment: {
          type: 'array',
          title: 'Equipment Needed',
          items: {
            type: 'string',
            enum: ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headset']
          }
        },
        accessRequired: {
          type: 'array',
          title: 'System Access Required',
          items: { type: 'string' }
        },
        sendWelcomeEmail: { type: 'boolean', title: 'Send Welcome Email' },
        signedContract: {
            type: 'string',
            format: 'file',
            title: 'Signed Contract/Offer Letter',
            description: 'Upload the signed employment contract or offer letter (PDF only, max 5MB).',
            allowedTypes: ['application/pdf'],
            maxSizeBytes: 5 * 1024 * 1024
        },
        notes: { type: 'string', title: 'Additional Notes', format: 'textarea' }
      },
      required: ['employeeName', 'startDate', 'department']
    },
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
  }
];

const getTemplatesFromStorage = (): TaskTemplate[] => {
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse templates from localStorage", e);
  }
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(initialTemplates));
  return initialTemplates;
};

const saveTemplatesToStorage = (templates: TaskTemplate[]): void => {
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllTaskTemplates = async (): Promise<TaskTemplateResponse> => {
  await delay(300);
  const templates = getTemplatesFromStorage();
  return { success: true, data: templates };
};

export const getTaskTemplateById = async (id: string): Promise<TaskTemplateResponse> => {
  await delay(200);
  const templates = getTemplatesFromStorage();
  const template = templates.find(t => t._id === id);
  if (!template) throw new Error('Task template not found');
  return { success: true, data: template };
};

export const createTaskTemplate = async (data: CreateTaskTemplateRequest): Promise<TaskTemplateResponse> => {
  await delay(500);
  let templates = getTemplatesFromStorage();
  const newTemplate: TaskTemplate = {
    _id: Date.now().toString(),
    name: data.name,
    schema: data.schema,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  saveTemplatesToStorage(templates);
  return { success: true, data: newTemplate, message: 'Task template created successfully' };
};

export const updateTaskTemplate = async (id: string, data: UpdateTaskTemplateRequest): Promise<TaskTemplateResponse> => {
  await delay(400);
  let templates = getTemplatesFromStorage();
  const templateIndex = templates.findIndex(t => t._id === id);
  if (templateIndex === -1) throw new Error('Task template not found');
  
  const updatedTemplate = {
    ...templates[templateIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  templates[templateIndex] = updatedTemplate;
  saveTemplatesToStorage(templates);
  
  return { success: true, data: updatedTemplate, message: 'Task template updated successfully' };
};

export const deleteTaskTemplate = async (id: string): Promise<TaskTemplateResponse> => {
  await delay(300);
  let templates = getTemplatesFromStorage();
  const templateIndex = templates.findIndex(t => t._id === id);
  if (templateIndex === -1) throw new Error('Task template not found');
  
  const deletedTemplate = templates[templateIndex];
  templates.splice(templateIndex, 1);
  saveTemplatesToStorage(templates);
  
  return { success: true, data: deletedTemplate, message: 'Task template deleted successfully' };
};
