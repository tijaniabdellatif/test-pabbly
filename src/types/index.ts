// src/types/index.ts
export interface FormData {
  email: string;
  agreed: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, any>;
}

export interface SubmissionRequest {
  submissionId: string;
}