import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { HabitModal } from '../components/habits/HabitModal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { getIconComponent } from '../utils/iconMap';
import { CATEGORIES } from '../utils/constants';
import { cn } from '../utils/cn';

export const HabitsManage = () => {
  const {
    habits,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    isLoading,
  } = useHabitStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitForEdit, setSelectedHabitForEdit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleEdit = (habit) => {
    setSelectedHabitForEdit(habit);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (selectedHabitForEdit) {
      await updateHabit(selectedHabitForEdit._id, formData);
    } else {
      await createHabit(formData);
    }
    await fetchHabits();
    setIsModalOpen(false);
  };

  const confirmDelete = async (id) => {
    await deleteHabit(id);
    setDeleteConfirmId(null);
  };

  const filteredHabits =
    selectedCategory === 'All'
      ? habits
      : habits.filter((h) => h.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Habits
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure frequencies, target goals, reminders, and categories
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedHabitForEdit(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          className="font-bold shadow-md shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create New Habit
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits Grid / Empty State */}
      {isLoading && habits.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {selectedCategory === 'All'
              ? 'No habits created yet'
              : `No habits in "${selectedCategory}"`}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {selectedCategory === 'All'
              ? 'Start building your streak today! Add daily or weekly habits to track your consistency.'
              : `You haven't added any habits to this category yet. You can create one or view all habits.`}
          </p>
          <Button
            onClick={() => {
              setSelectedHabitForEdit(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            className="font-bold shadow-md shadow-indigo-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Create Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit) => {
            const stats = habit.stats || {};
            return (
              <Card
                key={habit._id}
                className="flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Color Accent Top Bar */}
                <div
                  style={{ backgroundColor: habit.color }}
                  className="h-1.5 w-full absolute top-0 left-0"
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: `${habit.color}15`,
                          color: habit.color,
                          borderColor: `${habit.color}30`,
                        }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-sm"
                      >
                        {getIconComponent(habit.icon, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                          {habit.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {habit.category}
                        </span>
                      </div>
                    </div>

                    {/* Flame Streak */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{stats.currentStreak || 0}d</span>
                    </div>
                  </div>

                  {habit.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                      {habit.description}
                    </p>
                  )}

                  {/* Target & Schedule Details */}
                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
                    <div className="flex justify-between items-center">
                      <span>Target Goal:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {habit.targetCount} {habit.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Frequency:</span>
                      <span className="font-semibold text-slate-900 dark:text-white capitalize">
                        {habit.frequency.replace('_', ' ')}
                      </span>
                    </div>
                    {habit.isReminderEnabled && habit.reminderTime && (
                      <div className="flex justify-between items-center">
                        <span>Reminder:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {habit.reminderTime}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Consistency Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                      <span>Consistency Rate</span>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {stats.completionRate || 0}%
                      </span>
                    </div>
                    <ProgressBar
                      value={stats.completionRate || 0}
                      max={100}
                      height="h-2"
                      color={
                        (stats.completionRate || 0) >= 80
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600'
                      }
                    />
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="px-6 py-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                  <Button
                    onClick={() => handleEdit(habit)}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmId(habit._id)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Habit?"
        description="Are you sure you want to delete this habit and all its history? This action cannot be undone."
        maxWidth="max-w-sm"
      >
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => confirmDelete(deleteConfirmId)}
          >
            Delete Habit
          </Button>
        </div>
      </Modal>

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        habit={selectedHabitForEdit}
      />
    </div>
  );
};
