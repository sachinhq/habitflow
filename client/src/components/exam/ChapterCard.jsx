import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Trophy,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../utils/cn';

export const getStatusBadge = (status) => {
  switch (status) {
    case 'mastered':
      return {
        label: 'Mastered',
        icon: Trophy,
        className: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
      };
    case 'completed':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700',
      };
    case 'revision':
      return {
        label: 'Needs Revision',
        icon: RotateCcw,
        className: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
      };
    case 'practicing':
      return {
        label: 'Practicing',
        icon: HelpCircle,
        className: 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-700',
      };
    case 'learning':
      return {
        label: 'Learning',
        icon: BookOpen,
        className: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700',
      };
    default:
      return {
        label: 'Not Started',
        icon: Sparkles,
        className: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
      };
  }
};

export const ChapterCard = ({ chapter, onClick }) => {
  const statusMeta = getStatusBadge(chapter.status);
  const StatusIcon = statusMeta.icon;
  const progress = chapter.progressPercentage || 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(chapter)}
      className={cn(
        'group cursor-pointer rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between',
        chapter.status === 'mastered'
          ? 'bg-gradient-to-br from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md'
      )}
    >
      <div>
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            {chapter.category || 'General'}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs',
              statusMeta.className
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {statusMeta.label}
          </span>
        </div>

        {/* Chapter Title */}
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {chapter.name}
        </h3>

        {/* Weightage indicator */}
        {chapter.weightage && (
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
            Weightage: <span className="text-indigo-500 font-bold">{chapter.weightage}</span>
          </span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
            <span>Weighted Progress</span>
            <span
              className={cn(
                'font-bold',
                progress >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-800 dark:text-slate-200'
              )}
            >
              {progress}%
            </span>
          </div>
          <ProgressBar
            value={progress}
            max={100}
            height="h-2"
            color={
              progress === 100
                ? 'bg-emerald-500'
                : progress >= 60
                ? 'bg-indigo-600'
                : 'bg-amber-500'
            }
          />
        </div>

        {/* Mini Stats Badges */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-center">
          <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Practice: <span className="font-bold text-indigo-600 dark:text-indigo-400">{chapter.practiceSolved || 0}/{chapter.practiceTarget || 100}</span>
          </div>
          <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            PYQs: <span className="font-bold text-emerald-600 dark:text-emerald-400">{chapter.pyqsSolved || 0}/{chapter.pyqsTarget || 50}</span>
          </div>
          <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Revision: <span className="font-bold text-amber-600 dark:text-amber-400">{chapter.revisionCount || 0}x</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
