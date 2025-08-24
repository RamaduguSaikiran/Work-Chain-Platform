export interface ValidationRule {
  type: 'file' | 'content' | 'length' | 'forbidden_words';
  field: string;
  config: Record<string, any>;
}

export interface FileValidationConfig {
  allowedTypes: string[];
  maxSizeBytes: number;
  required: boolean;
}

export interface ContentValidationConfig {
  minWords?: number;
  maxWords?: number;
  forbiddenPhrases: string[];
  required: boolean;
}

export interface ValidationError {
  field: string;
  type: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface PreflightValidationRequest {
  templateId: string;
  formData: Record<string, any>;
  files?: Record<string, File>;
}

export interface PreflightValidationResponse {
  success: boolean;
  validation: ValidationResult;
  submissionId?: string;
  message: string;
}
