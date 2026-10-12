import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  Check,
  X,
  Minus,
  Sparkles,
  Trophy,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getIconComponent } from '../utils/iconMap';
import { cn } from '../utils/cn';

export const WeeklyView = () => {
  const [currentWeekDate, setCurrentWeekDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [weeklyData, setWeeklyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeeklyData = async (dateStr) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/analytics/weekly?date=${dateStr}`);
      setWeeklyData(res.data.data);
    } catch (err) {
      console.error('Error fetching weekly data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData(currentWeekDate);
  }, [currentWeekDate]);

  const handlePrevWeek = () => {
    const d = new Date(currentWeekDate + 'T00:00:00');
    d.setDate(d.getDate() - 7);
    setCurrentWeekDate(d.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekDate + 'T00:00:00');
    d.setDate(d.getDate() + 7);
    setCurrentWeekDate(d.toISOString().split('T')[0]);
  };

  const handleCurrentWeek = () => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentWeekDate(today);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const formatWeekRange = () => {
    if (!weeklyData || !weeklyData.startDate) return '';
    const start = new Date(weeklyData.startDate + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = new Date(weeklyData.endDate + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} – ${end}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <CalendarRange className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatWeekRange()}
            </span>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next Week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <Button
            onClick={handleCurrentWeek}
            variant="outline"
            size="sm"
            className="text-xs ml-1"
          >
            Current Week
          </Button>
        </div>

        {/* Weekly Completion Score Pill */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Weekly Score:</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
            {weeklyData?.weeklyCompletionRate || 0}%
          </span>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Completed
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {weeklyData?.totalCompleted || 0}
          </div>
          <span className="text-xs text-slate-500">habit check-offs</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Missed
          </span>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {weeklyData?.missedHabits || 0}
          </div>
          <span className="text-xs text-slate-500">scheduled habits</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Habit
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {weeklyData?.bestPerformingHabit?.name || 'All Equal'}
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Top Consistency
          </span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-400" /> Focus Habit
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {weeklyData?.leastConsistentHabit?.name || 'Keep Going'}
          </div>
          <span className="text-xs text-slate-500">needs extra attention</span>
        </Card>
      </div>

      {/* Habits vs Days Matrix Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Weekly Habit Matrix</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual completion breakdown across Monday to Sunday
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading matrix...</div>
          ) : !weeklyData?.habitMatrix || weeklyData.habitMatrix.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No active habits found.</div>
          ) : (
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6 w-56">Habit</th>
                  {weeklyData.dailyBreakdown.map((d) => {
                    const isCurrentDay = d.date === todayStr;
                    return (
                      <th
                        key={d.date}
                        className={cn(
                          'py-4 px-3 text-center min-w-[70px]',
                          isCurrentDay && 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                        )}
                      >
                        <div className="text-xs font-bold">{d.dayName}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {d.date.split('-')[2]}
                        </div>
                      </th>
                    );
                  })}
                  <th className="py-4 px-6 text-right w-28">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {weeklyData.habitMatrix.map(({ habit, days, weeklyRate }) => (
                  <tr
                    key={habit._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Habit Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            backgroundColor: `${habit.color}15`,
                            color: habit.color,
                          }}
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        >
                          {getIconComponent(habit.icon, { className: 'w-4 h-4' })}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {habit.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {habit.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 7 Day Indicators */}
                    {days.map((day) => {
                      const isFuture = day.date > todayStr;
                      return (
                        <td key={day.date} className="py-4 px-3 text-center">
                          {!day.isScheduled ? (
                            <div className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-700">
                              <Minus className="w-4 h-4" />
                            </div>
                          ) : day.completed ? (
                            <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : isFuture ? (
                            <div className="w-8 h-8 mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-600" />
                          ) : (
                            <div className="w-8 h-8 mx-auto rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                              <X className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Weekly Rate Progress */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {weeklyRate}%
                        </span>
                        <div className="w-12">
                          <ProgressBar
                            value={weeklyRate}
                            max={100}
                            height="h-1.5"
                            color={
                              weeklyRate >= 80
                                ? 'bg-emerald-500'
                                : weeklyRate >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
