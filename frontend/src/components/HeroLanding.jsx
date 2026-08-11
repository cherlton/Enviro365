import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Enviro365 Hero Landing Page
 * Shown when no user is logged in. Warm green and cream theme matching the system design.
 */
export default function HeroLanding() {
  const { setAuthModalOpen } = useAuth();

  return (
    <div className="h-screen bg-[#F9F7F4] font-sans flex flex-col overflow-hidden">
      {/* Top Nav Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E8E3DB] px-6 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/logo-365.png"
              alt="Enviro365 Logo"
              className="w-9 h-9 rounded-[8px] object-cover shadow-sm border border-[#E5E0D8]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1A7A6D] rounded-full border-2 border-white" />
          </div>
          <div>
            <span className="font-bold text-[17px] text-[#1C1917] tracking-tight block leading-tight">Enviro365</span>
            <span className="text-[11px] font-medium text-[#78716C]">Investment Management</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#E8E3DB] text-[#1C1917] hover:bg-[#F5F1EC] font-semibold text-[13px] rounded-[8px] transition-colors shadow-xs cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-semibold text-[13px] rounded-[8px] transition-colors shadow-sm cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-0">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-3 animate-page-entry">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E8F5F2] border border-[#1A7A6D]/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#1A7A6D] animate-pulse" />
              <span className="text-[12px] font-bold text-[#13655A] uppercase tracking-wider">Live Investment Platform</span>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-[32px] sm:text-[42px] font-extrabold text-[#1C1917] leading-[1.1] tracking-tight">
                Manage Your{' '}
                <span className="text-[#1A7A6D]">Investments</span>{' '}
                With Confidence
              </h1>
              <p className="text-[14px] sm:text-[16px] text-[#57534E] leading-relaxed max-w-lg">
                Enviro365 empowers investors and administrators to manage portfolios,
                track financial products, process withdrawal notices, and monitor
                assets under management — all in one unified platform.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Portfolio Management', icon: '📊' },
                { label: 'Withdrawal Processing', icon: '💳' },
                { label: 'Real-Time Analytics', icon: '📈' },
                { label: 'Admin Operations', icon: '🔒' },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="flex items-center gap-1.5 bg-white border border-[#E8E3DB] px-2.5 py-1 rounded-[8px] text-[11px] font-semibold text-[#57534E] shadow-xs"
                >
                  <span>{feat.icon}</span>
                  <span>{feat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2.5 bg-[#1A7A6D] hover:bg-[#13655A] text-white font-bold text-[13px] rounded-[10px] transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Open Your Dashboard →
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2.5 bg-white border border-[#E8E3DB] hover:bg-[#F5F1EC] text-[#1C1917] font-semibold text-[13px] rounded-[10px] transition-all shadow-xs cursor-pointer"
              >
                Admin Access
              </button>
            </div>

            {/* Trust Stats */}
            <div className="flex items-center gap-6 pt-1.5 border-t border-[#E8E3DB]">
              <div>
                <span className="text-[20px] font-extrabold text-[#1A7A6D]">R1.3M+</span>
                <p className="text-[11px] font-medium text-[#78716C]">Assets Under Management</p>
              </div>
              <div className="w-px h-8 bg-[#E8E3DB]" />
              <div>
                <span className="text-[20px] font-extrabold text-[#1C1917]">5+</span>
                <p className="text-[11px] font-medium text-[#78716C]">Financial Products</p>
              </div>
              <div className="w-px h-8 bg-[#E8E3DB]" />
              <div>
                <span className="text-[20px] font-extrabold text-[#1C1917]">99.9%</span>
                <p className="text-[11px] font-medium text-[#78716C]">System Uptime</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center" style={{ animationDelay: '120ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A7A6D]/10 via-transparent to-[#E8F5F2]/40 rounded-[24px] blur-2xl" />
            <div className="relative w-full max-w-lg">
              <img
                src="/hero-illustration.png"
                alt="Enviro365 Investment Platform Illustration"
                className="w-full h-auto rounded-[20px] shadow-xl border border-[#E8E3DB]/60"
              />
              {/* Floating Card Overlay: Portfolio Snapshot */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-[#E8E3DB] rounded-[14px] shadow-lg p-4 min-w-[200px] animate-page-entry" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#E8F5F2] text-[#1A7A6D] flex items-center justify-center font-bold text-[14px]">📈</div>
                  <div>
                    <p className="text-[11px] font-bold text-[#78716C] uppercase">Portfolio Growth</p>
                    <p className="text-[16px] font-extrabold text-[#1A7A6D]">+12.4% YTD</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#E8E3DB] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1A7A6D] to-[#13655A] rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              {/* Floating Card Overlay: Security */}
              <div className="absolute -top-4 -right-4 bg-white border border-[#E8E3DB] rounded-[12px] shadow-lg px-4 py-3 animate-page-entry" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">🔐</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#1C1917]">Role-Based Access</p>
                    <p className="text-[10px] text-[#78716C]">Investor & Admin Roles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E3DB] bg-white/60 py-2.5 px-6 text-center">
        <p className="text-[12px] text-[#78716C]">
          © 2026 Enviro365 Investment Management • Spring Boot 4.0 + React + H2 Database •
          <span className="inline-flex items-center gap-1 ml-1 text-[#1A7A6D] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A7A6D] animate-pulse" /> System Online
          </span>
        </p>
      </footer>
    </div>
  );
}
