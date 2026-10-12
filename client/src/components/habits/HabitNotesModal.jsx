import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Input';
import Button from '../ui/Button';

export const HabitNotesModal = ({
  isOpen,
  onClose,
  habit,
  date,
  initialNotes = '',
  onSave,
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || '');
  }, [initialNotes, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(notes);
    setIsSaving(false);
    onClose();
  };

  if (!habit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Notes for ${habit.name}`}
      description={`Record reflections or details for ${date}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <Textarea
          placeholder="How did this habit go today? Any insights or struggles?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          autoFocus
        />

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            Save Notes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
