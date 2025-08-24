import { sha256 } from '../utils/crypto';
import type { ProofEvent, EventType, EventResponse } from '../types/event';

const EVENTS_STORAGE_KEY = 'workchain_mock_events';
const initialEvents: ProofEvent[] = [];

const getEventsFromStorage = (): ProofEvent[] => {
  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse events from localStorage", e);
  }
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
  return initialEvents;
};

const saveEventsToStorage = (events: ProofEvent[]): void => {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createEvent = async (
  eventType: EventType,
  submissionId: string,
  payload: Record<string, any>
): Promise<ProofEvent> => {
  let events = getEventsFromStorage();
  const timestamp = new Date().toISOString();
  
  const eventDataToHash = {
    submissionId,
    timestamp,
    eventType,
    payload,
  };

  const hash = await sha256(JSON.stringify(eventDataToHash));

  const newEvent: ProofEvent = {
    _id: `evt_${Date.now()}`,
    ...eventDataToHash,
    hash,
  };

  events.push(newEvent);
  saveEventsToStorage(events);
  console.log('New Event Logged:', newEvent);
  return newEvent;
};

export const getEventsForSubmission = async (submissionId: string): Promise<EventResponse> => {
  await delay(250);
  const allEvents = getEventsFromStorage();
  const submissionEvents = allEvents.filter(e => e.submissionId === submissionId);
  return {
    success: true,
    data: submissionEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  };
};

export const findSubmissionByReceiptHash = async (receiptHash: string): Promise<{ submissionId: string | null }> => {
  await delay(200);
  const events = getEventsFromStorage();
  const event = events.find(e => e.eventType === 'TASK_SUBMITTED' && e.hash === receiptHash);
  return { submissionId: event?.submissionId || null };
};
