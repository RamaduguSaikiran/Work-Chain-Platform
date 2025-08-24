import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Hash } from 'lucide-react';

interface ReceiptDisplayProps {
  receiptHash: string;
}

const ReceiptDisplay: React.FC<ReceiptDisplayProps> = ({ receiptHash }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'clicked'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999); // For mobile devices
    }
    setCopyStatus('clicked');
    setTimeout(() => setCopyStatus('idle'), 3000);
  };
  
  const buttonTitle = copyStatus === 'clicked' ? 'Press Ctrl+C or Cmd+C to copy' : 'Select hash to copy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
        <Hash className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-900 mb-2">Submission Received!</h3>
      <p className="text-green-700 text-sm mb-4">
        Your submission has been received and a unique receipt hash has been generated.
        Please save this hash to track your submission's progress.
      </p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-2">
        <input
          ref={inputRef}
          readOnly
          value={receiptHash}
          className="text-sm text-gray-600 truncate bg-transparent outline-none w-full font-mono"
        />
        <button
          onClick={handleCopy}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={buttonTitle}
        >
          {copyStatus === 'clicked' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
      {copyStatus === 'clicked' && (
        <p className="text-xs text-blue-600 mt-2">
          Hash selected. Now press Ctrl+C or Cmd+C to copy.
        </p>
      )}
    </motion.div>
  );
};

export default ReceiptDisplay;
