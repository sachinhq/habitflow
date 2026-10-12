import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import { calculateHabitStats } from '../services/streakService.js';
import { checkAndAwardBadges, addXpToUser } from '../services/gamificationService.js';
import { getTodayString } from '../utils/dateHelper.js';

// @desc    Get all habits for logged-in user with dynamic stats
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const { date, category, status } = req.query;
    const targetDate = date || getTodayString();

    const query = { userId: req.user.id };
    if (status === 'archived') {
      query.archived = true;
    } else {
      query.archived = false;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const habits = await Habit.find(query).sort({ order: 1, createdAt: 1 });

    // Fetch all completions for these habits to calculate streak stats
    const habitIds = habits.map((h) => h._id);
    const completions = await HabitCompletion.find({
      userId: req.user.id,
      habitId: { $in: habitIds },
      completed: true,
    });

    // Group completion dates by habitId
    const completionsByHabit = {};
    habitIds.forEach((id) => {
      completionsByHabit[id.toString()] = [];
    });

    completions.forEach((c) => {
      const hId = c.habitId.toString();
      if (completionsByHabit[hId]) {
        completionsByHabit[hId].push(c.date);
      }
    });

    // Enrich each habit with calculated stats
    const enrichedHabits = habits.map((habit) => {
      const dates = completionsByHabit[habit._id.toString()] || [];
      const stats = calculateHabitStats(habit, dates, targetDate);
      return {
        ...habit.toObject(),
        stats,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedHabits.length,
      data: enrichedHabits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit with full completion history
// @route   GET /api/habits/:id
// @access  Private
export const getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const completions = await HabitCompletion.find({
      habitId: habit._id,
      userId: req.user.id,
      completed: true,
    }).sort({ date: -1 });

    const completedDates = completions.map((c) => c.date);
    const stats = calculateHabitStats(habit, completedDates, getTodayString());

    res.status(200).json({
      success: true,
      data: {
        ...habit.toObject(),
        stats,
        completions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      icon,
      color,
      frequency,
      targetDays,
      targetCount,
      unit,
      reminderTime,
      isReminderEnabled,
      startDate,
      endDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Habit name is required' });
    }

    // Get maximum order to place new habit at the end
    const lastHabit = await Habit.findOne({ userId: req.user.id }).sort({ order: -1 });
    const order = lastHabit ? lastHabit.order + 1 : 0;

    const habit = await Habit.create({
      userId: req.user.id,
      name,
      description,
      category: category || 'Personal',
      icon: icon || 'Sparkles',
      color: color || '#6366f1',
      frequency: frequency || 'daily',
      targetDays: targetDays || [0, 1, 2, 3, 4, 5, 6],
      targetCount: targetCount || 1,
      unit: unit || 'time',
      reminderTime: reminderTime || '',
      isReminderEnabled: isReminderEnabled || false,
      startDate: startDate || getTodayString(),
      endDate: endDate || null,
      order,
    });

    // Award XP and check badges
    await addXpToUser(req.user.id, 20);
    const newBadges = await checkAndAwardBadges(req.user.id);

    const stats = calculateHabitStats(habit, [], getTodayString());

    res.status(201).json({
      success: true,
      data: {
        ...habit.toObject(),
        stats,
      },
      unlockedBadges: newBadges,
      message: 'Habit created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res, next) => {
  try {
    let habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const fieldsToUpdate = [
      'name',
      'description',
      'category',
      'icon',
      'color',
      'frequency',
      'targetDays',
      'targetCount',
      'unit',
      'reminderTime',
      'isReminderEnabled',
      'startDate',
      'endDate',
      'archived',
      'order',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    await habit.save();

    // Recompute stats
    const completions = await HabitCompletion.find({
      habitId: habit._id,
      userId: req.user.id,
      completed: true,
    });
    const completedDates = completions.map((c) => c.date);
    const stats = calculateHabitStats(habit, completedDates, getTodayString());

    res.status(200).json({
      success: true,
      data: {
        ...habit.toObject(),
        stats,
      },
      message: 'Habit updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a habit and its completions
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    await Habit.deleteOne({ _id: req.params.id });
    await HabitCompletion.deleteMany({ habitId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Habit and history deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
