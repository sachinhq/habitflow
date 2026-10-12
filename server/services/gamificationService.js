import User from '../models/User.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import Achievement from '../models/Achievement.js';
import { getTodayString } from '../utils/dateHelper.js';

export const BADGE_DEFINITIONS = [
  {
    badgeId: 'first_habit',
    title: 'First Step',
    description: 'Created your very first habit on HabitFlow',
    icon: 'Sparkles',
    category: 'Milestone',
  },
  {
    badgeId: 'first_completion',
    title: 'Action Taker',
    description: 'Completed your first habit check-off',
    icon: 'CheckCircle2',
    category: 'Completions',
  },
  {
    badgeId: 'streak_7',
    title: '7-Day Warrior',
    description: 'Maintained a 7-day streak on any habit',
    icon: 'Flame',
    category: 'Streaks',
  },
  {
    badgeId: 'streak_30',
    title: 'Unstoppable Force',
    description: 'Maintained an unbroken 30-day habit streak',
    icon: 'Zap',
    category: 'Streaks',
  },
  {
    badgeId: 'streak_60',
    title: 'Diamond Consistency',
    description: 'Reached a remarkable 60-day habit streak',
    icon: 'Crown',
    category: 'Streaks',
  },
  {
    badgeId: 'completions_50',
    title: 'Half Century',
    description: 'Completed 50 total habit check-offs',
    icon: 'Trophy',
    category: 'Completions',
  },
  {
    badgeId: 'completions_100',
    title: 'Century Club',
    description: 'Achieved 100 total habit check-offs',
    icon: 'Award',
    category: 'Completions',
  },
  {
    badgeId: 'well_rounded',
    title: 'Well Rounded',
    description: 'Active habits created across 3 or more distinct categories',
    icon: 'Compass',
    category: 'Diversity',
  },
  {
    badgeId: 'night_owl',
    title: 'Dedicated Finisher',
    description: 'Achieved 100% daily completion on all scheduled habits',
    icon: 'Target',
    category: 'Daily',
  },
];

/**
 * Checks and awards badges for a user after a state change
 */
export const checkAndAwardBadges = async (userId, bestStreak = 0) => {
  const newlyUnlocked = [];

  try {
    const existingBadges = await Achievement.find({ userId }).select('badgeId');
    const existingBadgeIds = new Set(existingBadges.map((b) => b.badgeId));

    const totalHabits = await Habit.countDocuments({ userId, archived: false });
    const totalCompletions = await HabitCompletion.countDocuments({ userId, completed: true });
    
    // Check categories
    const distinctCategories = await Habit.distinct('category', { userId, archived: false });

    const checks = [
      { id: 'first_habit', qualify: totalHabits >= 1 },
      { id: 'first_completion', qualify: totalCompletions >= 1 },
      { id: 'streak_7', qualify: bestStreak >= 7 },
      { id: 'streak_30', qualify: bestStreak >= 30 },
      { id: 'streak_60', qualify: bestStreak >= 60 },
      { id: 'completions_50', qualify: totalCompletions >= 50 },
      { id: 'completions_100', qualify: totalCompletions >= 100 },
      { id: 'well_rounded', qualify: distinctCategories.length >= 3 },
    ];

    for (const check of checks) {
      if (check.qualify && !existingBadgeIds.has(check.id)) {
        const def = BADGE_DEFINITIONS.find((b) => b.badgeId === check.id);
        if (def) {
          const achievement = await Achievement.create({
            userId,
            badgeId: def.badgeId,
            title: def.title,
            description: def.description,
            icon: def.icon,
            category: def.category,
          });
          newlyUnlocked.push(achievement);
          // Award XP for unlocking badge
          await addXpToUser(userId, 100);
        }
      }
    }
  } catch (err) {
    console.error('Error checking badges:', err.message);
  }

  return newlyUnlocked;
};

/**
 * Adds XP to user and updates level if required
 */
export const addXpToUser = async (userId, xpPoints) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.xp = (user.xp || 0) + xpPoints;
  user.updateLevel();
  await user.save();
  return { xp: user.xp, level: user.level };
};
