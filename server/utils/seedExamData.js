import mongoose from 'mongoose';
import User from '../models/User.js';
import UserChapterProgress from '../models/UserChapterProgress.js';
import StudyLog from '../models/StudyLog.js';
import { SSC_CHAPTERS, DEFAULT_CHECKPOINTS } from './sscSyllabusData.js';
import { calculateChapterProgress } from '../services/examProgressService.js';
import { getTodayString, getPastDates } from './dateHelper.js';

export const seedUserExamData = async (userId) => {
  // Clear old progress for this user
  await UserChapterProgress.deleteMany({ userId });
  await StudyLog.deleteMany({ userId });

  // Update target exam to SSC CGL with 150 days target
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 150);
  const targetDateStr = targetDate.toISOString().split('T')[0];

  await User.findByIdAndUpdate(userId, {
    'preferences.targetExam': 'ssc_cgl',
    'preferences.targetExamDate': targetDateStr,
    'preferences.dailyStudyHoursGoal': 4,
  });

  const progressRecords = [];

  // Seed sample progress across select chapters in each subject
  const sampleChapters = [
    // Maths
    { id: 'math_1', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'math_2', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'math_3', status: 'completed', practice: 90, pyq: 45, rev: 2, completeCount: 15 },
    { id: 'math_4', status: 'practicing', practice: 75, pyq: 30, rev: 1, completeCount: 9 },
    { id: 'math_5', status: 'practicing', practice: 60, pyq: 20, rev: 1, completeCount: 8 },
    { id: 'math_7', status: 'learning', practice: 20, pyq: 10, rev: 0, completeCount: 4 },
    { id: 'math_18', status: 'revision', practice: 80, pyq: 40, rev: 2, completeCount: 12 },

    // Reasoning
    { id: 'reas_1', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'reas_2', status: 'mastered', practice: 100, pyq: 50, rev: 2, allDone: true },
    { id: 'reas_3', status: 'completed', practice: 85, pyq: 40, rev: 2, completeCount: 14 },
    { id: 'reas_4', status: 'practicing', practice: 65, pyq: 25, rev: 1, completeCount: 7 },
    { id: 'reas_9', status: 'revision', practice: 70, pyq: 35, rev: 2, completeCount: 11 },

    // English
    { id: 'eng_1', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'eng_3', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'eng_4', status: 'completed', practice: 90, pyq: 45, rev: 2, completeCount: 14 },
    { id: 'eng_16', status: 'practicing', practice: 50, pyq: 20, rev: 1, completeCount: 6 },
    { id: 'eng_18', status: 'revision', practice: 80, pyq: 40, rev: 2, completeCount: 12 },

    // GK
    { id: 'gk_14', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'gk_15', status: 'mastered', practice: 100, pyq: 50, rev: 3, allDone: true },
    { id: 'gk_16', status: 'completed', practice: 85, pyq: 40, rev: 2, completeCount: 13 },
    { id: 'gk_3', status: 'practicing', practice: 50, pyq: 20, rev: 1, completeCount: 7 },
    { id: 'gk_8', status: 'revision', practice: 75, pyq: 35, rev: 2, completeCount: 11 },
  ];

  for (const ch of SSC_CHAPTERS) {
    const sample = sampleChapters.find((s) => s.id === ch.id);

    const checkpoints = DEFAULT_CHECKPOINTS.map((cp, idx) => {
      let isCompleted = false;
      if (sample?.allDone) {
        isCompleted = true;
      } else if (sample?.completeCount && idx < sample.completeCount) {
        isCompleted = true;
      }
      return {
        ...cp,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      };
    });

    const { progressPercentage, status } = calculateChapterProgress(checkpoints);

    progressRecords.push({
      userId,
      examId: 'ssc_cgl',
      subjectId: ch.subjectId,
      chapterId: ch.id,
      status: sample ? sample.status : status,
      progressPercentage: sample?.allDone ? 100 : progressPercentage,
      theoryDone: sample?.allDone || (sample?.completeCount || 0) >= 4,
      examplesDone: sample?.allDone || (sample?.completeCount || 0) >= 4,
      practiceSolved: sample?.practice || 0,
      practiceTarget: 100,
      pyqsSolved: sample?.pyq || 0,
      pyqsTarget: 50,
      revisionCount: sample?.rev || 0,
      mockQuestionsSolved: sample?.practice ? Math.round(sample.practice * 0.4) : 0,
      mockQuestionsTarget: 50,
      notes: sample?.allDone ? 'Mastered with full PYQ analysis and formula shortcuts' : '',
      lastStudiedAt: sample ? new Date() : null,
      checkpoints,
    });
  }

  await UserChapterProgress.insertMany(progressRecords);

  // Seed 14 days of realistic study sessions
  const pastDates = getPastDates(14);
  const studyLogsToInsert = [];

  for (let i = 0; i < pastDates.length; i++) {
    const dStr = pastDates[i];
    studyLogsToInsert.push({
      userId,
      date: dStr,
      subjectId: 'maths',
      chapterId: 'math_4',
      chapterName: 'Percentage',
      durationMinutes: 90 + (i % 3) * 30,
      questionsSolved: 40 + (i % 4) * 10,
      topicCovered: 'Percentage conversions, profit/loss correlation & PYQs',
      notes: 'Strong accuracy on Level 2 questions',
    });
    studyLogsToInsert.push({
      userId,
      date: dStr,
      subjectId: 'reasoning',
      chapterId: 'reas_4',
      chapterName: 'Coding-Decoding',
      durationMinutes: 45,
      questionsSolved: 30,
      topicCovered: 'Alphabet shift patterns & matrices',
      notes: 'Speed is improving',
    });
  }

  await StudyLog.insertMany(studyLogsToInsert);
  console.log(`✅ Seeded ${progressRecords.length} chapter records and ${studyLogsToInsert.length} study logs.`);
};
