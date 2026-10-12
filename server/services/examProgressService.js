import { DEFAULT_CHECKPOINTS } from '../utils/sscSyllabusData.js';

/**
 * Calculates weighted chapter progress percentage (0 - 100) and evaluated status.
 * Category weights:
 * - learn: 20%
 * - practice: 30%
 * - pyq: 25%
 * - revision: 15%
 * - test: 10%
 */
export const calculateChapterProgress = (checkpoints = []) => {
  if (!checkpoints || checkpoints.length === 0) {
    return { progressPercentage: 0, status: 'not_started' };
  }

  // Group checkpoints by category
  const categories = ['learn', 'practice', 'pyq', 'revision', 'test', 'custom'];
  const categoryMaxWeight = {
    learn: 20,
    practice: 30,
    pyq: 25,
    revision: 15,
    test: 10,
    custom: 10, // bonus or rebalanced
  };

  let totalEarnedScore = 0;
  let totalAvailableScore = 0;

  // Calculate per category
  categories.forEach((cat) => {
    const catItems = checkpoints.filter((cp) => cp.category === cat);
    if (catItems.length > 0) {
      const maxWeightForCat = categoryMaxWeight[cat] || 10;
      totalAvailableScore += maxWeightForCat;

      const completedCount = catItems.filter((cp) => cp.isCompleted).length;
      const catEarned = (completedCount / catItems.length) * maxWeightForCat;
      totalEarnedScore += catEarned;
    }
  });

  const progressPercentage =
    totalAvailableScore > 0
      ? Math.min(100, Math.round((totalEarnedScore / totalAvailableScore) * 100))
      : 0;

  // Determine automatic status
  const allCompleted = checkpoints.every((cp) => cp.isCompleted);
  const anyCompleted = checkpoints.some((cp) => cp.isCompleted);

  let status = 'not_started';
  if (allCompleted && checkpoints.length > 0) {
    status = 'mastered';
  } else if (progressPercentage >= 85) {
    status = 'completed';
  } else if (progressPercentage >= 60) {
    status = 'revision';
  } else if (progressPercentage >= 25) {
    status = 'practicing';
  } else if (anyCompleted || progressPercentage > 0) {
    status = 'learning';
  }

  return {
    progressPercentage,
    status,
    totalCheckpoints: checkpoints.length,
    completedCheckpoints: checkpoints.filter((cp) => cp.isCompleted).length,
  };
};

/**
 * Summarizes subject-level analytics from chapter progress records
 */
export const calculateSubjectAggregate = (subject, subjectChapters, progressMap) => {
  let totalProgressSum = 0;
  let masteredCount = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;
  let needsRevisionCount = 0;
  let totalPracticeSolved = 0;
  let totalPyqsSolved = 0;

  const chaptersWithProgress = subjectChapters.map((ch) => {
    const userProgress = progressMap.get(ch.id);
    const progress = userProgress?.progressPercentage || 0;
    const status = userProgress?.status || 'not_started';
    const practiceSolved = userProgress?.practiceSolved || 0;
    const pyqsSolved = userProgress?.pyqsSolved || 0;

    totalProgressSum += progress;
    totalPracticeSolved += practiceSolved;
    totalPyqsSolved += pyqsSolved;

    if (status === 'mastered') masteredCount += 1;
    else if (status === 'completed') completedCount += 1;
    else if (status === 'revision') needsRevisionCount += 1;
    else if (status === 'not_started') notStartedCount += 1;
    else inProgressCount += 1;

    return {
      ...ch,
      progressPercentage: progress,
      status,
      theoryDone: userProgress?.theoryDone || false,
      practiceSolved,
      practiceTarget: userProgress?.practiceTarget || 100,
      pyqsSolved,
      pyqsTarget: userProgress?.pyqsTarget || 50,
      revisionCount: userProgress?.revisionCount || 0,
      mockQuestionsSolved: userProgress?.mockQuestionsSolved || 0,
      mockQuestionsTarget: userProgress?.mockQuestionsTarget || 50,
      lastStudiedAt: userProgress?.lastStudiedAt || null,
      notes: userProgress?.notes || '',
    };
  });

  const totalChapters = subjectChapters.length;
  const overallProgress =
    totalChapters > 0 ? Math.round(totalProgressSum / totalChapters) : 0;

  return {
    ...subject,
    totalChapters,
    overallProgress,
    masteredCount,
    completedCount,
    inProgressCount,
    needsRevisionCount,
    notStartedCount,
    totalPracticeSolved,
    totalPyqsSolved,
    chapters: chaptersWithProgress,
  };
};
