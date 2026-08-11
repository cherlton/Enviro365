import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PortfolioDashboard from './components/PortfolioDashboard';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalHistory from './components/WithdrawalHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import HeroLanding from './components/HeroLanding';
import ToastProvider, { useToast } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getInvestorPortfolio, getWithdrawalNotices, getAllInvestors } from './services/api';
import './index.css';

/**
 * Authenticated Dashboard: shown after login for both Investor and Admin roles.
 * No hardcoded data — investor list is fetched from the API.
 */
function AuthenticatedDashboard() {
  const { user, isAdmin, investorId: authInvestorId } = useAuth();

  const [investorsList, setInvestorsList] = useState([]);
  const [currentInvestorId, setCurrentInvestorId] = useState(authInvestorId || null);
  const [investorData, setInvestorData] = useState(null);
  const [recentNotices, setRecentNotices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toast = useToast();

  // Load all investors from API for the sidebar selector
  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const data = await getAllInvestors();
        setInvestorsList(data || []);

        // Set current investor ID from auth or first available
        if (authInvestorId) {
          setCurrentInvestorId(authInvestorId);
        } else if (data && data.length > 0) {
          setCurrentInvestorId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load investors list:', err);
        // Fallback: if investor, use their own ID
        if (authInvestorId) {
          setCurrentInvestorId(authInvestorId);
        }
      }
    };
    fetchInvestors();
  }, [authInvestorId, refreshTrigger]);

  // Load portfolio data for current investor
  const loadInvestorData = async (id) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInvestorPortfolio(id);
      setInvestorData(data);

      const notices = await getWithdrawalNotices({ investorId: id });
      setRecentNotices(notices || []);
    } catch (err) {
      console.error('Error fetching investor data:', err);
      setError(
        'Failed to connect to Spring Boot backend service on port 8080. Please verify backend is running.'
      );
      toast.error('Backend Connection Error', 'Spring Boot API is unreachable on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentInvestorId) {
      loadInvestorData(currentInvestorId);
    }
  }, [currentInvestorId, refreshTrigger]);

  const handleSelectInvestor = (id) => {
    setCurrentInvestorId(id);
    setSelectedProduct(null);
    const investor = investorsList.find((i) => i.id === id);
    if (investor) {
      toast.success('Profile Switched', `Active investor set to ${investor.name}`);
    }
  };

  const handleWithdrawalCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSelectProductForWithdrawal = (product) => {
    setSelectedProduct(product);
    setActiveTab('form');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#1C1917] flex font-sans relative overflow-x-hidden">
      {/* Desktop 240px Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentInvestor={investorData}
        investorsList={investorsList}
        onSelectInvestor={handleSelectInvestor}
        noticesCount={recentNotices.length}
      />

      {/* Mobile Backdrop & Slide-over Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-[280px] max-w-[80vw] bg-white h-full shadow-2xl z-10">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              currentInvestor={investorData}
              investorsList={investorsList}
              onSelectInvestor={handleSelectInvestor}
              noticesCount={recentNotices.length}
              isMobile={true}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Right Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentInvestor={investorData}
          currentInvestorId={currentInvestorId}
          onSelectInvestor={handleSelectInvestor}
          investorsList={investorsList}
          recentNotices={recentNotices}
          onNavigateToHistory={() => setActiveTab('history')}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          globalSearchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
        />

        {/* Content Container */}
        <main className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
          {error ? (
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] p-5 rounded-[10px] text-[#991B1B] space-y-2">
              <h3 className="text-[15px] font-bold">Backend Connection Required</h3>
              <p className="text-[13px] text-[#7F1D1D]">{error}</p>
              <button
                onClick={() => loadInvestorData(currentInvestorId)}
                className="px-3.5 py-1.5 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium rounded-[6px] text-[12px] transition-colors cursor-pointer"
              >
                Retry Connection
              </button>
            </div>
          ) : isLoading ? (
            <div className="p-16 text-center text-[#78716C]">
              <span className="inline-block w-6 h-6 border-2 border-[#1A7A6D] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-[13px]">Loading portfolio data...</p>
            </div>
          ) : (
            <div key={activeTab}>
              {activeTab === 'overview' && (
                <PortfolioDashboard
                  investor={investorData}
                  onSelectProductForWithdrawal={handleSelectProductForWithdrawal}
                  globalSearchQuery={globalSearchQuery}
                  onDataChanged={() => setRefreshTrigger((prev) => prev + 1)}
                />
              )}

              {activeTab === 'form' && (
                <div className="py-2 space-y-6">
                  <WithdrawalForm
                    investor={investorData}
                    selectedProduct={selectedProduct}
                    onWithdrawalCreated={handleWithdrawalCreated}
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="py-2 space-y-6">
                  <WithdrawalHistory
                    currentInvestorId={currentInvestorId}
                    refreshTrigger={refreshTrigger}
                    globalSearchQuery={globalSearchQuery}
                  />
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="py-2 space-y-6">
                  <AdminDashboard />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Root: gates Hero Landing (logged out) vs Authenticated Dashboard (logged in).
 */
function MainContent() {
  const { user, authModalOpen, setAuthModalOpen } = useAuth();

  if (!user) {
    return (
      <>
        <HeroLanding />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <AuthenticatedDashboard />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
