import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(
  ({ className, type = 'text', error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm',
            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ className, error, label, helperText, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm resize-none',
            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(
  ({ className, error, label, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm cursor-pointer',
            error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
