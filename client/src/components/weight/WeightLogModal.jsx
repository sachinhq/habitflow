import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { Scale, Calendar, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const WeightLogModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialUnit = 'kg',
  lastRecordedWeight = null,
  isLoading = false,
}) => {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState(initialUnit);
  const [date, setDate] = useState(getTodayString());
  const [bodyFat, setBodyFat] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUnit(initialUnit);
      setDate(getTodayString());
      setWeight(lastRecordedWeight ? String(lastRecordedWeight) : '');
      setBodyFat('');
      setWaistCm('');
      setNotes('');
      setError('');
    }
  }, [isOpen, initialUnit, lastRecordedWeight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) {
      setError('Please enter a valid weight value');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }

    try {
      const res = await onSubmit({
        weight: parseFloat(weight),
        unit,
        date,
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        waistCm: waistCm ? parseFloat(waistCm) : null,
        notes,
      });
      if (res && !res.success) {
        setError(res.message || 'Failed to save weigh-in');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save weigh-in');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Weekly Weight"
      description="Record your weigh-in to keep track of your body progress and consistency"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Weight & Unit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Weight Value *
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="10"
                max="500"
                placeholder="e.g. 72.5"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {unit}
              </span>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  unit === 'kg'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  unit === 'lbs'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                lbs
              </button>
            </div>
          </div>
          {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Weigh-in Date *
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Tip: Log once per week at the same time (e.g. Sunday morning before breakfast)
          </span>
        </div>

        {/* Body Fat % & Waist */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Body Fat % (Optional)
            </label>
            <input
              type="number"
              step="0.1"
              min="2"
              max="60"
              placeholder="e.g. 18.5"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Waist cm (Optional)
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="200"
              placeholder="e.g. 82.0"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Weekly Notes (Optional)
          </label>
          <textarea
            placeholder="e.g. Felt lighter this week, completed 4 workouts, ate clean"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* XP Bonus Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Logging your weekly weight awards <strong>+15 XP</strong> towards your level!</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="font-bold">
            <Scale className="w-4 h-4" /> Save Weigh-in
          </Button>
        </div>
      </form>
    </Modal>
  );
};
