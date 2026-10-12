import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Trophy,
  BookOpen,
  TrendingUp,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const ExamAnalytics = () => {
  const { analytics, overview, fetchAnalytics } = useExamStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const subjectStats = analytics?.subjectStats || [];
  const masteryDistribution = analytics?.masteryDistribution || [];
  const studyTrend = analytics?.studyTrend || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Exam Preparation Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visual insights on subject readiness, mastery distributions, and study consistency
        </p>
      </div>

      {/* Row 1: Subject Readiness Bar Chart & Mastery Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Readiness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Subject Syllabus Completion (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} unit="%" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs border border-slate-800 shadow-xl">
                          <p className="font-bold">{data.fullName}</p>
                          <p className="text-indigo-400 font-semibold mt-0.5">
                            Completion: {data.completion}%
                          </p>
                          <p className="text-emerald-400 font-semibold">
                            Mastered: {data.mastered} of {data.total} chapters
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completion" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chapter Mastery Status Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-500" />
              Chapter Mastery Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            {masteryDistribution.length === 0 ? (
              <div className="text-slate-400 text-sm">Loading mastery distribution...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={masteryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {masteryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs border border-slate-800 shadow-xl">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-indigo-300 font-semibold mt-0.5">
                              {data.value} Chapters
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
      </div>

      {/* Row 2: Study Hours & Questions Solved Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Study Hours & Questions Solved Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          {studyTrend.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Log study sessions in "Daily Study Plan" to see your consistency curve here!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyTrend}>
                <defs>
                  <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis unit="h" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs border border-slate-800 shadow-xl">
                          <p className="font-bold">{data.formattedDate}</p>
                          <p className="text-emerald-400 font-semibold mt-0.5">
                            Study Time: {data.hours} Hours
                          </p>
                          <p className="text-indigo-400 font-semibold">
                            Questions: {data.questions} Qs
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#studyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
