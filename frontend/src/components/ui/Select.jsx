import React from 'react';

/**
 * Enviro365 Warm Green Select Component
 * Height 40px, warm border #E5E0D8, Radius 8px, Focus border teal #1A7A6D
 */
export const Select = ({
  label,
  options = [],
  error,
  helperText,
  id,
  className = '',
  required = false,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[12px] font-medium text-[#1C1917]">
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`h-10 w-full px-3 bg-white border rounded-[8px] text-[14px] text-[#1C1917] transition-all duration-150 focus:outline-none cursor-pointer ${
          error
            ? 'border-[#DC2626] focus:border-[#DC2626]'
            : 'border-[#E5E0D8] hover:border-[#D6D1C9] focus:border-[#1A7A6D] focus:ring-1 focus:ring-[#1A7A6D]/20'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="text-[#A8A29E]">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-[#1C1917]">
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-[11px] font-medium text-[#DC2626] mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#78716C] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
