import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';

export const AddCheckpointModal = ({ isOpen, onClose, onAdd, chapterName }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'custom',
    priority: 'medium',
    target: '',
    deadline: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onAdd(formData);
    setFormData({
      title: '',
      description: '',
      category: 'custom',
      priority: 'medium',
      target: '',
      deadline: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Checkpoint"
      description={`Add a custom study milestone for "${chapterName}"`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Checkpoint Title *"
          placeholder="e.g. Solve 30 tough TCS PYQs from 2024"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          autoFocus
        />

        <Textarea
          label="Description / Notes (Optional)"
          placeholder="Add details, formula references, or links..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="learn">📖 Learn / Theory</option>
            <option value="practice">✍️ Practice</option>
            <option value="pyq">📝 PYQs</option>
            <option value="revision">🔄 Revision</option>
            <option value="test">🎯 Mock Test</option>
            <option value="custom">✨ Custom Goal</option>
          </Select>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Amount (Optional)"
            placeholder="e.g. 50 questions"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          />
          <Input
            label="Deadline (Optional)"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Checkpoint
          </Button>
        </div>
      </form>
    </Modal>
  );
};
