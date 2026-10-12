import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { Target, Settings2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const WeightGoalModal = ({
  isOpen,
  onClose,
  onSubmit,
  preferences = {},
  isLoading = false,
}) => {
  const [targetWeight, setTargetWeight] = useState('');
  const [startingWeight, setStartingWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTargetWeight(preferences.targetWeight ? String(preferences.targetWeight) : '');
      setStartingWeight(preferences.startingWeight ? String(preferences.startingWeight) : '');
      setHeightCm(preferences.heightCm ? String(preferences.heightCm) : '');
      setWeightUnit(preferences.weightUnit || 'kg');
      setError('');
    }
  }, [isOpen, preferences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await onSubmit({
        targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        startingWeight: startingWeight ? parseFloat(startingWeight) : null,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        weightUnit,
      });
      if (res && !res.success) {
        setError(res.message || 'Failed to update preferences');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update preferences');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Weight Goals & Profile"
      description="Set your target goal weight and height for accurate BMI and progress calculations"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unit Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Measurement Unit
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWeightUnit('kg')}
              className={cn(
                'py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center',
                weightUnit === 'kg'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              )}
            >
              Kilograms (kg)
            </button>
            <button
              type="button"
              onClick={() => setWeightUnit('lbs')}
              className={cn(
                'py-2.5 px-4 rounded-xl text-xs font-bold border transition-all text-center',
                weightUnit === 'lbs'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              )}
            >
              Pounds (lbs)
            </button>
          </div>
        </div>

        {/* Target Weight */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Target Goal Weight ({weightUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            placeholder="e.g. 68.0"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-400"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Used to show your progress bar and reference guideline on charts
          </span>
        </div>

        {/* Starting Weight */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Baseline / Starting Weight ({weightUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            placeholder="e.g. 78.5"
            value={startingWeight}
            onChange={(e) => setStartingWeight(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-400"
          />
        </div>

        {/* Height cm for BMI */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Height in cm (For BMI calculation)
          </label>
          <input
            type="number"
            step="1"
            min="100"
            max="250"
            placeholder="e.g. 175"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-400"
          />
        </div>

        {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="font-bold">
            <Target className="w-4 h-4" /> Save Goals
          </Button>
        </div>
      </form>
    </Modal>
  );
};
