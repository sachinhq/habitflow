import {
  getDailyStats,
  getWeeklyStats,
  getMonthlyHeatmap,
  getTrends,
} from '../services/analyticsService.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import Achievement from '../models/Achievement.js';
import { calculateHabitStats } from '../services/streakService.js';
import { getTodayString } from '../utils/dateHelper.js';

// @desc    Get top dashboard overview cards
// @route   GET /api/analytics/overview
// @access  Private
export const getOverview = async (req, res, next) => {
  try {
    const todayStr = getTodayString();
    const habits = await Habit.find({ userId: req.user.id, archived: false });

    // Fetch all completions for streaks
    const completions = await HabitCompletion.find({
      userId: req.user.id,
      completed: true,
    });

    const completionsByHabit = {};
    habits.forEach((h) => {
      completionsByHabit[h._id.toString()] = [];
    });
    completions.forEach((c) => {
      const hId = c.habitId.toString();
      if (completionsByHabit[hId]) {
        completionsByHabit[hId].push(c.date);
      }
    });

    // Calculate individual stats
    const habitStatsList = habits.map((h) =>
      calculateHabitStats(h, completionsByHabit[h._id.toString()] || [], todayStr)
    );

    const currentStreak = habitStatsList.length > 0
      ? Math.max(0, ...habitStatsList.map((s) => s.currentStreak))
      : 0;

    const bestStreak = habitStatsList.length > 0
      ? Math.max(0, ...habitStatsList.map((s) => s.longestStreak))
      : 0;

    // Daily & weekly & monthly stats
    const daily = await getDailyStats(req.user.id, todayStr);
    const weekly = await getWeeklyStats(req.user.id, todayStr);

    const todayDate = new Date();
    const monthly = await getMonthlyHeatmap(
      req.user.id,
      todayDate.getFullYear(),
      todayDate.getMonth() + 1
    );

    // Recent achievements
    const recentAchievements = await Achievement.find({ userId: req.user.id })
      .sort({ unlockedAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: {
        totalHabits: habits.length,
        todayCompleted: daily.completed,
        todayTotal: daily.total,
        todayCompletionPercentage: daily.percentage,
        currentStreak,
        bestStreak,
        weeklyCompletionPercentage: weekly.weeklyCompletionRate,
        monthlyCompletionPercentage: monthly.monthlyRate,
        recentAchievements,
        userLevel: req.user.level,
        userXp: req.user.xp,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily analytics
// @route   GET /api/analytics/daily
// @access  Private
export const getDaily = async (req, res, next) => {
  try {
    const { date } = req.query;
    const stats = await getDailyStats(req.user.id, date || getTodayString());
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly analytics matrix
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeekly = async (req, res, next) => {
  try {
    const { date } = req.query;
    const stats = await getWeeklyStats(req.user.id, date || getTodayString());
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly heatmap calendar
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthly = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

    const stats = await getMonthlyHeatmap(req.user.id, year, month);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trends for charts
// @route   GET /api/analytics/trends
// @access  Private
export const getTrendsData = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const trends = await getTrends(req.user.id, days);
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};
