export interface TaskTemplate {
  _id: string;
  name: string;
  schema: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deadline?: string; // ISO date string
}

export interface CreateTaskTemplateRequest {
  name: string;
  schema: Record<string, any>;
}

export interface UpdateTaskTemplateRequest {
  name?: string;
  schema?: Record<string, any>;
}

export interface TaskTemplateResponse {
  success: boolean;
  data: TaskTemplate | TaskTemplate[];
  message?: string;
}
