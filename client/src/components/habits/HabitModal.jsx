import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import {
  CATEGORIES,
  COLOR_PALETTE,
  FREQUENCIES,
  DAYS_OF_WEEK,
} from '../../utils/constants';
import { ICONS_LIST, getIconComponent } from '../../utils/iconMap';
import { Bell, Check, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export const HabitModal = ({
  isOpen,
  onClose,
  onSubmit,
  habit = null,
  isLoading = false,
}) => {
  const isEditing = !!habit;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personal',
    icon: 'Sparkles',
    color: '#6366f1',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    targetCount: 1,
    unit: 'time',
    reminderTime: '08:00',
    isReminderEnabled: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || 'Personal',
        icon: habit.icon || 'Sparkles',
        color: habit.color || '#6366f1',
        frequency: habit.frequency || 'daily',
        targetDays: habit.targetDays || [0, 1, 2, 3, 4, 5, 6],
        targetCount: habit.targetCount || 1,
        unit: habit.unit || 'time',
        reminderTime: habit.reminderTime || '08:00',
        isReminderEnabled: habit.isReminderEnabled || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Personal',
        icon: 'Sparkles',
        color: '#6366f1',
        frequency: 'daily',
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 1,
        unit: 'time',
        reminderTime: '08:00',
        isReminderEnabled: false,
      });
    }
    setErrors({});
  }, [habit, isOpen]);

  const toggleDay = (dayId) => {
    const current = [...formData.targetDays];
    const index = current.indexOf(dayId);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(dayId);
    }
    setFormData({ ...formData, targetDays: current });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide a habit name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Habit' : 'Create New Habit'}
      description={
        isEditing
          ? 'Customize your habit details and schedules'
          : 'Define a new habit to track your daily progress'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Habit Name */}
        <Input
          label="Habit Name *"
          placeholder="e.g. Read 20 Pages, Morning Jog, Drink Water"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Why is this habit important? (Optional)"
          placeholder="e.g. Boost focus and learn something new every day"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={2}
        />

        {/* Category & Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) =>
              setFormData({ ...formData, frequency: e.target.value })
            }
          >
            {FREQUENCIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>
        </div>

        {/* If Specific Days: Day selector pills */}
        {formData.frequency === 'specific_days' && (
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Select Active Days
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = formData.targetDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold transition-all border text-center',
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    )}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Goal / Target */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Daily Target Amount"
            type="number"
            min="1"
            max="10000"
            value={formData.targetCount}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetCount: parseInt(e.target.value, 10) || 1,
              })
            }
          />
          <Input
            label="Unit"
            placeholder="e.g. pages, mins, liters, times"
            value={formData.unit}
            onChange={(e) =>
              setFormData({ ...formData, unit: e.target.value })
            }
          />
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Select Icon
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            {ICONS_LIST.map((item) => {
              const Icon = item.icon;
              const isSelected = formData.icon === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.name })}
                  className={cn(
                    'p-2 rounded-xl border transition-all flex items-center justify-center',
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 scale-105 shadow-sm'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  )}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            Accent Color
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {COLOR_PALETTE.map((color) => {
              const isSelected = formData.color === color.hex;
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.hex })}
                  style={{ backgroundColor: color.hex }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-white transition-all shadow-sm',
                    isSelected ? 'ring-4 ring-indigo-500/30 scale-110' : 'hover:scale-105 opacity-90'
                  )}
                  title={color.name}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reminder Time */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Daily Reminder
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receive a prompt to stay on track
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isReminderEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isReminderEnabled: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {formData.isReminderEnabled && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <Input
                label="Reminder Time"
                type="time"
                value={formData.reminderTime}
                onChange={(e) =>
                  setFormData({ ...formData, reminderTime: e.target.value })
                }
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
