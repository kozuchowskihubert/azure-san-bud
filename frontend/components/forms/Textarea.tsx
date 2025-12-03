'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resizable?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    fullWidth = false,
    resizable = true,
    className = '',
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-fluid-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={`
              w-full px-4 py-3 
              text-fluid-base
              bg-white dark:bg-gray-800
              border-2 rounded-lg
              ${hasError 
                ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' 
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
              }
              focus:outline-none focus:ring-4
              transition-all duration-200
              placeholder:text-gray-400
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${!resizable ? 'resize-none' : 'resize-y'}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
          
          {hasError && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={`${textareaId}-error`}
            className="mt-2 text-fluid-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={`${textareaId}-helper`}
            className="mt-2 text-fluid-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
