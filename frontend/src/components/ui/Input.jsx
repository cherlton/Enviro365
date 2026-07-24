import React from 'react';

/**
 * Enviro365 Warm Green Input Component
 * Height 40px, warm border #E5E0D8, Radius 8px, Focus border teal #1A7A6D
 */
export const Input = ({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[12px] font-medium text-[#1C1917] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#DC2626]">*</span>}
          </span>
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`h-10 w-full px-3 bg-white border rounded-[8px] text-[14px] text-[#1C1917] placeholder-[#A8A29E] transition-all duration-150 focus:outline-none ${
          error
            ? 'border-[#DC2626] focus:border-[#DC2626]'
            : 'border-[#E5E0D8] hover:border-[#D6D1C9] focus:border-[#1A7A6D] focus:ring-1 focus:ring-[#1A7A6D]/20'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[11px] font-medium text-[#DC2626] mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#78716C] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
