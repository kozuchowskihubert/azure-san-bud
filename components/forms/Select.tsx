'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = false,
    options,
    placeholder,
    className = '',
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-fluid-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-4 py-3 pr-11
              text-fluid-base
              bg-white dark:bg-gray-800
              border-2 rounded-lg
              ${hasError 
                ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' 
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
              }
              focus:outline-none focus:ring-4
              transition-all duration-200
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              appearance-none cursor-pointer
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
            )}
          </div>
        </div>
        
        {error && (
          <p 
            id={`${selectId}-error`}
            className="mt-2 text-fluid-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${selectId}-helper`}
            className="mt-2 text-fluid-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
