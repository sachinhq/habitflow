import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import {
  getTodayString,
  getWeekDates,
  getMonthDates,
  getPastDates,
  isHabitScheduledOnDate,
  formatDate,
} from '../utils/dateHelper.js';
import { calculateHabitStats } from './streakService.js';

export const getDailyStats = async (userId, targetDate = getTodayString()) => {
  const habits = await Habit.find({ userId, archived: false }).sort({ order: 1, createdAt: 1 });
  const scheduledHabits = habits.filter((h) => isHabitScheduledOnDate(h, targetDate));

  const completions = await HabitCompletion.find({
    userId,
    date: targetDate,
    completed: true,
  });

  const completedHabitIds = new Set(completions.map((c) => c.habitId.toString()));
  const total = scheduledHabits.length;
  const completed = scheduledHabits.filter((h) => completedHabitIds.has(h._id.toString())).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    date: targetDate,
    total,
    completed,
    percentage,
    remaining: total - completed,
  };
};

export const getWeeklyStats = async (userId, targetDate = getTodayString()) => {
  const weekDates = getWeekDates(targetDate);
  const habits = await Habit.find({ userId, archived: false }).sort({ order: 1, createdAt: 1 });

  const completions = await HabitCompletion.find({
    userId,
    date: { $in: weekDates },
    completed: true,
  });

  const completionLookup = new Set(
    completions.map((c) => `${c.habitId.toString()}_${c.date}`)
  );

  // Build matrix and stats
  const dailyBreakdown = weekDates.map((dStr) => {
    const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dStr));
    const completedCount = scheduled.filter((h) =>
      completionLookup.has(`${h._id.toString()}_${dStr}`)
    ).length;
    const rate = scheduled.length > 0 ? Math.round((completedCount / scheduled.length) * 100) : 0;

    const dayName = new Date(dStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: dStr,
      dayName,
      scheduled: scheduled.length,
      completed: completedCount,
      rate,
    };
  });

  let totalScheduled = 0;
  let totalCompleted = 0;

  const habitMatrix = habits.map((habit) => {
    const habitId = habit._id.toString();
    const days = weekDates.map((dStr) => {
      const isScheduled = isHabitScheduledOnDate(habit, dStr);
      const isDone = completionLookup.has(`${habitId}_${dStr}`);
      if (isScheduled) {
        totalScheduled += 1;
        if (isDone) totalCompleted += 1;
      }
      return {
        date: dStr,
        isScheduled,
        completed: isDone,
      };
    });

    const habitScheduledCount = days.filter((d) => d.isScheduled).length;
    const habitCompletedCount = days.filter((d) => d.completed).length;
    const weeklyRate =
      habitScheduledCount > 0 ? Math.round((habitCompletedCount / habitScheduledCount) * 100) : 0;

    return {
      habit,
      days,
      weeklyRate,
      completedCount: habitCompletedCount,
      scheduledCount: habitScheduledCount,
    };
  });

  const weeklyCompletionRate =
    totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  // Best and least consistent habits
  const sortedByRate = [...habitMatrix].sort((a, b) => b.weeklyRate - a.weeklyRate);
  const bestPerformingHabit = sortedByRate.length > 0 ? sortedByRate[0].habit : null;
  const leastConsistentHabit =
    sortedByRate.length > 0 ? sortedByRate[sortedByRate.length - 1].habit : null;

  return {
    weekDates,
    startDate: weekDates[0],
    endDate: weekDates[6],
    weeklyCompletionRate,
    totalScheduled,
    totalCompleted,
    missedHabits: Math.max(0, totalScheduled - totalCompleted),
    dailyBreakdown,
    habitMatrix,
    bestPerformingHabit,
    leastConsistentHabit,
  };
};

export const getMonthlyHeatmap = async (userId, year, month) => {
  const monthDates = getMonthDates(year, month);
  const habits = await Habit.find({ userId, archived: false });

  const completions = await HabitCompletion.find({
    userId,
    date: { $in: monthDates },
    completed: true,
  });

  const completionLookup = new Set(
    completions.map((c) => `${c.habitId.toString()}_${c.date}`)
  );

  let monthlyScheduled = 0;
  let monthlyCompleted = 0;

  const heatmap = monthDates.map((dateStr) => {
    const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dateStr));
    const completedList = scheduled.filter((h) =>
      completionLookup.has(`${h._id.toString()}_${dateStr}`)
    );
    const missedList = scheduled.filter(
      (h) => !completionLookup.has(`${h._id.toString()}_${dateStr}`)
    );

    const scheduledCount = scheduled.length;
    const completedCount = completedList.length;
    const rate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

    monthlyScheduled += scheduledCount;
    monthlyCompleted += completedCount;

    // Intensity: 0 (0%), 1 (1-39%), 2 (40-69%), 3 (70-99%), 4 (100%)
    let intensity = 0;
    if (rate === 100 && scheduledCount > 0) intensity = 4;
    else if (rate >= 70) intensity = 3;
    else if (rate >= 40) intensity = 2;
    else if (rate > 0) intensity = 1;

    return {
      date: dateStr,
      scheduledCount,
      completedCount,
      rate,
      intensity,
      completedHabits: completedList.map((h) => ({ id: h._id, name: h.name, icon: h.icon, color: h.color })),
      missedHabits: missedList.map((h) => ({ id: h._id, name: h.name, icon: h.icon, color: h.color })),
    };
  });

  const monthlyRate =
    monthlyScheduled > 0 ? Math.round((monthlyCompleted / monthlyScheduled) * 100) : 0;

  return {
    year,
    month,
    monthlyRate,
    totalScheduled: monthlyScheduled,
    totalCompleted: monthlyCompleted,
    totalMissed: Math.max(0, monthlyScheduled - monthlyCompleted),
    heatmap,
  };
};

export const getTrends = async (userId, daysCount = 30) => {
  const dates = getPastDates(daysCount);
  const habits = await Habit.find({ userId, archived: false });

  const completions = await HabitCompletion.find({
    userId,
    date: { $in: dates },
    completed: true,
  });

  const completionLookup = new Set(
    completions.map((c) => `${c.habitId.toString()}_${c.date}`)
  );

  // Time series completion trend
  const completionTrends = dates.map((dateStr) => {
    const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dateStr));
    const completedCount = scheduled.filter((h) =>
      completionLookup.has(`${h._id.toString()}_${dateStr}`)
    ).length;
    const rate = scheduled.length > 0 ? Math.round((completedCount / scheduled.length) * 100) : 0;

    return {
      date: dateStr,
      formattedDate: new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      scheduled: scheduled.length,
      completed: completedCount,
      rate,
    };
  });

  // Category breakdown
  const categoryMap = {};
  habits.forEach((h) => {
    if (!categoryMap[h.category]) {
      categoryMap[h.category] = {
        name: h.category,
        totalHabits: 0,
        totalScheduled: 0,
        totalCompleted: 0,
        color: h.color || '#6366f1',
      };
    }
    categoryMap[h.category].totalHabits += 1;
  });

  dates.forEach((dateStr) => {
    habits.forEach((h) => {
      if (isHabitScheduledOnDate(h, dateStr)) {
        categoryMap[h.category].totalScheduled += 1;
        if (completionLookup.has(`${h._id.toString()}_${dateStr}`)) {
          categoryMap[h.category].totalCompleted += 1;
        }
      }
    });
  });

  const categoryBreakdown = Object.values(categoryMap).map((cat) => ({
    ...cat,
    rate: cat.totalScheduled > 0 ? Math.round((cat.totalCompleted / cat.totalScheduled) * 100) : 0,
  }));

  // Day of week consistency
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStats = daysOfWeek.map((dayName, idx) => ({
    day: dayName,
    scheduled: 0,
    completed: 0,
    rate: 0,
  }));

  dates.forEach((dateStr) => {
    const dayIdx = new Date(dateStr + 'T00:00:00').getDay();
    const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dateStr));
    const completedCount = scheduled.filter((h) =>
      completionLookup.has(`${h._id.toString()}_${dateStr}`)
    ).length;

    dayStats[dayIdx].scheduled += scheduled.length;
    dayStats[dayIdx].completed += completedCount;
  });

  dayStats.forEach((ds) => {
    ds.rate = ds.scheduled > 0 ? Math.round((ds.completed / ds.scheduled) * 100) : 0;
  });

  // Overall aggregate
  const totalScheduledSum = completionTrends.reduce((acc, curr) => acc + curr.scheduled, 0);
  const totalCompletedSum = completionTrends.reduce((acc, curr) => acc + curr.completed, 0);
  const averageCompletionRate =
    totalScheduledSum > 0 ? Math.round((totalCompletedSum / totalScheduledSum) * 100) : 0;

  return {
    daysCount,
    averageCompletionRate,
    totalScheduled: totalScheduledSum,
    totalCompleted: totalCompletedSum,
    completionTrends,
    categoryBreakdown,
    dayStats,
  };
};
