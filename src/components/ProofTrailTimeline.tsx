import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, CheckCircle, XCircle, FileCheck, GitBranch, Copy, Check, Award, ChevronDown } from 'lucide-react';
import { getEventsForSubmission } from '../services/eventService';
import type { ProofEvent, EventType } from '../types/event';

interface ProofTrailTimelineProps {
  submissionId: string;
}

const EventIcon: React.FC<{ type: EventType }> = ({ type }) => {
  const icons: Record<EventType, React.ReactNode> = {
    TASK_SUBMITTED: <FileCheck className="w-5 h-5 text-blue-500" />,
    VALIDATION_PASSED: <CheckCircle className="w-5 h-5 text-green-500" />,
    VALIDATION_FAILED: <XCircle className="w-5 h-5 text-red-500" />,
    REVIEW_SUBMITTED: <GitBranch className="w-5 h-5 text-indigo-500" />,
    REWARD_CALCULATED: <Award className="w-5 h-5 text-purple-500" />,
  };
  return <div className="bg-white p-2 rounded-full shadow-md border border-gray-100">{icons[type]}</div>;
};

const ProofTrailTimeline: React.FC<ProofTrailTimelineProps> = ({ submissionId }) => {
  const [events, setEvents] = useState<ProofEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEventsForSubmission(submissionId);
        if (response.success && Array.isArray(response.data)) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch proof trail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [submissionId]);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>, hash: string) => {
    e.stopPropagation();
    const parent = e.currentTarget.parentElement;
    if (parent) {
      const inputElement = parent.querySelector('input');
      if (inputElement) {
        inputElement.select();
        inputElement.setSelectionRange(0, 99999); // For mobile devices
      }
    }
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 3000);
  };
  
  const handleToggleExpand = (eventId: string) => {
    setExpandedEventId(prevId => (prevId === eventId ? null : eventId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading Proof Trail...</span>
      </div>
    );
  }

  if (events.length === 0) {
    return <div className="text-center p-8 text-gray-500">No events found for this submission.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
        <Hash className="w-5 h-5" />
        <span>Proof Trail</span>
      </h3>
      <div className="relative pl-6">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
        {events.map((event, index) => {
          const isExpanded = expandedEventId === event._id;
          const isCopied = copiedHash === event.hash;
          const buttonTitle = isCopied ? 'Press Ctrl+C or Cmd+C to copy' : 'Select hash to copy';

          return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative mb-4"
            >
              <div className="absolute -left-4 top-0 z-10">
                <EventIcon type={event.eventType} />
              </div>
              <div
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleExpand(event._id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {event.eventType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-gray-200 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Payload</h4>
                          <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(event.payload, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Event Hash</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 p-3 rounded-md">
                            <Hash className="w-3 h-3 flex-shrink-0" />
                            <input
                              readOnly
                              value={event.hash}
                              className="truncate flex-1 font-mono bg-transparent outline-none w-full"
                            />
                            <button onClick={(e) => handleCopy(e, event.hash)} title={buttonTitle}>
                              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          {isCopied && (
                            <p className="text-xs text-blue-600 mt-1 text-right">
                              Hash selected. Now press Ctrl+C.
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProofTrailTimeline;
