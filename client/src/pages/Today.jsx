import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitModal } from '../components/habits/HabitModal';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { CATEGORIES } from '../utils/constants';
import { cn } from '../utils/cn';

export const Today = () => {
  const {
    habits,
    selectedDate,
    setSelectedDate,
    selectedCategory,
    setSelectedCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    fetchHabits,
    toggleHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    saveNotes,
    isToggling,
    isLoading,
  } = useHabitStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitForEdit, setSelectedHabitForEdit] = useState(null);

  useEffect(() => {
    fetchHabits(selectedDate);
  }, [selectedDate]);

  // Date navigation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    // Category match
    if (selectedCategory !== 'All' && habit.category !== selectedCategory) {
      return false;
    }
    // Search match
    if (
      searchQuery &&
      !habit.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !habit.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Status match
    const isCompleted = habit.stats?.isCompletedToday;
    if (filterStatus === 'pending' && isCompleted) return false;
    if (filterStatus === 'completed' && !isCompleted) return false;

    return true;
  });

  const totalToday = habits.length;
  const completedToday = habits.filter((h) => h.stats?.isCompletedToday).length;
  const percentage =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleModalSubmit = async (formData) => {
    if (selectedHabitForEdit) {
      await updateHabit(selectedHabitForEdit._id, formData);
    } else {
      await createHabit(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Date Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formattedDate}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <Button
              onClick={handleTodayClick}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Back to Today
            </Button>
          )}
        </div>

        {/* Progress & Add Habit Button */}
        <div className="flex items-center gap-4">
          <div className="min-w-[130px] hidden sm:block">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Progress</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {completedToday}/{totalToday} ({percentage}%)
              </span>
            </div>
            <ProgressBar
              value={percentage}
              max={100}
              height="h-2"
              color="bg-emerald-500"
            />
          </div>

          <Button
            onClick={() => {
              setSelectedHabitForEdit(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            size="md"
            className="w-full sm:w-auto font-bold shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Habit
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search habits by name or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Status Tabs (All, Pending, Completed) */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            {['all', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all capitalize',
                  filterStatus === status
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habit List Checklist */}
      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No matching habits found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filters'
                : 'You have no habits scheduled for this day.'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                date={selectedDate}
                onToggle={toggleHabit}
                onEdit={(h) => {
                  setSelectedHabitForEdit(h);
                  setIsModalOpen(true);
                }}
                onDelete={deleteHabit}
                onSaveNotes={saveNotes}
                isToggling={isToggling[habit._id]}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        habit={selectedHabitForEdit}
      />
    </div>
  );
};
