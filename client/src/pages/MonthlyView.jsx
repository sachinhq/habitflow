import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Flame,
} from 'lucide-react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { getIconComponent } from '../utils/iconMap';
import { cn } from '../utils/cn';

export const MonthlyView = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [monthlyData, setMonthlyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  const fetchMonthly = async (year, month) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/analytics/monthly?year=${year}&month=${month}`);
      setMonthlyData(res.data.data);
    } catch (err) {
      console.error('Error fetching monthly heatmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthly(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Helper for heatmap cell color
  const getIntensityClass = (intensity, rate) => {
    if (intensity === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-400';
    }
    if (intensity === 1) {
      return 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300';
    }
    if (intensity === 2) {
      return 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100';
    }
    if (intensity === 3) {
      return 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
    }
    // Intensity 4 (100%)
    return 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/25';
  };

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Month Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {monthNames[currentMonth - 1]} {currentYear}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <Button
            onClick={handleCurrentMonth}
            variant="outline"
            size="sm"
            className="text-xs ml-1"
          >
            Current Month
          </Button>
        </div>

        {/* Monthly Score Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Monthly Average:</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
            {monthlyData?.monthlyRate || 0}%
          </span>
        </div>
      </div>

      {/* Monthly KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Check-offs
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {monthlyData?.totalCompleted || 0}
          </div>
          <span className="text-xs text-slate-500">habits completed</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Missed
          </span>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {monthlyData?.totalMissed || 0}
          </div>
          <span className="text-xs text-slate-500">habits missed</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Monthly Rate
          </span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {monthlyData?.monthlyRate || 0}%
          </div>
          <span className="text-xs text-slate-500">overall consistency</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Active Days
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {monthlyData?.heatmap?.filter((d) => d.completedCount > 0).length || 0}
          </div>
          <span className="text-xs text-slate-500">days with completions</span>
        </Card>
      </div>

      {/* GitHub-Style Contribution Heatmap Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Activity Heatmap</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any day cell to inspect detailed completion breakdown
            </p>
          </div>

          {/* Intensity Legend */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-300 dark:bg-emerald-800 border border-emerald-400" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-700" />
            <span>More</span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading monthly heatmap...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-slate-400 uppercase py-1"
                >
                  {day}
                </div>
              ))}

              {/* Offset days for the 1st day of the month */}
              {Array.from({
                length: new Date(currentYear, currentMonth - 1, 1).getDay(),
              }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-14 sm:h-20 opacity-0" />
              ))}

              {/* Month Days */}
              {monthlyData?.heatmap?.map((dayItem) => {
                const dayNum = parseInt(dayItem.date.split('-')[2], 10);
                const isCurrent = dayItem.date === todayStr;

                return (
                  <motion.button
                    key={dayItem.date}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDayDetail(dayItem)}
                    className={cn(
                      'relative h-14 sm:h-20 rounded-2xl border p-2 flex flex-col justify-between items-start transition-all cursor-pointer text-left',
                      getIntensityClass(dayItem.intensity, dayItem.rate),
                      isCurrent && 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 font-black'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{dayNum}</span>
                      {dayItem.rate === 100 && dayItem.scheduledCount > 0 && (
                        <Sparkles className="w-3 h-3 text-amber-300" />
                      )}
                    </div>

                    <div className="text-[10px] font-semibold opacity-90 truncate w-full">
                      {dayItem.scheduledCount > 0 ? (
                        <span>
                          {dayItem.completedCount}/{dayItem.scheduledCount} ({dayItem.rate}%)
                        </span>
                      ) : (
                        <span className="opacity-40">-</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Detail Modal */}
      <Modal
        isOpen={!!selectedDayDetail}
        onClose={() => setSelectedDayDetail(null)}
        title={
          selectedDayDetail
            ? new Date(selectedDayDetail.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : ''
        }
        description={`Daily Completion: ${selectedDayDetail?.rate || 0}% (${selectedDayDetail?.completedCount || 0}/${selectedDayDetail?.scheduledCount || 0})`}
        maxWidth="max-w-md"
      >
        {selectedDayDetail && (
          <div className="space-y-5">
            {/* Completed Habits */}
            <div>
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Completed (
                {selectedDayDetail.completedHabits.length})
              </h4>
              {selectedDayDetail.completedHabits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No habits completed on this date.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDayDetail.completedHabits.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <div
                        style={{ backgroundColor: `${h.color}20`, color: h.color }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      >
                        {getIconComponent(h.icon, { className: 'w-3.5 h-3.5' })}
                      </div>
                      <span className="truncate">{h.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missed Habits */}
            {selectedDayDetail.missedHabits.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Missed (
                  {selectedDayDetail.missedHabits.length})
                </h4>
                <div className="space-y-2">
                  {selectedDayDetail.missedHabits.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <div
                        style={{ backgroundColor: `${h.color}20`, color: h.color }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      >
                        {getIconComponent(h.icon, { className: 'w-3.5 h-3.5' })}
                      </div>
                      <span className="truncate">{h.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedDayDetail(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
