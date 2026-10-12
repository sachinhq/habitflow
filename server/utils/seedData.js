import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import Achievement from '../models/Achievement.js';
import { BADGE_DEFINITIONS } from '../services/gamificationService.js';
import { getTodayString, getPastDates, formatDate } from './dateHelper.js';
import { seedUserExamData } from './seedExamData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const seedUserData = async (userId) => {
  // Clear existing habits and completions for this user
  await Habit.deleteMany({ userId });
  await HabitCompletion.deleteMany({ userId });
  await Achievement.deleteMany({ userId });

  const habitsData = [
    {
      name: 'Morning Walk',
      description: '30-minute brisk walk outdoors to start the day with fresh air',
      category: 'Fitness',
      icon: 'Footprints',
      color: '#10b981', // Emerald
      frequency: 'daily',
      targetCount: 30,
      unit: 'mins',
      reminderTime: '07:00',
      isReminderEnabled: true,
      startDate: getPastDates(60)[0],
      order: 0,
      completionRateBias: 0.92, // 92% completion rate
    },
    {
      name: 'Drink 3L Water',
      description: 'Stay hydrated throughout the day with clean water',
      category: 'Health',
      icon: 'Droplets',
      color: '#06b6d4', // Cyan
      frequency: 'daily',
      targetCount: 3,
      unit: 'liters',
      reminderTime: '09:00',
      isReminderEnabled: true,
      startDate: getPastDates(60)[0],
      order: 1,
      completionRateBias: 0.88,
    },
    {
      name: 'Read 20 Pages',
      description: 'Non-fiction books on technology, psychology, and personal growth',
      category: 'Reading',
      icon: 'BookOpen',
      color: '#8b5cf6', // Violet
      frequency: 'daily',
      targetCount: 20,
      unit: 'pages',
      reminderTime: '21:00',
      isReminderEnabled: true,
      startDate: getPastDates(60)[0],
      order: 2,
      completionRateBias: 0.82,
    },
    {
      name: 'Practice Coding',
      description: 'LeetCode algorithms or building modern full-stack web applications',
      category: 'Coding',
      icon: 'Code',
      color: '#3b82f6', // Blue
      frequency: 'specific_days',
      targetDays: [1, 2, 3, 4, 5], // Monday through Friday
      targetCount: 60,
      unit: 'mins',
      reminderTime: '18:00',
      isReminderEnabled: true,
      startDate: getPastDates(60)[0],
      order: 3,
      completionRateBias: 0.85,
    },
    {
      name: 'Study DBMS',
      description: 'Database indexing, normalization, and ACID transaction internals',
      category: 'Study',
      icon: 'GraduationCap',
      color: '#f59e0b', // Amber
      frequency: 'daily',
      targetCount: 45,
      unit: 'mins',
      reminderTime: '15:00',
      isReminderEnabled: false,
      startDate: getPastDates(60)[0],
      order: 4,
      completionRateBias: 0.78,
    },
    {
      name: 'Sleep Before 11 PM',
      description: 'Consistent sleep hygiene and screen curfew for recovery',
      category: 'Sleep',
      icon: 'Moon',
      color: '#6366f1', // Indigo
      frequency: 'daily',
      targetCount: 1,
      unit: 'time',
      reminderTime: '22:30',
      isReminderEnabled: true,
      startDate: getPastDates(60)[0],
      order: 5,
      completionRateBias: 0.75,
    },
    {
      name: 'Mindful Meditation',
      description: '15 minutes of breathing meditation and mental clarity',
      category: 'Personal',
      icon: 'Heart',
      color: '#ec4899', // Pink
      frequency: 'daily',
      targetCount: 15,
      unit: 'mins',
      reminderTime: '08:00',
      isReminderEnabled: false,
      startDate: getPastDates(60)[0],
      order: 6,
      completionRateBias: 0.80,
    },
  ];

  const createdHabits = [];
  for (const hData of habitsData) {
    const { completionRateBias, ...habitProps } = hData;
    const habit = await Habit.create({
      ...habitProps,
      userId,
    });
    createdHabits.push({ habit, completionRateBias });
  }

  // Generate 60 days of historical completions
  const pastDates = getPastDates(60);
  const completionsToInsert = [];

  for (const { habit, completionRateBias } of createdHabits) {
    for (let i = 0; i < pastDates.length; i++) {
      const dateStr = pastDates[i];
      const isToday = i === pastDates.length - 1;

      // Check if scheduled
      const dateObj = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = dateObj.getDay();

      if (habit.frequency === 'specific_days' && !habit.targetDays.includes(dayOfWeek)) {
        continue;
      }

      // Keep recent streak intact for the last 14 days on most habits
      const isRecentStreakDay = i >= pastDates.length - 14;
      const shouldComplete = isRecentStreakDay
        ? Math.random() < 0.95
        : Math.random() < completionRateBias;

      if (shouldComplete) {
        completionsToInsert.push({
          userId,
          habitId: habit._id,
          date: dateStr,
          completed: true,
          value: habit.targetCount,
          notes: i % 10 === 0 ? 'Felt energized and focused today!' : '',
        });
      }
    }
  }

  await HabitCompletion.insertMany(completionsToInsert);

  // Award milestone badges
  const badgesToUnlock = ['first_habit', 'first_completion', 'streak_7', 'streak_30', 'completions_50', 'well_rounded'];
  for (const badgeId of badgesToUnlock) {
    const def = BADGE_DEFINITIONS.find((b) => b.badgeId === badgeId);
    if (def) {
      await Achievement.create({
        userId,
        badgeId: def.badgeId,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category,
        unlockedAt: new Date(Date.now() - Math.floor(Math.random() * 15 * 86400000)),
      });
    }
  }

  // Set user XP & level
  await User.findByIdAndUpdate(userId, {
    xp: 480,
    level: 4,
  });

  // Seed comprehensive SSC Exam preparation data
  await seedUserExamData(userId);

  console.log(`✅ Seeded ${createdHabits.length} habits and ${completionsToInsert.length} completions for user.`);
};

// Direct script execution
const runSeed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitflow';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Find or create demo user
    let demoUser = await User.findOne({ email: 'alex.demo@habitflow.app' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Demo',
        email: 'alex.demo@habitflow.app',
        password: 'password123',
        xp: 0,
        level: 1,
      });
    }

    await seedUserData(demoUser._id);
    console.log('✨ Demo database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed();
}
