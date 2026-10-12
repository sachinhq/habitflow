import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../ui/Button';

export const AchievementModal = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-center text-white shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-xl shadow-amber-500/30 mb-4 animate-bounce-subtle">
            <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
            Achievement Unlocked!
          </span>

          <h3 className="text-2xl font-black mt-1 mb-2 tracking-tight">
            {achievement.title}
          </h3>

          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            {achievement.description}
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            +100 Bonus XP Awarded
          </div>

          <Button
            onClick={onClose}
            variant="primary"
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/30"
          >
            Awesome! Keep Going
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
