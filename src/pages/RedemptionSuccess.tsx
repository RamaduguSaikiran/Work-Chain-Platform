import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Gift, ArrowLeft, Download, Copy } from 'lucide-react';

interface RedemptionSuccessProps {
  redemption: {
    id: string;
    cardValue: number;
    pointsUsed: number;
    code?: string;
    redeemedAt: Date;
  };
  onBackToRedemption: () => void;
  onViewHistory: () => void;
}

const RedemptionSuccess: React.FC<RedemptionSuccessProps> = ({ 
  redemption, 
  onBackToRedemption, 
  onViewHistory 
}) => {
  const [codeCopied, setCopeCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopeCopied(true);
      setTimeout(() => setCopeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Redemption Successful!
            </h1>
            <p className="text-gray-600">
              Your Google Play gift card is ready to use
            </p>
          </motion.div>
        </motion.div>

        {/* Card Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                ${redemption.cardValue} Google Play Card
              </h3>
              <p className="text-sm text-gray-600">
                Redeemed for {redemption.pointsUsed} points
              </p>
            </div>
          </div>

          {/* Redemption Code */}
          <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-2">Your Redemption Code:</p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <code className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                {redemption.code || 'N/A'}
              </code>
              {redemption.code && (
                <button
                  onClick={() => copyToClipboard(redemption.code!)}
                  className="ml-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            {codeCopied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-600 mt-2"
              >
                Code copied to clipboard!
              </motion.p>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Redeemed on {redemption.redeemedAt.toLocaleDateString()} at {redemption.redeemedAt.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8"
        >
          <h4 className="font-semibold text-yellow-800 mb-2">How to redeem:</h4>
          <ol className="text-sm text-yellow-700 text-left space-y-1">
            <li>1. Open Google Play Store</li>
            <li>2. Go to Account → Payment methods</li>
            <li>3. Select "Redeem code"</li>
            <li>4. Enter the code above</li>
            <li>5. Enjoy your credit!</li>
          </ol>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <button
            onClick={onViewHistory}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>View All Redemptions</span>
          </button>
          
          <button
            onClick={onBackToRedemption}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Redeem More Cards</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RedemptionSuccess;
