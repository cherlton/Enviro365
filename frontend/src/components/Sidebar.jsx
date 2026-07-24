import React, { useState } from 'react';

/**
 * Enviro365 Warm Fintech Sidebar Component
 * Specs: 240px width, subtle warm gradient background (from-[#FFFDF9] via-[#FAF8F4] to-[#F5F1EC]),
 * hover tooltips, mobile slide-over drawer support with close button.
 */
export const Sidebar = ({
  activeTab,
  setActiveTab,
  currentInvestor,
  investorsList,
  onSelectInvestor,
  noticesCount = 0,
  isMobile = false,
  onCloseMobile,
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      tooltip: 'View your portfolio dashboard with total holdings, product balances, and retirement eligibility.',
      badge: null,
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      id: 'form',
      label: 'Withdrawal Notice',
      tooltip: 'Submit a new withdrawal request. Business rules will validate retirement age (>65), balance limits, and 90% cap.',
      badge: 'New',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Withdrawal History',
      tooltip: 'Browse and filter past withdrawal notices by date range. Export filtered records as CSV statements.',
      badge: noticesCount > 0 ? noticesCount : null,
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F4] to-[#F5F1EC] border-r border-[#E5E0D8] flex flex-col justify-between p-4 shrink-0 shadow-[1px_0_10px_rgba(27,38,35,0.02)] ${
        isMobile ? 'w-full h-full min-h-full' : 'w-[240px] min-h-screen hidden md:flex'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header with Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="/logo-365.png"
                alt="Enviro365 Logo"
                className="w-9 h-9 rounded-[8px] object-cover shadow-sm border border-[#E5E0D8]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1A7A6D] rounded-full border-2 border-white" />
            </div>
            <div>
              <span className="font-bold text-[15px] text-[#1C1917] tracking-tight block leading-none">Enviro365</span>
              <span className="text-[11px] font-medium text-[#78716C]">Investment System</span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 text-[#78716C] hover:text-[#1C1917] rounded-[6px] hover:bg-[#E5E0D8]/40 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Investor Context Selector */}
        <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-[8px] border border-[#E5E0D8] space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider">Active Investor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A6D]" />
          </div>
          <select
            value={currentInvestor?.id || 1}
            onChange={(e) => onSelectInvestor(Number(e.target.value))}
            className="w-full bg-[#FAF8F4] text-[#1C1917] text-[12px] font-semibold px-2.5 py-1.5 rounded-[6px] border border-[#E5E0D8] focus:outline-none focus:border-[#1A7A6D] cursor-pointer hover:bg-white transition-colors"
          >
            {investorsList.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.name} (Age {inv.age})
              </option>
            ))}
          </select>
        </div>

        {/* Main Navigation with Hover Tooltips */}
        <nav className="space-y-1">
          <span className="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-wider px-2 block mb-2">Main Menu</span>
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#1A7A6D] font-semibold border border-[#E5E0D8] shadow-[0_2px_6px_rgba(27,38,35,0.04)]'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/60'
                  }`}
                >
                  <span className={isSelected ? 'text-[#1A7A6D]' : 'text-[#78716C]'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#1A7A6D] text-white' : 'bg-[#E8F5F2] text-[#1A7A6D]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isSelected && !item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A6D]" />
                  )}
                </button>

                {/* Hover Tooltip (Desktop only) */}
                {!isMobile && isHovered && !isSelected && (
                  <div className="sidebar-tooltip absolute left-full top-0 ml-3 z-50 w-56 bg-white border border-[#E5E0D8] rounded-[8px] shadow-[0_8px_24px_rgba(27,38,35,0.08)] p-3 pointer-events-none">
                    <p className="text-[11px] font-semibold text-[#1A7A6D] mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A6D]" />
                      {item.label}
                    </p>
                    <p className="text-[11px] text-[#57534E] leading-relaxed">{item.tooltip}</p>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="pt-4 border-t border-[#E5E0D8] px-2 space-y-2">
        <div className="bg-white/60 p-2.5 rounded-[8px] border border-[#E5E0D8]/60 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#78716C]">
            <span>System Status</span>
            <span className="inline-flex items-center gap-1 text-[#1A7A6D] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A6D] animate-pulse" /> Live
            </span>
          </div>
          <p className="text-[10px] text-[#A8A29E]">Spring Boot v4.0.0 • H2 DB</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
