import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import { calculateHabitStats } from '../services/streakService.js';
import { checkAndAwardBadges, addXpToUser } from '../services/gamificationService.js';
import { getTodayString } from '../utils/dateHelper.js';

// @desc    Toggle habit completion status for a given date
// @route   POST /api/habits/:id/toggle
// @access  Private
export const toggleCompletion = async (req, res, next) => {
  try {
    const { id: habitId } = req.params;
    const { date, notes, value } = req.body;
    const targetDate = date || getTodayString();

    const habit = await Habit.findOne({ _id: habitId, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    let completion = await HabitCompletion.findOne({
      userId: req.user.id,
      habitId,
      date: targetDate,
    });

    let isNowCompleted = false;
    let xpGained = 0;
    let unlockedBadges = [];

    if (completion && completion.completed) {
      // Toggle to incomplete
      completion.completed = false;
      await completion.save();
      isNowCompleted = false;
    } else {
      // Mark as complete
      if (completion) {
        completion.completed = true;
        if (notes !== undefined) completion.notes = notes;
        if (value !== undefined) completion.value = value;
        await completion.save();
      } else {
        completion = await HabitCompletion.create({
          userId: req.user.id,
          habitId,
          date: targetDate,
          completed: true,
          notes: notes || '',
          value: value || habit.targetCount || 1,
        });
      }
      isNowCompleted = true;
      xpGained = 15;
      await addXpToUser(req.user.id, xpGained);
    }

    // Fetch all completed dates for recalculation
    const allCompletions = await HabitCompletion.find({
      userId: req.user.id,
      habitId,
      completed: true,
    });
    const completedDates = allCompletions.map((c) => c.date);
    const updatedStats = calculateHabitStats(habit, completedDates, targetDate);

    // If completed, check for achievements
    if (isNowCompleted) {
      unlockedBadges = await checkAndAwardBadges(req.user.id, updatedStats.currentStreak);
    }

    res.status(200).json({
      success: true,
      data: {
        habitId,
        date: targetDate,
        completed: isNowCompleted,
        stats: updatedStats,
        notes: completion ? completion.notes : '',
      },
      xpGained,
      unlockedBadges,
      message: isNowCompleted ? 'Great job! Habit completed!' : 'Habit marked as incomplete',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update notes on a completion record
// @route   PUT /api/habits/:id/notes
// @access  Private
export const updateNotes = async (req, res, next) => {
  try {
    const { id: habitId } = req.params;
    const { date, notes } = req.body;
    const targetDate = date || getTodayString();

    let completion = await HabitCompletion.findOne({
      userId: req.user.id,
      habitId,
      date: targetDate,
    });

    if (!completion) {
      completion = await HabitCompletion.create({
        userId: req.user.id,
        habitId,
        date: targetDate,
        completed: false,
        notes: notes || '',
      });
    } else {
      completion.notes = notes || '';
      await completion.save();
    }

    res.status(200).json({
      success: true,
      data: completion,
      message: 'Note saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all completions for a specific date
// @route   GET /api/completions/date/:date
// @access  Private
export const getCompletionsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const completions = await HabitCompletion.find({
      userId: req.user.id,
      date,
      completed: true,
    });

    res.status(200).json({
      success: true,
      date,
      data: completions,
    });
  } catch (error) {
    next(error);
  }
};
