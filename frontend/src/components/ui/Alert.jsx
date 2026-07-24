import React from 'react';

/**
 * Antigravity Premium Fintech Alert Component
 * Compact, clean alert box for business rule warnings and errors
 */
export const Alert = ({ type = 'info', title, message, errorCode, onClose, className = '' }) => {
  const styles = {
    error: {
      bg: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
      badge: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]',
    },
    success: {
      bg: 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]',
      badge: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
    },
    warning: {
      bg: 'bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]',
      badge: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]',
    },
    info: {
      bg: 'bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]',
      badge: 'bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]',
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div className={`p-3.5 rounded-[8px] border text-[13px] transition-all duration-150 ${current.bg} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{title}</span>
            {errorCode && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${current.badge}`}>
                {errorCode}
              </span>
            )}
          </div>
          {message && <p className="text-[12px] mt-1 opacity-90 leading-normal">{message}</p>}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#121212] transition-colors p-0.5 rounded hover:bg-black/5"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
