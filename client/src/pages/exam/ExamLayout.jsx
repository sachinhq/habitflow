import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  RotateCcw,
  BarChart3,
  Award,
  ChevronDown,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { ExamSelectorModal } from '../../components/exam/ExamSelectorModal';
import { cn } from '../../utils/cn';

export const ExamLayout = () => {
  const {
    exams,
    targetExamId,
    overview,
    fetchExams,
    fetchOverview,
    fetchSyllabus,
    setTargetExam,
  } = useExamStore();

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchOverview();
    fetchSyllabus();
  }, []);

  const currentExam = overview?.targetExam || exams.find((e) => e.examId === targetExamId);

  const tabs = [
    { to: '/exam-prep', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/exam-prep/syllabus', label: 'Syllabus & Chapters', icon: BookOpen },
    { to: '/exam-prep/daily-plan', label: 'Daily Study Plan', icon: Calendar },
    { to: '/exam-prep/practice', label: 'Revision & PYQs', icon: RotateCcw },
    { to: '/exam-prep/analytics', label: 'Progress Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Target Exam Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Exam
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="flex items-center gap-1.5 font-black text-lg text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
            >
              <span>{currentExam?.name || 'SSC CGL'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Exam Countdown & Progress Pill */}
        <div className="flex items-center gap-3">
          {currentExam?.daysRemaining !== null && currentExam?.daysRemaining !== undefined && (
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <span>⏳</span>
              <span>{currentExam.daysRemaining} Days to Target Exam</span>
            </div>
          )}

          <button
            onClick={() => setIsExamModalOpen(true)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
          >
            Change Exam
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border-b-2 -mb-px',
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Main Outlet */}
      <div>
        <Outlet />
      </div>

      {/* Exam Selector Modal */}
      <ExamSelectorModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        exams={exams}
        targetExamId={targetExamId}
        onSelectExam={setTargetExam}
      />
    </div>
  );
};
