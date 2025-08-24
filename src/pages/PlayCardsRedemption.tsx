import React, { useState, useEffect } from 'react';
import { Gift, Clock, Copy, ArrowLeft, Search, Filter, CheckCircle, Zap, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GooglePlayCard {
  id: string;
  value: number;
  pointsCost: number;
  image: string;
  popular?: boolean;
  bonus?: string;
}

interface RedemptionRecord {
  id: string;
  cardValue: number;
  pointsUsed: number;
  redemptionCode: string;
  redeemedAt: Date;
  status: 'completed' | 'pending' | 'failed';
}

const PlayCardsRedemption: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'main' | 'success' | 'history'>('main');
  const [selectedCard, setSelectedCard] = useState<GooglePlayCard | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [lastRedemption, setLastRedemption] = useState<RedemptionRecord | null>(null);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    // Load redemption history from localStorage
    const savedHistory = localStorage.getItem('redemptionHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setRedemptionHistory(history);
      } catch (error) {
        console.error('Error loading redemption history:', error);
        setRedemptionHistory([]);
      }
    }
  }, []);

  const googlePlayCards: GooglePlayCard[] = [
    {
      id: 'gp-10',
      value: 10,
      pointsCost: 100,
      image: '/api/placeholder/200/120',
      bonus: 'Most Popular'
    },
    {
      id: 'gp-25',
      value: 25,
      pointsCost: 120,
      image: '/api/placeholder/200/120',
      popular: true,
      bonus: '4% Bonus'
    },
    {
      id: 'gp-50',
      value: 50,
      pointsCost: 140,
      image: '/api/placeholder/200/120',
      bonus: '12% Bonus'
    },
    {
      id: 'gp-100',
      value: 100,
      pointsCost: 150,
      image: '/api/placeholder/200/120',
      bonus: '25% Bonus'
    }
  ];

  // Get recent redemptions (last 3)
  const recentRedemptions = redemptionHistory
    .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
    .slice(0, 3);

  const handleCardSelect = (card: GooglePlayCard) => {
    if (!user || (user.points || 0) < card.pointsCost) {
      alert('Insufficient points for this redemption');
      return;
    }
    setSelectedCard(card);
    setShowConfirmation(true);
  };

  const handleConfirmRedemption = async () => {
    if (!selectedCard || !user) return;

    setIsRedeeming(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRedemption: RedemptionRecord = {
        id: `red_${Date.now()}`,
        cardValue: selectedCard.value,
        pointsUsed: selectedCard.pointsCost,
        redemptionCode: `GP${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        redeemedAt: new Date(),
        status: 'completed'
      };

      const updatedHistory = [newRedemption, ...redemptionHistory];
      setRedemptionHistory(updatedHistory);
      localStorage.setItem('redemptionHistory', JSON.stringify(updatedHistory));

      // Update user points (in a real app, this would be done via API)
      if (user.points) {
        user.points -= selectedCard.pointsCost;
      }

      setLastRedemption(newRedemption);
      setIsRedeeming(false);
      setShowConfirmation(false);
      setCurrentView('success');
      setSelectedCard(null);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter redemption history
  const filteredHistory = redemptionHistory.filter(record => {
    const matchesSearch = record.redemptionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.cardValue.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalRedeemed = redemptionHistory.reduce((sum, record) => sum + record.cardValue, 0);
  const totalPointsUsed = redemptionHistory.reduce((sum, record) => sum + record.pointsUsed, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600">Please log in to access the redemption page.</p>
        </div>
      </div>
    );
  }

  // Success View
  if (currentView === 'success' && lastRedemption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Redemption Successful!</h1>
              <p className="text-gray-600">Your Google Play card has been redeemed successfully.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Google Play Gift Card</h3>
                  <p className="text-blue-100">${lastRedemption.cardValue} USD</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Points Used</p>
                  <p className="text-2xl font-bold">{lastRedemption.pointsUsed}</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100 text-sm">Redemption Code</p>
                    <p className="text-xl font-mono font-bold">{lastRedemption.redemptionCode}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(lastRedemption.redemptionCode)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">How to redeem your code:</h4>
              <ol className="text-blue-700 space-y-2 text-sm">
                <li>1. Open the Google Play Store app</li>
                <li>2. Tap Menu → Redeem</li>
                <li>3. Enter your redemption code</li>
                <li>4. Tap Redeem and enjoy your credit!</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('history')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                View History
              </button>
              <button
                onClick={() => setCurrentView('main')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all"
              >
                Redeem More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // History View
  if (currentView === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('main')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Redemption History</h1>
                  <p className="text-gray-600">Track all your Google Play card redemptions</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Redeemed</p>
                    <p className="text-2xl font-bold">${totalRedeemed}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Points Used</p>
                    <p className="text-2xl font-bold">{totalPointsUsed}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Redemptions</p>
                    <p className="text-2xl font-bold">{redemptionHistory.length}</p>
                  </div>
                  <Gift className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by code or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No redemptions found</h3>
                  <p className="text-gray-400">
                    {redemptionHistory.length === 0 
                      ? "You haven't made any redemptions yet." 
                      : "No redemptions match your search criteria."}
                  </p>
                </div>
              ) : (
                filteredHistory.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Google Play Gift Card - ${record.cardValue}</h4>
                          <p className="text-sm text-gray-600">
                            Redeemed on {new Date(record.redeemedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(record.redemptionCode)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Code: {record.redemptionCode}</p>
                        <p className="text-sm font-semibold text-blue-600">{record.pointsUsed} points</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Google Play Card Redemption</h1>
            <p className="text-gray-600 text-lg">Redeem your points for Google Play gift cards</p>
          </div>

          {/* User Points */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Available Points</p>
                <p className="text-3xl font-bold">{user.points || 0}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('history')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {googlePlayCards.map((card) => {
              const canAfford = (user.points || 0) >= card.pointsCost;
              return (
                <div
                  key={card.id}
                  className={`relative bg-white border-2 rounded-xl p-6 transition-all cursor-pointer ${
                    canAfford 
                      ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg' 
                      : 'border-gray-100 opacity-60 cursor-not-allowed'
                  } ${card.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                  onClick={() => canAfford && handleCardSelect(card)}
                >
                  {card.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="w-full h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">${card.value}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">Google Play Gift Card</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{card.pointsCost} Points</p>
                    
                    {card.bonus && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold mb-3">
                        {card.bonus}
                      </div>
                    )}
                    
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                        canAfford
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!canAfford}
                    >
                      {canAfford ? 'Redeem Now' : 'Insufficient Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Redemptions */}
          {recentRedemptions.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Recent Redemptions</h3>
                <button
                  onClick={() => setCurrentView('history')}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentRedemptions.map((record) => (
                  <div key={record.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">${record.cardValue} Gift Card</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.redeemedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{record.pointsUsed} pts</p>
                      <p className="text-xs text-gray-500">{record.redemptionCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Redemption</h3>
              <p className="text-gray-600">You're about to redeem:</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="text-center">
                <p className="text-blue-100 text-sm">Google Play Gift Card</p>
                <p className="text-3xl font-bold">${selectedCard.value}</p>
                <p className="text-blue-100 text-sm mt-2">Cost: {selectedCard.pointsCost} points</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedCard(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors"
                disabled={isRedeeming}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedemption}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50"
                disabled={isRedeeming}
              >
                {isRedeeming ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Redemption'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayCardsRedemption;