import React from 'react';

/**
 * Enviro365 Warm Green Badge Component
 * Soft warm-toned status pills
 */
export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variantMap = {
    APPROVED: 'bg-[#E8F5F2] text-[#1A7A6D] border-[#BDE8DF]',
    PENDING: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    REJECTED: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    COMPLETED: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',

    RETIREMENT: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
    SAVINGS: 'bg-[#E8F5F2] text-[#1A7A6D] border-[#BDE8DF]',
    TAX_FREE: 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]',

    primary: 'bg-[#E8F5F2] text-[#1A7A6D] border-[#BDE8DF]',
    secondary: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    neutral: 'bg-[#F5F1EC] text-[#57534E] border-[#E5E0D8]',
  };

  const style = variantMap[variant] || variantMap.neutral;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-medium border ${style} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
