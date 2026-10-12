import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Plus,
  Sparkles,
  Award,
  ArrowRight,
  Target,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitModal } from '../components/habits/HabitModal';
import { Link } from 'react-router-dom';
import { getMotivationalMessage, MOTIVATIONAL_QUOTES } from '../utils/constants';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const {
    habits,
    overview,
    fetchHabits,
    fetchOverview,
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
  const [randomQuote, setRandomQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    fetchHabits();
    fetchOverview();
    const quoteIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setRandomQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  const todayCompleted = overview?.todayCompleted || 0;
  const todayTotal = overview?.todayTotal || habits.length || 0;
  const todayPercentage = overview?.todayCompletionPercentage || 0;
  const currentStreak = overview?.currentStreak || 0;
  const bestStreak = overview?.bestStreak || 0;
  const weeklyRate = overview?.weeklyCompletionPercentage || 0;
  const monthlyRate = overview?.monthlyCompletionPercentage || 0;

  const motivational = getMotivationalMessage(todayPercentage, currentStreak);

  const handleOpenCreateModal = () => {
    setSelectedHabitForEdit(null);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setSelectedHabitForEdit(habit);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (selectedHabitForEdit) {
      await updateHabit(selectedHabitForEdit._id, formData);
    } else {
      await createHabit(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Motivational Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/15"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {motivational.badge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {motivational.title}
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              "{randomQuote.quote}" — <span className="font-semibold">{randomQuote.author}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleOpenCreateModal}
              variant="secondary"
              className="bg-white text-indigo-700 hover:bg-slate-50 font-bold shadow-lg shadow-black/10 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Habit
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Colorful Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {currentStreak}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                days in a row
              </span>
            </div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 font-medium">
              🏆 Personal best: {bestStreak} days
            </p>
          </div>
        </motion.div>

        {/* Card 2: Today's Completion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Today's Progress
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {todayCompleted}/{todayTotal}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                completed
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={todayPercentage}
                max={100}
                color="bg-emerald-500"
                height="h-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Weekly Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Weekly Rate
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {weeklyRate}%
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                consistency
              </span>
            </div>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80 mt-1 font-medium">
              📅 Mon - Sun completion
            </p>
          </div>
        </motion.div>

        {/* Card 4: Monthly Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Monthly Rate
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {monthlyRate}%
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                monthly score
              </span>
            </div>
            <p className="text-xs text-purple-700/80 dark:text-purple-400/80 mt-1 font-medium">
              📈 Active calendar heat
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Today's Habits Checklist + Side Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Today Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Today's Habits
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check off items as you complete them
              </p>
            </div>
            <Link
              to="/today"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
            >
              Open Full Checklist <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Habit Items */}
          {habits.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                No habits added yet
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Start small. Pick 1 or 2 high-impact habits you want to perform consistently.
              </p>
              <Button onClick={handleOpenCreateModal} variant="primary" size="sm">
                <Plus className="w-4 h-4" /> Create Your First Habit
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  date={new Date().toISOString().split('T')[0]}
                  onToggle={toggleHabit}
                  onEdit={handleEditHabit}
                  onDelete={deleteHabit}
                  onSaveNotes={saveNotes}
                  isToggling={isToggling[habit._id]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side Widgets: Achievements & Consistency */}
        <div className="space-y-6">
          {/* Recent Badges Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-base">Achievements</CardTitle>
              </div>
              <Link
                to="/achievements"
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview?.recentAchievements && overview.recentAchievements.length > 0 ? (
                overview.recentAchievements.map((badge) => (
                  <div
                    key={badge._id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  Complete habits to unlock milestone badges!
                </p>
              )}
            </CardContent>
          </Card>

          {/* SSC Exam Preparation Widget */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-700/50 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/30 text-amber-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm tracking-tight">
                  SSC Exam Prep
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                SSC CGL
              </span>
            </div>
            <p className="text-xs text-indigo-100/90 leading-relaxed mb-4">
              Track 120+ chapters across Quantitative Aptitude, Reasoning, English, and General Awareness.
            </p>
            <Link to="/exam-prep">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              >
                Open Study Tracker <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Quick Links CTA */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/40 shadow-md">
            <h4 className="font-bold text-sm mb-1.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Dive into Analytics
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Explore your GitHub-style monthly completion heatmap and weekly breakdown charts.
            </p>
            <div className="flex gap-2">
              <Link to="/monthly" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs text-white border-white/20 hover:bg-white/10">
                  Heatmap
                </Button>
              </Link>
              <Link to="/analytics" className="flex-1">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Charts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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
