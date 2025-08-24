import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, AlertCircle } from 'lucide-react';
import { findSubmissionByReceiptHash } from '../services/eventService';
import ProofTrailTimeline from '../components/ProofTrailTimeline';

const ProofTrailLookup: React.FC = () => {
  const [hash, setHash] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    setSubmissionId(null);

    try {
      const response = await findSubmissionByReceiptHash(hash);
      if (response.submissionId) {
        setSubmissionId(response.submissionId);
      } else {
        setError('No submission found with this receipt hash.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Proof Trail Lookup</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enter a submission receipt hash to view its complete, immutable event history.
            </p>
          </motion.div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter receipt hash..."
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full pl-12 pr-28 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              disabled={loading || !hash}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[20rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center text-red-600">
                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                <p>{error}</p>
              </motion.div>
            ) : submissionId ? (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <ProofTrailTimeline submissionId={submissionId} />
              </motion.div>
            ) : (
              <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-500">
                {searched ? (
                  <p>No results found.</p>
                ) : (
                  <p>Enter a hash to begin your search.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProofTrailLookup;
