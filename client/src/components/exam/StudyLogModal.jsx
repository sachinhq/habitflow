import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';

export const StudyLogModal = ({
  isOpen,
  onClose,
  subjects = [],
  onLogSession,
}) => {
  const [subjectId, setSubjectId] = useState(subjects[0]?.subjectId || 'maths');
  const [chapterId, setChapterId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [questionsSolved, setQuestionsSolved] = useState(25);
  const [topicCovered, setTopicCovered] = useState('');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const selectedSubject = subjects.find((s) => s.subjectId === subjectId);
  const chapters = selectedSubject?.chapters || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);
    const selectedChapterObj = chapters.find((c) => c.id === chapterId);

    await onLogSession({
      subjectId,
      chapterId: chapterId || undefined,
      chapterName: selectedChapterObj?.name || '',
      durationMinutes: parseInt(durationMinutes, 10),
      questionsSolved: parseInt(questionsSolved, 10) || 0,
      topicCovered,
      notes,
    });

    setIsLogging(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Study Session"
      description="Record your study hours and questions solved to build your consistency streak"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <Select
          label="Subject *"
          value={subjectId}
          onChange={(e) => {
            setSubjectId(e.target.value);
            setChapterId('');
          }}
        >
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>
              {s.name}
            </option>
          ))}
        </Select>

        {/* Chapter (optional) */}
        {chapters.length > 0 && (
          <Select
            label="Chapter (Optional)"
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
          >
            <option value="">-- General Subject Study --</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </Select>
        )}

        {/* Duration & Questions */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Duration (Minutes) *"
            type="number"
            min="5"
            step="5"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            required
          />
          <Input
            label="Questions Solved"
            type="number"
            min="0"
            value={questionsSolved}
            onChange={(e) => setQuestionsSolved(e.target.value)}
          />
        </div>

        {/* Topic Covered */}
        <Input
          label="Specific Topic / Exercise"
          placeholder="e.g. Percentage shortcuts & PYQs 2023"
          value={topicCovered}
          onChange={(e) => setTopicCovered(e.target.value)}
        />

        {/* Reflections */}
        <Textarea
          label="Reflections / Notes"
          placeholder="Key takeaways or difficult questions to revisit..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLogging}>
            Save Study Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
