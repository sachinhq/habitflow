import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-200',
        hover && 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-6 py-5 border-b border-slate-100 dark:border-slate-800/80', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-lg font-bold text-slate-900 dark:text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p className={cn('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('px-6 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80', className)}
      {...props}
    >
      {children}
    </div>
  );
};
