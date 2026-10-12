import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Zap,
  Flame,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';

export const Analytics = () => {
  const [daysCount, setDaysCount] = useState(30);
  const [trendsData, setTrendsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrends = async (days) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/analytics/trends?days=${days}`);
      setTrendsData(res.data.data);
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(daysCount);
  }, [daysCount]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4', '#f43f5e'];

  return (
    <div className="space-y-8">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data-driven patterns, category distributions, and consistency trends
          </p>
        </div>

        {/* Timeframe selector pills */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          {[
            { label: 'Last 7 Days', value: 7 },
            { label: 'Last 30 Days', value: 30 },
            { label: 'Last 90 Days', value: 90 },
          ].map((tf) => (
            <button
              key={tf.value}
              onClick={() => setDaysCount(tf.value)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all',
                daysCount === tf.value
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Avg. Completion
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {trendsData?.averageCompletionRate || 0}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Across all scheduled dates</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Total Completions
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {trendsData?.totalCompleted || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Successfully logged habits</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Scheduled Reps
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {trendsData?.totalScheduled || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">Total habit expectations</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Active Scope
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {daysCount} Days
          </div>
          <p className="text-xs text-slate-500 mt-1">Current analysis window</p>
        </Card>
      </div>

      {/* Main Charts Row 1: Daily Completion Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Completion Rate Trend (%)</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical day-by-day consistency curve over the selected timeframe
          </p>
        </CardHeader>
        <CardContent className="h-80 sm:h-96 pt-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Loading charts...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData?.completionTrends || []}>
                <defs>
                  <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
                          <p className="font-bold mb-1">{data.formattedDate}</p>
                          <p className="text-indigo-400 font-semibold">
                            Rate: {data.rate}%
                          </p>
                          <p className="text-slate-300">
                            Completed: {data.completed} of {data.scheduled}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#completionGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Charts Row 2: Category Breakdown Donut & Day of Week Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie / Donut */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Habit completion distribution across life categories
            </p>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-center">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                Loading categories...
              </div>
            ) : !trendsData?.categoryBreakdown || trendsData.categoryBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trendsData.categoryBreakdown}
                    dataKey="totalCompleted"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                  >
                    {trendsData.categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
                            <p className="font-bold text-white">{data.name}</p>
                            <p className="text-emerald-400 font-semibold mt-0.5">
                              {data.totalCompleted} completions ({data.rate}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Day of Week Consistency Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Consistency by Day of the Week</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Average completion percentage for Monday through Sunday
            </p>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                Loading day stats...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsData?.dayStats || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} unit="%" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
                            <p className="font-bold">{data.day}</p>
                            <p className="text-indigo-400 font-semibold mt-0.5">
                              Average: {data.rate}%
                            </p>
                            <p className="text-slate-300">
                              {data.completed} completed of {data.scheduled}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="rate"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
