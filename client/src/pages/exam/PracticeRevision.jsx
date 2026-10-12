import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ChapterModal } from '../../components/exam/ChapterModal';
import { getStatusBadge } from '../../components/exam/ChapterCard';
import { cn } from '../../utils/cn';

export const PracticeRevision = () => {
  const {
    syllabus,
    activeChapter,
    fetchChapterDetail,
    toggleCheckpoint,
    addCustomCheckpoint,
    deleteCheckpoint,
    updateChapterStats,
  } = useExamStore();

  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  // Collect all chapters across subjects
  const allChapters = syllabus.flatMap((s) =>
    (s.chapters || []).map((ch) => ({ ...ch, subjectName: s.name, subjectColor: s.color }))
  );

  // Filter chapters needing revision or practicing
  const revisionChapters = allChapters.filter((ch) => {
    if (selectedSubjectId !== 'all' && ch.subjectId !== selectedSubjectId) return false;
    return ch.status === 'revision' || ch.revisionCount === 0 && ch.progressPercentage >= 40;
  });

  const handleOpenChapter = async (chapter) => {
    await fetchChapterDetail(chapter.id);
    setIsChapterModalOpen(true);
  };

  const handleQuickRevisionDone = async (chapter) => {
    await updateChapterStats(chapter.id, {
      revisionCount: (chapter.revisionCount || 0) + 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Revision & PYQ Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritize topics requiring 1st, 2nd, or final revision and past paper questions
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
              selectedSubjectId === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            All Subjects
          </button>
          {syllabus.map((s) => (
            <button
              key={s.subjectId}
              onClick={() => setSelectedSubjectId(s.subjectId)}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                selectedSubjectId === s.subjectId
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Revision Queue List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              Chapters Scheduled for Revision ({revisionChapters.length})
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Spaced repetition ensures long-term formula and vocabulary retention
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
          {revisionChapters.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              ✨ No chapters urgently needing revision! Check off study checkpoints in Syllabus to populate this queue.
            </div>
          ) : (
            revisionChapters.map((chapter) => {
              const statusMeta = getStatusBadge(chapter.status);
              const StatusIcon = statusMeta.icon;
              return (
                <div
                  key={chapter.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <div
                      style={{
                        backgroundColor: `${chapter.subjectColor}20`,
                        color: chapter.subjectColor,
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                    >
                      {chapter.subjectName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {chapter.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {chapter.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Revisions: <strong className="text-amber-500">{chapter.revisionCount || 0} times</strong></span>
                        <span>•</span>
                        <span>PYQs: <strong className="text-emerald-500">{chapter.pyqsSolved || 0}/{chapter.pyqsTarget || 50}</strong></span>
                        <span>•</span>
                        <span>Practice: <strong className="text-indigo-500">{chapter.practiceSolved || 0}/{chapter.practiceTarget || 100}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickRevisionDone(chapter)}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> +1 Revision Done
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleOpenChapter(chapter)}
                    >
                      Open Checkpoints <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Chapter Checkpoint Modal */}
      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        chapter={activeChapter}
        onToggleCheckpoint={toggleCheckpoint}
        onAddCheckpoint={addCustomCheckpoint}
        onDeleteCheckpoint={deleteCheckpoint}
        onUpdateStats={updateChapterStats}
      />
    </div>
  );
};
