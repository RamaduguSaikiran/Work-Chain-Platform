import type { 
  ValidationRule, 
  ValidationError, 
  ValidationResult, 
  FileValidationConfig, 
  ContentValidationConfig,
  PreflightValidationRequest,
  PreflightValidationResponse 
} from '../types/validation';
import type { TaskTemplate } from '../types/taskTemplate';
import { createEvent } from './eventService';
import { getTaskTemplateById } from './taskTemplateApi';

// Predefined forbidden phrases for content validation
const FORBIDDEN_PHRASES = [
  'inappropriate content',
  'spam',
  'malicious',
  'hack',
  'exploit',
  'virus',
  'malware',
  'phishing',
  'scam',
  'fraud'
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ValidationService {
  private static extractValidationRules(schema: Record<string, any>): ValidationRule[] {
    const rules: ValidationRule[] = [];
    const properties = schema.properties || {};

    Object.keys(properties).forEach(fieldName => {
      const property = properties[fieldName];
      
      // File validation rules
      if (property.type === 'string' && property.format === 'file') {
        rules.push({
          type: 'file',
          field: fieldName,
          config: {
            allowedTypes: property.allowedTypes || ['image/*', 'application/pdf', 'text/*'],
            maxSizeBytes: property.maxSizeBytes || 10 * 1024 * 1024, // 10MB default
            required: schema.required?.includes(fieldName) || false
          }
        });
      }
      
      // Content validation rules
      if (property.type === 'string' && !property.format) {
        rules.push({
          type: 'content',
          field: fieldName,
          config: {
            minWords: property.minWords,
            maxWords: property.maxWords,
            forbiddenPhrases: FORBIDDEN_PHRASES,
            required: schema.required?.includes(fieldName) || false
          }
        });
      }
    });

    return rules;
  }

  private static validateFile(file: File, config: FileValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check file type
    const isTypeAllowed = config.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isTypeAllowed) {
      errors.push({
        field: 'file',
        type: 'file_type',
        message: `File type '${file.type}' is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
        value: file.type
      });
    }

    // Check file size
    if (file.size > config.maxSizeBytes) {
      const maxSizeMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      errors.push({
        field: 'file',
        type: 'file_size',
        message: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
        value: file.size
      });
    }

    return errors;
  }

  private static validateContent(content: string, fieldName: string, config: ContentValidationConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!content && config.required) {
      errors.push({
        field: fieldName,
        type: 'required',
        message: `${fieldName} is required`,
        value: content
      });
      return errors;
    }

    if (!content) return errors;

    // Word count validation
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    if (config.minWords && wordCount < config.minWords) {
      errors.push({
        field: fieldName,
        type: 'min_words',
        message: `${fieldName} must contain at least ${config.minWords} words (current: ${wordCount})`,
        value: wordCount
      });
    }

    if (config.maxWords && wordCount > config.maxWords) {
      errors.push({
        field: fieldName,
        type: 'max_words',
        message: `${fieldName} must not exceed ${config.maxWords} words (current: ${wordCount})`,
        value: wordCount
      });
    }

    // Forbidden phrases validation
    const contentLower = content.toLowerCase();
    const foundForbiddenPhrases = config.forbiddenPhrases.filter(phrase => 
      contentLower.includes(phrase.toLowerCase())
    );

    if (foundForbiddenPhrases.length > 0) {
      errors.push({
        field: fieldName,
        type: 'forbidden_content',
        message: `${fieldName} contains prohibited content: ${foundForbiddenPhrases.join(', ')}`,
        value: foundForbiddenPhrases
      });
    }

    return errors;
  }

  public static async validateSubmission(
    template: TaskTemplate,
    formData: Record<string, any>,
    files?: Record<string, File>
  ): Promise<ValidationResult> {
    await delay(800); // Simulate validation processing time

    const rules = this.extractValidationRules(template.schema);
    const allErrors: ValidationError[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      const fieldValue = formData[rule.field];
      
      switch (rule.type) {
        case 'file':
          const file = files?.[rule.field];
          const fileConfig = rule.config as FileValidationConfig;
          
          if (fileConfig.required && !file) {
            allErrors.push({
              field: rule.field,
              type: 'required',
              message: `${rule.field} file is required`,
              value: null
            });
          } else if (file) {
            const fileErrors = this.validateFile(file, fileConfig);
            allErrors.push(...fileErrors);
          }
          break;

        case 'content':
          const contentConfig = rule.config as ContentValidationConfig;
          const contentErrors = this.validateContent(fieldValue, rule.field, contentConfig);
          allErrors.push(...contentErrors);
          
          // Add warnings for content quality
          if (fieldValue && typeof fieldValue === 'string') {
            const wordCount = fieldValue.trim().split(/\s+/).length;
            if (wordCount < 10 && rule.field.toLowerCase().includes('description')) {
              warnings.push(`${rule.field} could benefit from more detail (current: ${wordCount} words)`);
            }
          }
          break;
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings
    };
  }
}

// Mock pre-flight validation API endpoint
export const preflightValidation = async (
  request: PreflightValidationRequest
): Promise<PreflightValidationResponse> => {
  await delay(1000); // Simulate network delay

  try {
    // Fetch the actual template using its ID
    const templateResponse = await getTaskTemplateById(request.templateId);
    if (!templateResponse.success || Array.isArray(templateResponse.data)) {
      throw new Error(`Template with ID ${request.templateId} not found for validation.`);
    }
    const template = templateResponse.data;

    const validation = await ValidationService.validateSubmission(
      template,
      request.formData,
      request.files
    );

    // This is a temporary submission ID for event logging before the final submission is created
    const tempSubmissionId = `temp_${Date.now()}`;

    if (!validation.isValid) {
      await createEvent('VALIDATION_FAILED', tempSubmissionId, { validation });
      return {
        success: false,
        validation,
        message: 'Validation failed. Please fix the errors and try again.'
      };
    }

    await createEvent('VALIDATION_PASSED', tempSubmissionId, { validation });
    
    return {
      success: true,
      validation,
      message: 'Validation passed. Your submission has been moved to review status.'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Validation service unavailable. Please try again later.';
    throw new Error(errorMessage);
  }
};
