import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  Trophy,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useExamStore } from '../../store/useExamStore';
import { ChapterCard } from '../../components/exam/ChapterCard';
import { ChapterModal } from '../../components/exam/ChapterModal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { cn } from '../../utils/cn';

export const SyllabusView = () => {
  const {
    syllabus,
    activeSubjectId,
    setActiveSubjectId,
    activeChapter,
    fetchSyllabus,
    fetchChapterDetail,
    toggleCheckpoint,
    addCustomCheckpoint,
    deleteCheckpoint,
    updateChapterStats,
  } = useExamStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const currentSubject =
    syllabus.find((s) => s.subjectId === activeSubjectId) || syllabus[0];

  const categories = currentSubject?.categories || [];
  const chapters = currentSubject?.chapters || [];

  // Filter chapters
  const filteredChapters = chapters.filter((ch) => {
    // Category match
    if (selectedCategory !== 'All' && ch.category !== selectedCategory) {
      return false;
    }
    // Search match
    if (
      searchQuery &&
      !ch.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ch.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Status match
    if (selectedStatus !== 'all' && ch.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const handleOpenChapter = async (chapter) => {
    await fetchChapterDetail(chapter.id);
    setIsChapterModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Subject Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {syllabus.map((subj) => {
          const isSelected = subj.subjectId === activeSubjectId;
          return (
            <button
              key={subj.subjectId}
              onClick={() => {
                setActiveSubjectId(subj.subjectId);
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden',
                isSelected
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900'
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {subj.shortName}
                </span>
                <span
                  style={{ backgroundColor: `${subj.color}20`, color: subj.color }}
                  className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0"
                >
                  {subj.totalChapters}
                </span>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                  <span>{subj.masteredCount} Mastered</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    {subj.overallProgress}%
                  </span>
                </div>
                <ProgressBar
                  value={subj.overallProgress}
                  max={100}
                  height="h-1.5"
                  color={subj.overallProgress >= 70 ? 'bg-emerald-500' : 'bg-indigo-600'}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search in ${currentSubject?.name || 'Subject'} chapters...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'not_started', label: 'Not Started' },
              { id: 'learning', label: 'Learning' },
              { id: 'practicing', label: 'Practicing' },
              { id: 'revision', label: 'Revision' },
              { id: 'mastered', label: 'Mastered' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize whitespace-nowrap',
                  selectedStatus === st.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chapters Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>
            Showing {filteredChapters.length} of {chapters.length} Chapters
          </span>
          <span>Click any chapter to manage checkpoints</span>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No chapters match your filter
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the search query or status filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onClick={handleOpenChapter}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chapter Checkpoints Modal */}
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
