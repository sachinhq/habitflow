import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Plus,
  Trash2,
  Trophy,
  BookOpen,
  HelpCircle,
  FileText,
  RotateCcw,
  Target,
  Sparkles,
  Save,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Input, Textarea, Select } from '../ui/Input';
import { AddCheckpointModal } from './AddCheckpointModal';
import { getStatusBadge } from './ChapterCard';
import { cn } from '../../utils/cn';

export const ChapterModal = ({
  isOpen,
  onClose,
  chapter,
  onToggleCheckpoint,
  onAddCheckpoint,
  onDeleteCheckpoint,
  onUpdateStats,
}) => {
  const [activeTab, setActiveTab] = useState('checkpoints');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit stats state
  const [practiceSolved, setPracticeSolved] = useState(0);
  const [practiceTarget, setPracticeTarget] = useState(100);
  const [pyqsSolved, setPyqsSolved] = useState(0);
  const [pyqsTarget, setPyqsTarget] = useState(50);
  const [revisionCount, setRevisionCount] = useState(0);
  const [mockQuestionsSolved, setMockQuestionsSolved] = useState(0);
  const [mockQuestionsTarget, setMockQuestionsTarget] = useState(50);
  const [status, setStatus] = useState('not_started');
  const [notes, setNotes] = useState('');
  const [isSavingStats, setIsSavingStats] = useState(false);

  useEffect(() => {
    if (chapter) {
      setPracticeSolved(chapter.practiceSolved || 0);
      setPracticeTarget(chapter.practiceTarget || 100);
      setPyqsSolved(chapter.pyqsSolved || 0);
      setPyqsTarget(chapter.pyqsTarget || 50);
      setRevisionCount(chapter.revisionCount || 0);
      setMockQuestionsSolved(chapter.mockQuestionsSolved || 0);
      setMockQuestionsTarget(chapter.mockQuestionsTarget || 50);
      setStatus(chapter.status || 'not_started');
      setNotes(chapter.notes || '');
    }
  }, [chapter, isOpen]);

  if (!chapter) return null;

  const checkpoints = chapter.checkpoints || [];
  const progress = chapter.progressPercentage || 0;
  const statusMeta = getStatusBadge(status);
  const StatusIcon = statusMeta.icon;

  const categories = [
    { id: 'learn', label: '📖 Learn', icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'practice', label: '✍️ Practice', icon: HelpCircle, color: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'pyq', label: '📝 PYQs', icon: FileText, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'revision', label: '🔄 Revision', icon: RotateCcw, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'test', label: '🎯 Test', icon: Target, color: 'text-rose-600 dark:text-rose-400' },
    { id: 'custom', label: '✨ Custom', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const handleSaveStats = async () => {
    setIsSavingStats(true);
    await onUpdateStats(chapter.chapterId || chapter.id, {
      practiceSolved: parseInt(practiceSolved, 10),
      practiceTarget: parseInt(practiceTarget, 10),
      pyqsSolved: parseInt(pyqsSolved, 10),
      pyqsTarget: parseInt(pyqsTarget, 10),
      revisionCount: parseInt(revisionCount, 10),
      mockQuestionsSolved: parseInt(mockQuestionsSolved, 10),
      mockQuestionsTarget: parseInt(mockQuestionsTarget, 10),
      status,
      notes,
    });
    setIsSavingStats(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-3xl"
        title={
          <div className="flex items-center gap-3">
            <span>{chapter.name}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border',
                statusMeta.className
              )}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusMeta.label}
            </span>
          </div>
        }
        description={`Subject: ${chapter.subjectName || 'General'} • Category: ${chapter.category || 'General'}`}
      >
        <div className="space-y-6">
          {/* Top Progress & Mastery Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-emerald-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/30 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chapter Completion Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {progress}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Weighted Checkpoint Progress
                  </span>
                </div>
              </div>

              {progress === 100 ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25">
                  <Trophy className="w-4 h-4" /> 100% MASTERED
                </div>
              ) : (
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {checkpoints.filter((cp) => cp.isCompleted).length} of {checkpoints.length} Checkpoints Done
                </div>
              )}
            </div>

            <ProgressBar
              value={progress}
              max={100}
              height="h-3"
              color={
                progress === 100
                  ? 'bg-emerald-500'
                  : progress >= 60
                  ? 'bg-indigo-600'
                  : 'bg-amber-500'
              }
            />
          </div>

          {/* Sub Navigation Tabs: Checkpoints vs Practice Stats */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('checkpoints')}
              className={cn(
                'px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2',
                activeTab === 'checkpoints'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <Target className="w-4 h-4" /> Checkpoint Checklist
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                'px-4 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2',
                activeTab === 'stats'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              <BookOpen className="w-4 h-4" /> Questions & Status
            </button>
          </div>

          {/* TAB 1: Structured Checkpoints */}
          {activeTab === 'checkpoints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Check off items as you learn, practice, and revise. Status updates automatically!
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Checkpoint
                </Button>
              </div>

              {/* Grouped Checkpoint Lists */}
              <div className="space-y-5">
                {categories.map((cat) => {
                  const items = checkpoints.filter((cp) => cp.category === cat.id);
                  if (items.length === 0) return null;

                  return (
                    <div
                      key={cat.id}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <span className={cn('text-xs font-black uppercase tracking-wider', cat.color)}>
                          {cat.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {items.filter((i) => i.isCompleted).length} / {items.length} completed
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                        {items.map((cp) => (
                          <div
                            key={cp.id}
                            className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-slate-800/50 rounded-xl transition-colors group"
                          >
                            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-3">
                              {/* Checkbox button */}
                              <button
                                type="button"
                                onClick={() =>
                                  onToggleCheckpoint(chapter.chapterId || chapter.id, cp.id)
                                }
                                className={cn(
                                  'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                                  cp.isCompleted
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                )}
                              >
                                {cp.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    'text-sm font-semibold transition-all line-clamp-1',
                                    cp.isCompleted
                                      ? 'line-through text-slate-400 dark:text-slate-500'
                                      : 'text-slate-900 dark:text-white'
                                  )}
                                >
                                  {cp.title}
                                </span>
                                {cp.description && (
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {cp.description}
                                  </p>
                                )}
                              </div>
                            </label>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Priority pill */}
                              {cp.priority && (
                                <span
                                  className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                                    cp.priority === 'high'
                                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                      : cp.priority === 'medium'
                                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                  )}
                                >
                                  {cp.priority}
                                </span>
                              )}

                              {/* Custom checkpoint delete */}
                              {cp.id.startsWith('custom_') && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onDeleteCheckpoint(chapter.chapterId || chapter.id, cp.id)
                                  }
                                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                                  title="Delete checkpoint"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Questions Solved & Chapter Settings */}
          {activeTab === 'stats' && (
            <div className="space-y-5">
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Manual Status Override
                </label>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="not_started">⚪ Not Started</option>
                  <option value="learning">🔵 Learning</option>
                  <option value="practicing">🟡 Practicing</option>
                  <option value="revision">🟠 Needs Revision</option>
                  <option value="completed">🟢 Completed</option>
                  <option value="mastered">🏆 Mastered</option>
                </Select>
              </div>

              {/* Questions Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Practice Questions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Solved"
                      type="number"
                      min="0"
                      value={practiceSolved}
                      onChange={(e) => setPracticeSolved(e.target.value)}
                    />
                    <Input
                      label="Target Goal"
                      type="number"
                      min="1"
                      value={practiceTarget}
                      onChange={(e) => setPracticeTarget(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Previous Year (PYQs)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Solved"
                      type="number"
                      min="0"
                      value={pyqsSolved}
                      onChange={(e) => setPyqsSolved(e.target.value)}
                    />
                    <Input
                      label="Target Goal"
                      type="number"
                      min="1"
                      value={pyqsTarget}
                      onChange={(e) => setPyqsTarget(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Revision Tracker
                  </h4>
                  <Input
                    label="Number of Revisions Completed"
                    type="number"
                    min="0"
                    value={revisionCount}
                    onChange={(e) => setRevisionCount(e.target.value)}
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Mock Test Questions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Solved"
                      type="number"
                      min="0"
                      value={mockQuestionsSolved}
                      onChange={(e) => setMockQuestionsSolved(e.target.value)}
                    />
                    <Input
                      label="Target Goal"
                      type="number"
                      min="1"
                      value={mockQuestionsTarget}
                      onChange={(e) => setMockQuestionsTarget(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Chapter Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Chapter Notes & Formula Summary
                </label>
                <Textarea
                  placeholder="Record your formula tricks, difficult concepts, or weak areas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" onClick={handleSaveStats} isLoading={isSavingStats}>
                  <Save className="w-4 h-4" /> Save Statistics & Notes
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Custom Checkpoint Modal */}
      <AddCheckpointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        chapterName={chapter.name}
        onAdd={(data) => onAddCheckpoint(chapter.chapterId || chapter.id, data)}
      />
    </>
  );
};
