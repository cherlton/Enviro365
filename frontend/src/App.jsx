import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PortfolioDashboard from './components/PortfolioDashboard';
import WithdrawalForm from './components/WithdrawalForm';
import WithdrawalHistory from './components/WithdrawalHistory';
import ToastProvider, { useToast } from './components/ui/Toast';
import { getInvestorPortfolio, getWithdrawalNotices } from './services/api';
import './index.css';

const DEMO_INVESTORS = [
  { id: 1, name: 'Dr. Sipho Ndlovu', age: 72, eligibleForRetirement: true },
  { id: 2, name: 'Thabo Mbeki Jr', age: 40, eligibleForRetirement: false },
];

function MainContent() {
  const [currentInvestorId, setCurrentInvestorId] = useState(1);
  const [investorData, setInvestorData] = useState(null);
  const [recentNotices, setRecentNotices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toast = useToast();

  const loadInvestorData = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInvestorPortfolio(id);
      setInvestorData(data);

      // Fetch recent notices for notification popover
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
    loadInvestorData(currentInvestorId);
  }, [currentInvestorId, refreshTrigger]);

  const handleSelectInvestor = (id) => {
    setCurrentInvestorId(id);
    setSelectedProduct(null);
    const investor = DEMO_INVESTORS.find((i) => i.id === id);
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

  const currentInvestorInfo = DEMO_INVESTORS.find((i) => i.id === currentInvestorId);

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#1C1917] flex font-sans relative overflow-x-hidden">
      {/* Desktop 240px Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentInvestor={investorData || currentInvestorInfo}
        investorsList={DEMO_INVESTORS}
        onSelectInvestor={handleSelectInvestor}
        noticesCount={recentNotices.length}
      />

      {/* Mobile Backdrop & Slide-over Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative w-[280px] max-w-[80vw] bg-white h-full shadow-2xl z-10">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              currentInvestor={investorData || currentInvestorInfo}
              investorsList={DEMO_INVESTORS}
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
        {/* Top Navigation Bar with Mobile Drawer Hamburger & Functional Search */}
        <Navbar
          currentInvestor={investorData || currentInvestorInfo}
          currentInvestorId={currentInvestorId}
          onSelectInvestor={handleSelectInvestor}
          investorsList={DEMO_INVESTORS}
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
              <p className="text-[13px]">Loading investor portfolio data...</p>
            </div>
          ) : (
            <div key={activeTab}>
              {/* Tab Navigation Content */}
              {activeTab === 'overview' && (
                <PortfolioDashboard
                  investor={investorData}
                  onSelectProductForWithdrawal={handleSelectProductForWithdrawal}
                  globalSearchQuery={globalSearchQuery}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <MainContent />
    </ToastProvider>
  );
}

export default App;
