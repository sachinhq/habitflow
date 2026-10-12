import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { Check, Calendar, Award, Target } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ExamSelectorModal = ({
  isOpen,
  onClose,
  exams,
  targetExamId,
  onSelectExam,
}) => {
  const [selectedId, setSelectedId] = useState(targetExamId);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSelectExam(selectedId);
    setIsSaving(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Target SSC Exam"
      description="Tailor your syllabus, countdown timer, and preparation tracking"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto p-1">
          {exams.map((exam) => {
            const isSelected = selectedId === exam.examId;
            return (
              <div
                key={exam.examId}
                onClick={() => setSelectedId(exam.examId)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {exam.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                        {exam.fullName}
                      </p>
                    </div>

                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center border text-white transition-all',
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-slate-300 dark:border-slate-700'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {exam.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-500" />
                    {exam.stages || 'Tier 1 & Tier 2'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    {exam.targetDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            Set Target Exam
          </Button>
        </div>
      </div>
    </Modal>
  );
};
