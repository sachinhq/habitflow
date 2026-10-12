import {
  formatDate,
  getTodayString,
  parseDateString,
  isHabitScheduledOnDate,
} from '../utils/dateHelper.js';

/**
 * Calculates current streak, longest streak, total completions, and completion rate for a habit.
 * @param {Object} habit - Mongoose habit object
 * @param {Array<string>} completedDateStrings - Set/array of 'YYYY-MM-DD' strings when habit was completed
 * @param {string} [todayStr] - Optional reference date (default: today)
 */
export const calculateHabitStats = (habit, completedDateStrings, todayStr = getTodayString()) => {
  const completedSet = new Set(completedDateStrings);
  const totalCompletedDays = completedSet.size;

  const startDateStr = habit.startDate || todayStr;
  const startDate = parseDateString(startDateStr);
  const today = parseDateString(todayStr);

  // Generate list of all scheduled dates from startDate to today
  const scheduledDates = [];
  const curr = new Date(startDate);
  while (curr <= today) {
    const dStr = formatDate(curr);
    if (isHabitScheduledOnDate(habit, dStr)) {
      scheduledDates.push(dStr);
    }
    curr.setDate(curr.getDate() + 1);
  }

  const totalScheduledDays = scheduledDates.length;
  const completionRate =
    totalScheduledDays > 0
      ? Math.round((totalCompletedDays / totalScheduledDays) * 100)
      : 0;

  // Calculate Longest Streak across all scheduled days
  let longestStreak = 0;
  let runningStreak = 0;

  for (const dateStr of scheduledDates) {
    if (completedSet.has(dateStr)) {
      runningStreak += 1;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // Calculate Current Streak
  // Start from the most recent scheduled date
  let currentStreak = 0;

  // Check if today was scheduled
  const isTodayScheduled = isHabitScheduledOnDate(habit, todayStr);
  const isTodayCompleted = completedSet.has(todayStr);

  let checkIndex = scheduledDates.length - 1;

  if (isTodayScheduled) {
    if (isTodayCompleted) {
      // Completed today: include today and continue backwards
      currentStreak += 1;
      checkIndex -= 1;
    } else {
      // Not completed yet today: streak is still active from yesterday if yesterday was completed
      checkIndex -= 1;
    }
  }

  // Walk backwards from previous scheduled day
  while (checkIndex >= 0) {
    const dateStr = scheduledDates[checkIndex];
    if (completedSet.has(dateStr)) {
      currentStreak += 1;
      checkIndex -= 1;
    } else {
      // Encountered a missed scheduled day
      break;
    }
  }

  // Ensure longest streak is at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays,
    totalScheduledDays,
    completionRate: Math.min(100, completionRate),
    isCompletedToday: isTodayCompleted,
  };
};

/**
 * Calculates overall user stats across all user habits
 */
export const calculateUserOverallStats = (habitsWithStats, todayCompletionsCount, todayTotalScheduled) => {
  const activeHabits = habitsWithStats.filter((h) => !h.archived);
  
  const currentStreak = activeHabits.length > 0 
    ? Math.max(0, ...activeHabits.map((h) => h.stats.currentStreak)) 
    : 0;

  const bestStreak = activeHabits.length > 0 
    ? Math.max(0, ...activeHabits.map((h) => h.stats.longestStreak)) 
    : 0;

  const todayCompletionPercentage = todayTotalScheduled > 0
    ? Math.round((todayCompletionsCount / todayTotalScheduled) * 100)
    : 0;

  return {
    totalHabits: activeHabits.length,
    todayCompleted: todayCompletionsCount,
    todayTotal: todayTotalScheduled,
    todayCompletionPercentage,
    currentStreak,
    bestStreak,
  };
};
