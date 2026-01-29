'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/30 shadow-md hover:shadow-lg active:scale-[0.98]',
      secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500/30 shadow-md hover:shadow-lg active:scale-[0.98]',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-blue-500/30 active:scale-[0.98]',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500/20',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 shadow-md hover:shadow-lg active:scale-[0.98]',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-fluid-sm',
      md: 'px-5 py-2.5 text-fluid-base',
      lg: 'px-6 py-3 text-fluid-lg',
      xl: 'px-8 py-4 text-fluid-xl',
    };
    
    const isDisabled = disabled || loading;
    
    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        
        <span>{children}</span>
        
        {!loading && rightIcon && (
          <span aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
