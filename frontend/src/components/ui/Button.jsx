import React from 'react';

/**
 * Enviro365 Warm Green Button Component
 * Primary: Forest Teal (#1A7A6D), White text, 40px height, 8px radius
 * Secondary: White background, warm border, hover warm gray
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[8px] transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#1A7A6D]/30 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] cursor-pointer';

  const sizeStyles = {
    sm: 'h-8 px-3 text-[12px] gap-1.5 rounded-[6px]',
    md: 'h-10 px-4 text-[14px] gap-2',
    lg: 'h-10 px-5 text-[14px] gap-2',
  };

  const variantStyles = {
    primary: 'bg-[#1A7A6D] text-white hover:bg-[#13655A] border border-transparent shadow-sm',
    secondary: 'bg-white text-[#1C1917] border border-[#E5E0D8] hover:bg-[#F5F1EC] hover:border-[#D6D1C9]',
    outline: 'bg-transparent text-[#1A7A6D] border border-[#1A7A6D]/30 hover:bg-[#E8F5F2]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] border border-transparent shadow-sm',
    ghost: 'bg-transparent text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2EFE9]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
