import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/Badge';
import { useAuth } from '../context/AuthContext';

/**
 * Enviro365 Warm Green Top Navigation Bar
 * Features: Mobile drawer toggle hamburger, live functional global search input, interactive notification popover, Auth modal trigger.
 */
export const Navbar = ({
  currentInvestor,
  currentInvestorId,
  onSelectInvestor,
  investorsList,
  recentNotices = [],
  onNavigateToHistory,
  onOpenMobileSidebar,
  globalSearchQuery = '',
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(recentNotices.length);
  const popoverRef = useRef(null);
  const { user, isAdmin, setAuthModalOpen } = useAuth();

  useEffect(() => {
    setUnreadCount(recentNotices.length);
  }, [recentNotices]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val || 0);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E0D8] px-4 sm:px-6 h-14 flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(27,38,35,0.02)] font-sans">
      {/* Left: Mobile Hamburger Toggle + Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F1EC] rounded-[6px] border border-[#E5E0D8] transition-colors"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Mobile Brand Logo */}
        <div className="md:hidden flex items-center gap-2">
          <img src="/logo-365.png" alt="Enviro365" className="w-6 h-6 rounded object-cover" />
          <span className="font-bold text-sm text-[#1C1917] hidden xs:inline">Enviro365</span>
        </div>

        {/* Functional Global Search Input */}
        <div className="relative w-full max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search holdings, products, notices..."
            value={globalSearchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="h-8 w-full pl-9 pr-3 bg-[#F5F1EC] border border-[#E5E0D8] rounded-[6px] text-[12px] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1A7A6D] focus:bg-white transition-all"
          />
          {globalSearchQuery && (
            <button
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right: Profile Summary & Notification Bell */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Investor Switcher (Admin only) */}
        {isAdmin && (
          <div className="md:hidden">
            <select
              value={currentInvestorId}
              onChange={(e) => onSelectInvestor(Number(e.target.value))}
              className="h-8 bg-[#F5F1EC] text-[#1C1917] text-[11px] font-medium px-1.5 rounded-[6px] border border-[#E5E0D8]"
            >
              {investorsList.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>
        )}

        {/* Desktop Eligibility Badge */}
        {currentInvestor && (
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant={currentInvestor.eligibleForRetirement ? 'primary' : 'neutral'}>
              Age {currentInvestor.age} • {currentInvestor.eligibleForRetirement ? 'Eligible (>65)' : 'Ineligible (<=65)'}
            </Badge>
          </div>
        )}

        {/* Interactive Notification Bell Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={handleToggleNotifications}
            className={`w-8 h-8 rounded-[6px] border border-[#E5E0D8] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F1EC] relative transition-all cursor-pointer ${
              showNotifications ? 'bg-[#E8F5F2] border-[#1A7A6D] text-[#1A7A6D]' : ''
            }`}
            aria-label="Notifications"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#1A7A6D] absolute top-1.5 right-1.5 animate-pulse" />
            )}
          </button>

          {/* Expanded Notification Popover Menu */}
          {showNotifications && (
            <div className="animate-dropdown absolute right-0 top-10 w-72 sm:w-80 bg-white border border-[#E5E0D8] rounded-[10px] shadow-[0_8px_24px_rgba(27,38,35,0.08)] z-50 overflow-hidden">
              <div className="p-3.5 border-b border-[#E5E0D8] bg-[#FAF8F4] flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-bold text-[#1C1917]">Recent Activity Notices</h4>
                  <p className="text-[11px] text-[#78716C]">Withdrawal notices for {currentInvestor?.name}</p>
                </div>
                <span className="text-[10px] font-semibold bg-[#E8F5F2] text-[#1A7A6D] px-2 py-0.5 rounded-full">
                  {recentNotices.length} Total
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E0D8]">
                {recentNotices.length === 0 ? (
                  <div className="p-6 text-center text-[12px] text-[#78716C]">
                    No recent withdrawal notices found.
                  </div>
                ) : (
                  recentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (onNavigateToHistory) onNavigateToHistory();
                      }}
                      className="p-3 hover:bg-[#FAF8F4] transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#1C1917]">{notice.productName}</span>
                        <Badge variant={notice.status}>{notice.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#1A7A6D]">{formatCurrency(notice.amount)}</span>
                        <span className="text-[#A8A29E] font-mono">{notice.noticeDate}</span>
                      </div>
                      {notice.reason && (
                        <p className="text-[10px] text-[#78716C] italic truncate">"{notice.reason}"</p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-[#E5E0D8] bg-[#F5F1EC] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    if (onNavigateToHistory) onNavigateToHistory();
                  }}
                  className="text-[11px] font-semibold text-[#1A7A6D] hover:underline cursor-pointer"
                >
                  View Full Audit History →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account Login Button / Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E0D8]">
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#1A7A6D] text-white flex items-center justify-center font-semibold text-[11px] shadow-sm">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-[13px] font-medium text-[#1C1917] hidden lg:block">
                {user.name} ({user.role})
              </span>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-3 py-1 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-medium text-[12px] rounded-[6px] transition-colors cursor-pointer shadow-xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
