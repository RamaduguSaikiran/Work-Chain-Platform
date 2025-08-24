import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, User, LogOut, ChevronDown, Award, ListChecks, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <Link className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WorkChain</h1>
              <p className="text-xs text-gray-500">Blockchain Workflow Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2 text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Award className="w-4 h-4" />
                    <span>{user?.points.toLocaleString() || 0}</span>
                  </div>
                  
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="hidden sm:flex items-center">
                    <span className="font-medium text-gray-700 mr-1">{user?.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="space-y-1">
                          <button onClick={() => handleNavigation('my-submissions')} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                            <ListChecks className="w-4 h-4" />
                            <span>My Submissions</span>
                          </button>
                          <button onClick={() => handleNavigation('rewards')} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                            <Award className="w-4 h-4" />
                            <span>My Rewards</span>
                          </button>
                          <button onClick={() => handleNavigation('redemption')} className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-green-50 hover:text-green-600 transition-colors">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Redeem Points</span>
                          </button>
                        </div>
                        <div className="border-t mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
