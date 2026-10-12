import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StudyLogModal } from '../../components/exam/StudyLogModal';
import { cn } from '../../utils/cn';

export const DailyStudyPlan = () => {
  const {
    overview,
    syllabus,
    studyLogs,
    fetchStudyLogs,
    logStudySession,
  } = useExamStore();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Simple Pomodoro / Study Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState('pomodoro'); // pomodoro (25), deep (50), short (15)

  useEffect(() => {
    fetchStudyLogs();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('⏰ Study session complete! Great job staying focused.');
      setIsLogModalOpen(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleSetTimer = (minutes, type) => {
    setIsTimerRunning(false);
    setTimerType(type);
    setTimerSeconds(minutes * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const todayStats = overview?.todayStats || { hours: 0, questions: 0 };
  const dailyGoalHours = overview?.dailyGoalHours || 4;
  const hoursProgress = Math.min(100, Math.round((parseFloat(todayStats.hours) / dailyGoalHours) * 100));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daily Study Plan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Focus timer, daily targets, and study session log
          </p>
        </div>

        <Button
          onClick={() => setIsLogModalOpen(true)}
          variant="primary"
          className="font-bold shadow-md shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Study Session
        </Button>
      </div>

      {/* Daily Target & Timer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Study Goal Progress Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Today's Study Progress
              </span>
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {todayStats.hours}h
              </span>
              <span className="text-sm font-semibold text-slate-500">
                / {dailyGoalHours}h Goal
              </span>
            </div>

            <ProgressBar
              value={hoursProgress}
              max={100}
              height="h-3"
              color="bg-indigo-600"
            />
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Questions Solved Today:</span>
              <span className="text-slate-900 dark:text-white font-bold">
                {todayStats.questions} Qs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Target Completion:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {hoursProgress}% of Daily Target
              </span>
            </div>
          </div>
        </Card>

        {/* Middle/Right: Pomodoro Study Focus Timer */}
        <Card className="lg:col-span-2 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-white via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
          <div className="flex gap-2 mb-6">
            {[
              { type: 'pomodoro', label: '25m Pomodoro', min: 25 },
              { type: 'deep', label: '50m Deep Focus', min: 50 },
              { type: 'short', label: '15m Revision Sprint', min: 15 },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => handleSetTimer(btn.min, btn.type)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border',
                  timerType === btn.type
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Big Digital Clock Display */}
          <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white font-mono tracking-tight my-2">
            {formatTime(timerSeconds)}
          </div>

          <p className="text-xs text-slate-400 mb-6">
            {isTimerRunning ? '🔥 Focus mode in progress! Keep distractions away.' : 'Ready to start your focused study block.'}
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              variant="primary"
              size="lg"
              className="px-8 font-bold shadow-lg shadow-indigo-500/25"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" /> Start Focus
                </>
              )}
            </Button>

            <Button
              onClick={() => handleSetTimer(timerType === 'deep' ? 50 : timerType === 'short' ? 15 : 25, timerType)}
              variant="outline"
              size="lg"
              className="px-4"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Logged Study Sessions History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Logged Study Sessions
          </CardTitle>
          <span className="text-xs font-semibold text-slate-400">
            {studyLogs.length} Sessions Logged
          </span>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
          {studyLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No study sessions logged yet. Hit "+ Log Study Session" to record your hours!
            </div>
          ) : (
            studyLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {log.durationMinutes}m
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {log.chapterName || log.subjectId.toUpperCase()}
                    </h4>
                    {log.topicCovered && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {log.topicCovered}
                      </p>
                    )}
                    {log.notes && (
                      <p className="text-xs text-slate-400 italic mt-0.5">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 shrink-0">
                  {log.questionsSolved > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-bold">
                      {log.questionsSolved} Qs Solved
                    </span>
                  )}
                  <span>{log.date}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Study Log Modal */}
      <StudyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        subjects={syllabus}
        onLogSession={logStudySession}
      />
    </div>
  );
};
