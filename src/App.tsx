import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blocks, Users, Shield, Zap, ArrowRight, Settings, ShoppingBag, ClipboardCheck, Hash, ListChecks, Award } from 'lucide-react';
import Header from './components/Header';
import HealthStatus from './components/HealthStatus';
import TaskTemplatesAdmin from './pages/TaskTemplatesAdmin';
import TaskMarketplace from './pages/TaskMarketplace';
import AdminReviewDashboard from './pages/AdminReviewDashboard';
import ProofTrailLookup from './pages/ProofTrailLookup';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MySubmissions from './pages/MySubmissions';
import RewardDashboard from './pages/RewardDashboard';
import PlayCardsRedemption from './pages/PlayCardsRedemption';
import { useAuth } from './hooks/useAuth';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

type Page = 'home' | 'templates' | 'marketplace' | 'review' | 'proof' | 'login' | 'signup' | 'my-submissions' | 'rewards' | 'redemption';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated, isAdmin } = useAuth();

  const navigateTo = (page: Page) => {
    // Role-based navigation protection
    if ((page === 'templates' || page === 'review') && !isAdmin) {
      setCurrentPage('home'); // Or a dedicated 'unauthorized' page
      return;
    }
    if ((page === 'my-submissions' || page === 'rewards' || page === 'redemption') && !isAuthenticated) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    // Page access protection
    if ((currentPage === 'templates' || currentPage === 'review') && !isAdmin) {
      return <HomePage />;
    }
    if ((currentPage === 'my-submissions' || currentPage === 'rewards' || currentPage === 'redemption') && !isAuthenticated) {
      return <LoginPage onLoginSuccess={() => navigateTo(currentPage)} onNavigateToSignup={() => navigateTo('signup')} />;
    }
    if (currentPage === 'marketplace' && !isAuthenticated) {
      // Allow browsing, but submitting will require login (handled in the page)
    }

    switch (currentPage) {
      case 'templates': return <TaskTemplatesAdmin />;
      case 'marketplace': return <TaskMarketplace onLoginRequired={() => navigateTo('login')} />;
      case 'review': return <AdminReviewDashboard />;
      case 'proof': return <ProofTrailLookup />;
      case 'login': return <LoginPage onLoginSuccess={() => navigateTo('home')} onNavigateToSignup={() => navigateTo('signup')} />;
      case 'signup': return <SignUpPage onSignUpSuccess={() => navigateTo('home')} onNavigateToLogin={() => navigateTo('login')} />;
      case 'my-submissions': return <MySubmissions />;
      case 'rewards': return <RewardDashboard />;
      case 'redemption': return <PlayCardsRedemption />;
      case 'home':
      default: return <HomePage />;
    }
  };

  const HomePage = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WorkChain
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionize your workflow management with blockchain technology. 
            Secure, transparent, and efficient project coordination for modern teams.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('marketplace')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Tasks</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            {isAuthenticated && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('my-submissions')}
                  className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-md transition-all"
                >
                  <ListChecks className="w-5 h-5" />
                  <span>My Submissions</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('rewards')}
                  className="bg-white text-yellow-600 border border-yellow-300 px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-md transition-all"
                >
                  <Award className="w-5 h-5" />
                  <span>My Rewards</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('redemption')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Redeem Points</span>
                </motion.button>
              </>
            )}

            {isAdmin && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('templates')}
                  className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-lg transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin Panel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('review')}
                  className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-lg transition-all"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Review Dashboard</span>
                </motion.button>
              </>
            )}

             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('proof')}
              className="bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 justify-center hover:shadow-lg transition-all"
            >
              <Hash className="w-5 h-5" />
              <span>Proof Lookup</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="mb-16"><div className="max-w-md mx-auto"><HealthStatus /></div></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <FeatureCard icon={<Blocks className="w-6 h-6 text-blue-600" />} title="Blockchain-Powered" description="Immutable workflow records with full transparency and auditability." delay={0.1} />
        <FeatureCard icon={<Users className="w-6 h-6 text-blue-600" />} title="Team Collaboration" description="Seamless team coordination with real-time updates and notifications." delay={0.2} />
        <FeatureCard icon={<Shield className="w-6 h-6 text-blue-600" />} title="Enterprise Security" description="Bank-grade security with end-to-end encryption and access controls." delay={0.3} />
        <FeatureCard icon={<Zap className="w-6 h-6 text-blue-600" />} title="Lightning Fast" description="Optimized performance with sub-second response times." delay={0.4} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Built with Modern Technology</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div><h3 className="font-semibold text-gray-900 mb-2">Frontend</h3><p className="text-gray-600 text-sm">React + TypeScript + Tailwind CSS</p></div>
          <div><h3 className="font-semibold text-gray-900 mb-2">Backend</h3><p className="text-gray-600 text-sm">Node.js + Express + MongoDB</p></div>
          <div><h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3><p className="text-gray-600 text-sm">Ethereum + Smart Contracts</p></div>
          <div><h3 className="font-semibold text-gray-900 mb-2">Database</h3><p className="text-gray-600 text-sm">MongoDB + Mongoose ODM</p></div>
        </div>
      </motion.div>
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={(page: string) => navigateTo(page as Page)} />
      {renderPage()}
    </div>
  );
}

export default App;
