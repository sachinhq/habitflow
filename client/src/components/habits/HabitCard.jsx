import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Flame,
  MoreVertical,
  Edit2,
  Trash2,
  FileText,
  Clock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { getIconComponent } from '../../utils/iconMap';
import { cn } from '../../utils/cn';
import { HabitNotesModal } from './HabitNotesModal';

export const HabitCard = ({
  habit,
  date,
  onToggle,
  onEdit,
  onDelete,
  onSaveNotes,
  isToggling = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const isCompleted = habit.stats?.isCompletedToday;
  const streak = habit.stats?.currentStreak || 0;
  const bestStreak = habit.stats?.longestStreak || 0;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300',
          isCompleted
            ? 'bg-slate-50/80 dark:bg-slate-900/60 border-emerald-500/30 dark:border-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md'
        )}
      >
        {/* Left Side: Checkbox + Icon + Details */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          {/* Animated Checkbox Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggle(habit._id)}
            disabled={isToggling}
            className={cn(
              'relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 border-2',
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-transparent'
            )}
            aria-label={`Toggle habit ${habit.name}`}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
              </motion.div>
            )}
          </motion.button>

          {/* Habit Icon Avatar */}
          <div
            style={{
              backgroundColor: `${habit.color}15`,
              color: habit.color,
              borderColor: `${habit.color}30`,
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105"
          >
            {getIconComponent(habit.icon, { className: 'w-5 h-5' })}
          </div>

          {/* Habit Meta */}
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={cn(
                  'text-base font-bold text-slate-900 dark:text-white truncate transition-all',
                  isCompleted && 'line-through text-slate-400 dark:text-slate-500'
                )}
              >
                {habit.name}
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {habit.category}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              {/* Target */}
              <span>
                Target: {habit.targetCount} {habit.unit}
              </span>

              {/* Reminder indicator */}
              {habit.isReminderEnabled && habit.reminderTime && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {habit.reminderTime}
                </span>
              )}

              {/* Note indicator */}
              {habit.notes && (
                <span className="inline-flex items-center gap-1 text-indigo-500 font-medium">
                  <FileText className="w-3 h-3" /> Note
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Streak Badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak Flame Badge */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm border transition-all',
              streak > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80 shadow-sm shadow-amber-500/10'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-700/60'
            )}
            title={`Current streak: ${streak} days | Best: ${bestStreak} days`}
          >
            <Flame
              className={cn(
                'w-3.5 h-3.5 sm:w-4 sm:h-4',
                streak > 0
                  ? 'text-amber-500 fill-amber-500 animate-pulse-subtle'
                  : 'text-slate-400'
              )}
            />
            <span>{streak}d</span>
          </div>

          {/* Quick Notes Button */}
          <button
            onClick={() => setShowNotesModal(true)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
            title="Add notes"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Quick Edit */}
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
            title="Edit habit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Quick Delete */}
          <button
            onClick={() => onDelete(habit._id)}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Mobile Menu Dropdown Toggle */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowNotesModal(true);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" /> Notes
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(habit._id);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Notes Modal */}
      <HabitNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        habit={habit}
        date={date}
        initialNotes={habit.notes}
        onSave={(notes) => onSaveNotes(habit._id, notes)}
      />
    </>
  );
};
