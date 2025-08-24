export interface SubmissionFile {
  name: string;
  size: number;
  type: string;
  url: string; // Mock URL for frontend display
}

export interface RewardCalculation {
  basePoints: number;
  difficultyMultiplier: number;
  qualityMultiplier: number;
  timelinessBonus: number;
  finalPoints: number;
}

export interface TaskSubmission {
  _id: string;
  templateId: string;
  templateName: string;
  formData: Record<string, any>;
  files?: Record<string, SubmissionFile>;
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
  submittedBy: string;
  validationResults?: {
    preflightPassed: boolean;
    validatedAt: string;
    errors: any[];
    warnings: string[];
  };
  createdAt: string;
  updatedAt: string;
  receiptHash?: string;
  pointsAwarded?: number;
  reviewNotes?: string;
  rewardCalculation?: RewardCalculation;
}

export interface CreateSubmissionRequest {
  templateId: string;
  formData: Record<string, any>;
  files?: Record<string, File>;
  status?: 'draft' | 'submitted' | 'in_review';
  submittedBy: string;
}

export interface UpdateSubmissionRequest {
  formData?: Record<string, any>;
  status?: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
  qualityScore?: number;
  reviewNotes?: string;
}

export interface SubmissionCreationResponse {
  success: boolean;
  data: TaskSubmission;
  message?: string;
  receiptHash?: string;
}

export interface SubmissionResponse {
  success: boolean;
  data: TaskSubmission | TaskSubmission[];
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'checklist' | 'file' | 'date' | 'text-array';
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
}
