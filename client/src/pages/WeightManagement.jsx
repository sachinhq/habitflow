import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  Plus,
  TrendingDown,
  TrendingUp,
  Minus,
  Target,
  Calendar,
  Activity,
  Trash2,
  Settings2,
  Sparkles,
  Award,
  ArrowDownRight,
  ArrowUpRight,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

import { useWeightStore } from '../store/useWeightStore';
import { WeightLogModal } from '../components/weight/WeightLogModal';
import { WeightGoalModal } from '../components/weight/WeightGoalModal';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';

export const WeightManagement = () => {
  const {
    logs,
    chartData,
    stats,
    preferences,
    isLoading,
    isSaving,
    fetchWeightData,
    logWeight,
    deleteWeight,
    updatePreferences,
  } = useWeightStore();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [timeframe, setTimeframe] = useState('all'); // '1m' | '3m' | 'all'

  useEffect(() => {
    fetchWeightData();
  }, []);

  // Safe fallback objects
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeChartData = Array.isArray(chartData) ? chartData : [];
  const safeStats = stats || {};
  const safePreferences = preferences || {};
  const unit = safeStats.preferredUnit || safePreferences.weightUnit || 'kg';
  const hasData = safeLogs.length > 0;

  // Filter chart data by timeframe
  const filteredChartData = useMemo(() => {
    if (safeChartData.length === 0) return [];
    if (timeframe === 'all') return safeChartData;

    const days = timeframe === '1m' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const filtered = safeChartData.filter((d) => d && d.date >= cutoffStr);
    return filtered.length > 0 ? filtered : safeChartData;
  }, [safeChartData, timeframe]);

  // Handle adding weight
  const handleLogSubmit = async (payload) => {
    const res = await logWeight(payload);
    if (res && res.success) {
      setIsLogModalOpen(false);
    }
    return res;
  };

  // Handle goals submit
  const handleGoalSubmit = async (payload) => {
    const res = await updatePreferences(payload);
    if (res && res.success) {
      setIsGoalModalOpen(false);
    }
    return res;
  };

  // Handle delete
  const confirmDelete = async (id) => {
    await deleteWeight(id);
    setDeleteConfirmId(null);
  };

  // Chart domain min/max
  const weightValues = filteredChartData.map((d) => d?.weight).filter((w) => typeof w === 'number');
  if (typeof safePreferences.targetWeight === 'number') {
    weightValues.push(safePreferences.targetWeight);
  }
  const minVal = weightValues.length > 0 ? Math.floor(Math.min(...weightValues) - 2) : 50;
  const maxVal = weightValues.length > 0 ? Math.ceil(Math.max(...weightValues) + 2) : 100;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Health Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
              Health & Vitals
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track weekly weigh-ins, monitor body composition trends, and reach your goals
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => setIsGoalModalOpen(true)}
            variant="outline"
            className="font-bold border-slate-200 dark:border-slate-800"
          >
            <Settings2 className="w-4 h-4" /> Goals & Settings
          </Button>
          <Button
            onClick={() => setIsLogModalOpen(true)}
            variant="primary"
            className="font-bold shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Weekly Weight
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Weight */}
        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Weight
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {safeStats.currentWeight !== null && safeStats.currentWeight !== undefined
                ? safeStats.currentWeight
                : '--'}
            </span>
            <span className="text-sm font-bold text-slate-400">{unit}</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
            {safeStats.weeklyChange ? (
              safeStats.weeklyChange < 0 ? (
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {Math.abs(safeStats.weeklyChange)} {unit}
                </span>
              ) : (
                <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-bold gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{safeStats.weeklyChange} {unit}
                </span>
              )
            ) : (
              <span className="inline-flex items-center text-slate-400 font-bold gap-0.5">
                <Minus className="w-3.5 h-3.5" /> 0.0 {unit}
              </span>
            )}
            <span className="text-slate-400">vs last weigh-in</span>
          </div>
        </Card>

        {/* Card 2: Target Weight */}
        <Card className="p-5 border-l-4 border-l-violet-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Goal
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {safePreferences.targetWeight ? safePreferences.targetWeight : '--'}
            </span>
            <span className="text-sm font-bold text-slate-400">{unit}</span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Goal Progress</span>
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {safePreferences.targetWeight ? `${safeStats.targetProgress || 0}%` : 'Not set'}
              </span>
            </div>
            <ProgressBar
              value={safeStats.targetProgress || 0}
              max={100}
              height="h-1.5"
              color="bg-violet-600"
            />
          </div>
        </Card>

        {/* Card 3: Total Change */}
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Change
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={cn(
                'text-3xl font-black',
                safeStats.totalChange < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : safeStats.totalChange > 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-white'
              )}
            >
              {safeStats.totalChange
                ? `${safeStats.totalChange > 0 ? '+' : ''}${safeStats.totalChange}`
                : '0.0'}
            </span>
            <span className="text-sm font-bold text-slate-400">{unit}</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            {safeStats.startingWeight
              ? `Started at ${safeStats.startingWeight} ${unit}`
              : 'Add weigh-ins to see change'}
          </p>
        </Card>

        {/* Card 4: BMI & Health Index */}
        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Body Mass Index (BMI)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {safeStats.bmi?.value ? safeStats.bmi.value : '--'}
            </span>
            {safeStats.bmi && (
              <span
                className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  safeStats.bmi.category === 'Normal'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                )}
              >
                {safeStats.bmi.category}
              </span>
            )}
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            {safePreferences.heightCm
              ? `Based on ${safePreferences.heightCm} cm height`
              : 'Set height in Settings for BMI'}
          </p>
        </Card>
      </div>

      {/* Weight Progress Chart Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Weight Progress Trend
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual trajectory over time with target goal reference line
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('1m')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                timeframe === '1m'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              Last Month
            </button>
            <button
              onClick={() => setTimeframe('3m')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                timeframe === '3m'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                timeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              All Time
            </button>
          </div>
        </div>

        {filteredChartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[minVal, maxVal]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit={` ${unit}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && payload[0]?.payload) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
                          <p className="font-bold text-slate-800 dark:text-white mb-1">
                            {data.formattedDate}
                          </p>
                          <p className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                            {data.weight} {unit}
                          </p>
                          {data.bodyFat && (
                            <p className="text-slate-500 mt-1">
                              Body Fat: <strong>{data.bodyFat}%</strong>
                            </p>
                          )}
                          {data.waistCm && (
                            <p className="text-slate-500">
                              Waist: <strong>{data.waistCm} cm</strong>
                            </p>
                          )}
                          {data.notes && (
                            <p className="text-slate-600 dark:text-slate-300 italic mt-1 max-w-xs border-t pt-1 border-slate-100 dark:border-slate-800">
                              "{data.notes}"
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {typeof safePreferences.targetWeight === 'number' && (
                  <ReferenceLine
                    y={safePreferences.targetWeight}
                    stroke="#8b5cf6"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${safePreferences.targetWeight} ${unit}`,
                      fill: '#8b5cf6',
                      fontSize: 11,
                      position: 'top',
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGradient)"
                  dot={{
                    r: 4,
                    fill: '#6366f1',
                    strokeWidth: 2,
                    stroke: '#ffffff',
                  }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400">
            <Scale className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No weight chart data yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first weekly weight entry to unlock the trajectory graph!
            </p>
          </div>
        )}
      </Card>

      {/* Weekly Weigh-in History Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Weigh-in History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed log of weekly weigh-ins, body metrics, and notes
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {safeLogs.length} {safeLogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {hasData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Weight</th>
                  <th className="py-3.5 px-6">Weekly Change</th>
                  <th className="py-3.5 px-6">Body Fat / Waist</th>
                  <th className="py-3.5 px-6">Notes</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {safeLogs.map((entry) => (
                  <tr
                    key={entry._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{entry.formattedDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {entry.weight} <span className="text-xs font-bold text-slate-400">{entry.unit || unit}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {entry.changeFromPrev ? (
                        entry.changeFromPrev < 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {Math.abs(entry.changeFromPrev)} {entry.unit || unit}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +{entry.changeFromPrev} {entry.unit || unit}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <Minus className="w-3.5 h-3.5" /> Baseline / Same
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {entry.bodyFat ? `${entry.bodyFat}% BF` : '--'}
                      {entry.waistCm ? ` • ${entry.waistCm} cm` : ''}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {entry.notes || <span className="text-slate-300 dark:text-slate-600 italic">None</span>}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteConfirmId(entry._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No weekly weigh-ins yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Track your weight weekly to see your trends, BMI, and progress towards your target weight goal.
            </p>
            <Button
              onClick={() => setIsLogModalOpen(true)}
              variant="primary"
              className="font-bold shadow-md shadow-indigo-500/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Your First Weigh-in
            </Button>
          </div>
        )}
      </Card>

      {/* Log Weight Modal */}
      <WeightLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleLogSubmit}
        initialUnit={unit}
        lastRecordedWeight={safeStats.currentWeight}
        isLoading={isSaving}
      />

      {/* Goal & Preferences Modal */}
      <WeightGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
        preferences={safePreferences}
        isLoading={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Weigh-in Entry?"
        description="Are you sure you want to remove this weight record? This will update your charts and statistics."
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
            Delete Entry
          </Button>
        </div>
      </Modal>
    </div>
  );
};
