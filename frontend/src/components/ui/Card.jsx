import React from 'react';

/**
 * Enviro365 Warm Green Card Component
 * White background, 1px solid #E5E0D8 warm border, 10px radius, gentle warm shadow
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-[#E5E0D8] rounded-[10px] shadow-[0_2px_8px_rgba(27,38,35,0.03)] overflow-hidden transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-b border-[#E5E0D8] flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-[16px] font-semibold text-[#1C1917] tracking-tight flex items-center gap-2 ${className}`}>
    {children}
  </h3>
);

export const CardSubtitle = ({ children, className = '' }) => (
  <p className={`text-[12px] font-medium text-[#57534E] mt-0.5 ${className}`}>
    {children}
  </p>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-5 py-3 border-t border-[#E5E0D8] bg-[#F7F5F0] rounded-b-[10px] ${className}`}>
    {children}
  </div>
);

export default Card;
