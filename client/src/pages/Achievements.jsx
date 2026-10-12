import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Zap,
  Lock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Flame,
  Star,
  ShieldAlert,
} from 'lucide-react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { cn } from '../utils/cn';

export const Achievements = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users/achievements');
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const xp = data?.xp || 0;
  const level = data?.level || 1;
  const nextLevelXp = data?.nextLevelXp || 100;
  const baseLevelXp = data?.currentLevelBaseXp || 0;
  const progressInLevel =
    nextLevelXp > baseLevelXp
      ? Math.round(((xp - baseLevelXp) / (nextLevelXp - baseLevelXp)) * 100)
      : 100;

  return (
    <div className="space-y-8">
      {/* Top Level Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-700 text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-xl shrink-0">
              <Trophy className="w-10 h-10 animate-bounce-subtle" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-200 font-bold">
                Player Rank
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Level {level} Master
              </h1>
              <p className="text-indigo-100 text-sm mt-1">
                {data?.unlockedCount || 0} of {data?.totalCount || 0} Badges Unlocked
              </p>
            </div>
          </div>

          <div className="w-full md:w-72 bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                {xp} Total XP
              </span>
              <span className="text-amber-200">{progressInLevel}%</span>
            </div>
            <ProgressBar
              value={progressInLevel}
              max={100}
              height="h-2.5"
              color="bg-gradient-to-r from-amber-400 to-amber-300"
              trackColor="bg-black/30"
            />
            <p className="text-[10px] text-indigo-200 mt-2 text-right">
              {Math.max(0, nextLevelXp - xp)} XP to Level {level + 1}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Badges Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Milestone Badges
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accomplish habit streaks and consistency goals to unlock trophies
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading achievements...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.badges?.map((badge) => {
              const isUnlocked = badge.isUnlocked;
              return (
                <Card
                  key={badge.badgeId}
                  className={cn(
                    'p-5 transition-all duration-200 relative overflow-hidden',
                    isUnlocked
                      ? 'border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm'
                      : 'opacity-60 bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform',
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-300 border-amber-400 text-white shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                      )}
                    >
                      {isUnlocked ? (
                        <Award className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {badge.title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                      {isUnlocked && badge.unlockedAt && (
                        <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-2 font-medium">
                          Achieved on{' '}
                          {new Date(badge.unlockedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
