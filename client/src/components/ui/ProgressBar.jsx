import React from 'react';
import { cn } from '../../utils/cn';

export const ProgressBar = ({
  value = 0,
  max = 100,
  height = 'h-2.5',
  color = 'bg-indigo-600',
  trackColor = 'bg-slate-100 dark:bg-slate-800',
  className,
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', trackColor, height)}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
