import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  BookOpen,
  Clock,
  HelpCircle,
  TrendingUp,
  Plus,
  Flame,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StudyLogModal } from '../../components/exam/StudyLogModal';
import { getStatusBadge } from '../../components/exam/ChapterCard';
import { cn } from '../../utils/cn';

export const ExamDashboard = () => {
  const {
    overview,
    syllabus,
    setActiveSubjectId,
    logStudySession,
    isLoading,
  } = useExamStore();
  const navigate = useNavigate();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const targetExam = overview?.targetExam;
  const overallProgress = overview?.overallProgress || 0;
  const totalChapters = overview?.totalChapters || 0;
  const masteredCount = overview?.masteredCount || 0;
  const inProgressCount = overview?.inProgressCount || 0;
  const totalQuestionsSolved = overview?.totalQuestionsSolved || 0;
  const subjects = overview?.subjects || [];
  const todayStats = overview?.todayStats || { hours: 0, questions: 0 };
  const dailyGoalHours = overview?.dailyGoalHours || 4;

  const handleOpenSubject = (subjectId) => {
    setActiveSubjectId(subjectId);
    navigate('/exam-prep/syllabus');
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/15"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {targetExam?.name || 'SSC CGL'} Prep Mode
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {targetExam?.fullName || 'Combined Graduate Level Examination'}
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Target Date: <span className="font-bold">{targetExam?.targetDate}</span> • {targetExam?.stages || 'Tier 1 & Tier 2'} • Total Marks: {targetExam?.totalMarks || 200}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsLogModalOpen(true)}
              variant="secondary"
              className="bg-white text-indigo-700 hover:bg-slate-50 font-bold shadow-lg shadow-black/10"
            >
              <Clock className="w-4 h-4" /> Log Study Session
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Syllabus Progress */}
        <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Syllabus Completion
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {overallProgress}%
          </div>
          <div className="mt-2">
            <ProgressBar value={overallProgress} max={100} height="h-2" color="bg-indigo-600" />
          </div>
        </Card>

        {/* Mastered Chapters */}
        <Card className="p-5 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Mastered Chapters
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {masteredCount} / {totalChapters}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {inProgressCount} chapters currently in progress
          </p>
        </Card>

        {/* Questions Solved */}
        <Card className="p-5 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Questions Solved
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {totalQuestionsSolved}
          </div>
          <p className="text-xs text-slate-500 mt-1">Practice sets, PYQs & mocks</p>
        </Card>

        {/* Today's Study Time */}
        <Card className="p-5 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Today's Study Goal
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {todayStats.hours}h / {dailyGoalHours}h
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {todayStats.questions} questions logged today
          </p>
        </Card>
      </div>

      {/* 4 Main Subject Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              SSC Subjects Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Track progress across all four core pillars of the SSC examination
            </p>
          </div>
          <Link
            to="/exam-prep/syllabus"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Explore Full Syllabus <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subj) => (
            <Card
              key={subj.subjectId}
              onClick={() => handleOpenSubject(subj.subjectId)}
              className="p-6 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: `${subj.color}15`, color: subj.color }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-105 transition-transform"
                    >
                      {subj.name[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-lg font-black text-slate-900 dark:text-white shrink-0">
                    {subj.overallProgress}%
                  </span>
                </div>

                <div className="mt-3">
                  <ProgressBar
                    value={subj.overallProgress}
                    max={100}
                    height="h-2"
                    color={
                      subj.overallProgress >= 75
                        ? 'bg-emerald-500'
                        : subj.overallProgress >= 40
                        ? 'bg-indigo-600'
                        : 'bg-amber-500'
                    }
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{subj.totalChapters} Chapters</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {subj.masteredCount} Mastered
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {subj.totalPracticeSolved + subj.totalPyqsSolved} Qs Solved
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Studied Chapters */}
      {overview?.recentChapters && overview.recentChapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Continue Where You Left Off
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-800/80 p-0">
            {overview.recentChapters.map((ch) => {
              const statusMeta = getStatusBadge(ch.status);
              const StatusIcon = statusMeta.icon;
              return (
                <div
                  key={ch.chapterId}
                  onClick={() => handleOpenSubject(ch.subjectId)}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      style={{ backgroundColor: `${ch.subjectColor}20`, color: ch.subjectColor }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {ch.subjectName[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {ch.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {ch.subjectName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={cn(
                        'hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border',
                        statusMeta.className
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusMeta.label}
                    </span>
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      {ch.progressPercentage}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Log Study Session Modal */}
      <StudyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        subjects={syllabus.length > 0 ? syllabus : subjects}
        onLogSession={logStudySession}
      />
    </div>
  );
};
