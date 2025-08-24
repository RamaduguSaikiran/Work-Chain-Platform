// src/types/event.ts

export type EventType = 
  | 'TASK_SUBMITTED'
  | 'VALIDATION_PASSED'
  | 'VALIDATION_FAILED'
  | 'REVIEW_SUBMITTED'
  | 'REWARD_CALCULATED';

export interface ProofEvent {
  _id: string;
  submissionId: string;
  timestamp: string;
  eventType: EventType;
  payload: Record<string, any>;
  hash: string; // SHA-256 hash of the event contents (excluding the hash itself)
  previousHash?: string; // Optional: for chaining events
}

export interface EventResponse {
  success: boolean;
  data: ProofEvent | ProofEvent[];
  message?: string;
}
