import User from '../models/User.js';
import UserChapterProgress from '../models/UserChapterProgress.js';
import StudyLog from '../models/StudyLog.js';
import {
  SSC_EXAMS,
  SSC_SUBJECTS,
  SSC_CHAPTERS,
  DEFAULT_CHECKPOINTS,
} from '../utils/sscSyllabusData.js';
import {
  calculateChapterProgress,
  calculateSubjectAggregate,
} from '../services/examProgressService.js';
import { addXpToUser } from '../services/gamificationService.js';
import { getTodayString } from '../utils/dateHelper.js';

// @desc    Get all supported SSC exams
// @route   GET /api/exam/exams
// @access  Private
export const getExams = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const targetExamId = user?.preferences?.targetExam || 'ssc_cgl';

    const examsWithMeta = SSC_EXAMS.map((exam) => ({
      ...exam,
      isTarget: exam.examId === targetExamId,
      totalSubjects: SSC_SUBJECTS.length,
      totalChapters: SSC_CHAPTERS.length,
    }));

    res.status(200).json({
      success: true,
      data: examsWithMeta,
      targetExamId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or switch target exam
// @route   POST /api/exam/target
// @access  Private
export const setTargetExam = async (req, res, next) => {
  try {
    const { examId, targetDate, dailyStudyHoursGoal } = req.body;
    const user = await User.findById(req.user.id);

    if (examId) {
      user.preferences.targetExam = examId;
    }
    if (targetDate) {
      user.preferences.targetExamDate = targetDate;
    }
    if (dailyStudyHoursGoal) {
      user.preferences.dailyStudyHoursGoal = dailyStudyHoursGoal;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Target exam updated successfully',
      data: {
        targetExam: user.preferences.targetExam,
        targetExamDate: user.preferences.targetExamDate,
        dailyStudyHoursGoal: user.preferences.dailyStudyHoursGoal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Exam Dashboard overview
// @route   GET /api/exam/overview
// @access  Private
export const getExamOverview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const targetExamId = user?.preferences?.targetExam || 'ssc_cgl';
    const targetExam = SSC_EXAMS.find((e) => e.examId === targetExamId) || SSC_EXAMS[0];

    // Calculate days remaining to target exam date
    const targetDateStr = user?.preferences?.targetExamDate || targetExam.targetDate;
    let daysRemaining = null;
    if (targetDateStr) {
      const targetTime = new Date(targetDateStr + 'T00:00:00').getTime();
      const todayTime = new Date(getTodayString() + 'T00:00:00').getTime();
      daysRemaining = Math.max(0, Math.ceil((targetTime - todayTime) / (1000 * 60 * 60 * 24)));
    }

    // Load all user chapter progress
    const progressRecords = await UserChapterProgress.find({ userId: req.user.id });
    const progressMap = new Map(progressRecords.map((r) => [r.chapterId, r]));

    // Build subject aggregates
    const subjectsAggregate = SSC_SUBJECTS.map((subject) => {
      const subjectChapters = SSC_CHAPTERS.filter((ch) => ch.subjectId === subject.subjectId);
      return calculateSubjectAggregate(subject, subjectChapters, progressMap);
    });

    // Overall exam metrics
    const totalChapters = SSC_CHAPTERS.length;
    let totalProgressSum = 0;
    let masteredCount = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    let totalQuestionsSolved = 0;

    subjectsAggregate.forEach((subj) => {
      totalProgressSum += subj.overallProgress;
      masteredCount += subj.masteredCount;
      completedCount += subj.completedCount;
      inProgressCount += subj.inProgressCount;
      totalQuestionsSolved += subj.totalPracticeSolved + subj.totalPyqsSolved;
    });

    const overallProgress =
      subjectsAggregate.length > 0 ? Math.round(totalProgressSum / subjectsAggregate.length) : 0;

    // Today's Study Log stats
    const todayStr = getTodayString();
    const todayLogs = await StudyLog.find({ userId: req.user.id, date: todayStr });
    const todayMinutes = todayLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
    const todayQuestions = todayLogs.reduce((acc, log) => acc + log.questionsSolved, 0);
    const todayHours = (todayMinutes / 60).toFixed(1);

    // Recent studied chapters
    const recentProgress = await UserChapterProgress.find({
      userId: req.user.id,
      lastStudiedAt: { $ne: null },
    })
      .sort({ lastStudiedAt: -1 })
      .limit(5);

    const recentChapters = recentProgress.map((p) => {
      const meta = SSC_CHAPTERS.find((ch) => ch.id === p.chapterId);
      const subj = SSC_SUBJECTS.find((s) => s.subjectId === p.subjectId);
      return {
        chapterId: p.chapterId,
        name: meta?.name || p.chapterId,
        subjectId: p.subjectId,
        subjectName: subj?.name || p.subjectId,
        subjectColor: subj?.color || '#3b82f6',
        progressPercentage: p.progressPercentage,
        status: p.status,
        lastStudiedAt: p.lastStudiedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        targetExam: {
          ...targetExam,
          targetDate: targetDateStr,
          daysRemaining,
        },
        dailyGoalHours: user?.preferences?.dailyStudyHoursGoal || 4,
        overallProgress,
        totalChapters,
        masteredCount,
        completedCount,
        inProgressCount,
        totalQuestionsSolved,
        todayStats: {
          minutes: todayMinutes,
          hours: todayHours,
          questions: todayQuestions,
        },
        subjects: subjectsAggregate,
        recentChapters,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full SSC syllabus with progress
// @route   GET /api/exam/syllabus
// @access  Private
export const getSyllabus = async (req, res, next) => {
  try {
    const progressRecords = await UserChapterProgress.find({ userId: req.user.id });
    const progressMap = new Map(progressRecords.map((r) => [r.chapterId, r]));

    const subjectsWithChapters = SSC_SUBJECTS.map((subject) => {
      const subjectChapters = SSC_CHAPTERS.filter((ch) => ch.subjectId === subject.subjectId);
      return calculateSubjectAggregate(subject, subjectChapters, progressMap);
    });

    res.status(200).json({
      success: true,
      data: subjectsWithChapters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chapter details, stats, and checkpoints
// @route   GET /api/exam/chapters/:chapterId
// @access  Private
export const getChapterDetail = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const chapterMeta = SSC_CHAPTERS.find((ch) => ch.id === chapterId);

    if (!chapterMeta) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const subjectMeta = SSC_SUBJECTS.find((s) => s.subjectId === chapterMeta.subjectId);

    // Find or initialize user chapter progress
    let userProgress = await UserChapterProgress.findOne({
      userId: req.user.id,
      chapterId,
    });

    if (!userProgress) {
      userProgress = await UserChapterProgress.create({
        userId: req.user.id,
        subjectId: chapterMeta.subjectId,
        chapterId,
        status: 'not_started',
        progressPercentage: 0,
        checkpoints: DEFAULT_CHECKPOINTS,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...chapterMeta,
        subjectName: subjectMeta?.name || '',
        subjectColor: subjectMeta?.color || '#3b82f6',
        ...userProgress.toObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle checkpoint completion status
// @route   POST /api/exam/chapters/:chapterId/checkpoints/:checkpointId/toggle
// @access  Private
export const toggleCheckpoint = async (req, res, next) => {
  try {
    const { chapterId, checkpointId } = req.params;

    const chapterMeta = SSC_CHAPTERS.find((ch) => ch.id === chapterId);
    if (!chapterMeta) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    let progress = await UserChapterProgress.findOne({
      userId: req.user.id,
      chapterId,
    });

    if (!progress) {
      progress = await UserChapterProgress.create({
        userId: req.user.id,
        subjectId: chapterMeta.subjectId,
        chapterId,
        checkpoints: DEFAULT_CHECKPOINTS,
      });
    }

    // Locate checkpoint
    const cpIndex = progress.checkpoints.findIndex((cp) => cp.id === checkpointId);
    if (cpIndex === -1) {
      return res.status(404).json({ success: false, message: 'Checkpoint not found' });
    }

    const targetCp = progress.checkpoints[cpIndex];
    const newCompleted = !targetCp.isCompleted;
    targetCp.isCompleted = newCompleted;
    targetCp.completedAt = newCompleted ? new Date() : null;

    // Recalculate weighted percentage & status
    const result = calculateChapterProgress(progress.checkpoints);
    progress.progressPercentage = result.progressPercentage;
    progress.status = result.status;
    progress.lastStudiedAt = new Date();

    await progress.save();

    // Award XP on completing checkpoint
    let xpGained = 0;
    if (newCompleted) {
      xpGained = 10;
      if (result.status === 'mastered') {
        xpGained += 50; // Bonus for mastering chapter!
      }
      await addXpToUser(req.user.id, xpGained);
    }

    res.status(200).json({
      success: true,
      data: progress,
      xpGained,
      message: newCompleted ? 'Checkpoint completed!' : 'Checkpoint uncompleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add custom checkpoint to a chapter
// @route   POST /api/exam/chapters/:chapterId/checkpoints
// @access  Private
export const addCustomCheckpoint = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const { title, description, category, target, deadline, priority } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Checkpoint title is required' });
    }

    const chapterMeta = SSC_CHAPTERS.find((ch) => ch.id === chapterId);
    let progress = await UserChapterProgress.findOne({
      userId: req.user.id,
      chapterId,
    });

    if (!progress) {
      progress = await UserChapterProgress.create({
        userId: req.user.id,
        subjectId: chapterMeta?.subjectId || 'maths',
        chapterId,
        checkpoints: DEFAULT_CHECKPOINTS,
      });
    }

    const newCp = {
      id: `custom_${Date.now()}`,
      title,
      description: description || '',
      category: category || 'custom',
      weight: 5,
      isCompleted: false,
      priority: priority || 'medium',
      target: target || '',
      deadline: deadline || '',
    };

    progress.checkpoints.push(newCp);
    const result = calculateChapterProgress(progress.checkpoints);
    progress.progressPercentage = result.progressPercentage;
    progress.status = result.status;

    await progress.save();

    res.status(201).json({
      success: true,
      data: progress,
      message: 'Custom checkpoint added',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete checkpoint from a chapter
// @route   DELETE /api/exam/chapters/:chapterId/checkpoints/:checkpointId
// @access  Private
export const deleteCheckpoint = async (req, res, next) => {
  try {
    const { chapterId, checkpointId } = req.params;

    const progress = await UserChapterProgress.findOne({
      userId: req.user.id,
      chapterId,
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Chapter progress not found' });
    }

    progress.checkpoints = progress.checkpoints.filter((cp) => cp.id !== checkpointId);
    const result = calculateChapterProgress(progress.checkpoints);
    progress.progressPercentage = result.progressPercentage;
    progress.status = result.status;

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Checkpoint deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chapter practice & question stats
// @route   PUT /api/exam/chapters/:chapterId/stats
// @access  Private
export const updateChapterStats = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const {
      theoryDone,
      examplesDone,
      practiceSolved,
      practiceTarget,
      pyqsSolved,
      pyqsTarget,
      revisionCount,
      mockQuestionsSolved,
      mockQuestionsTarget,
      status,
      notes,
    } = req.body;

    const chapterMeta = SSC_CHAPTERS.find((ch) => ch.id === chapterId);
    let progress = await UserChapterProgress.findOne({
      userId: req.user.id,
      chapterId,
    });

    if (!progress) {
      progress = await UserChapterProgress.create({
        userId: req.user.id,
        subjectId: chapterMeta?.subjectId || 'maths',
        chapterId,
        checkpoints: DEFAULT_CHECKPOINTS,
      });
    }

    if (theoryDone !== undefined) progress.theoryDone = theoryDone;
    if (examplesDone !== undefined) progress.examplesDone = examplesDone;
    if (practiceSolved !== undefined) progress.practiceSolved = practiceSolved;
    if (practiceTarget !== undefined) progress.practiceTarget = practiceTarget;
    if (pyqsSolved !== undefined) progress.pyqsSolved = pyqsSolved;
    if (pyqsTarget !== undefined) progress.pyqsTarget = pyqsTarget;
    if (revisionCount !== undefined) progress.revisionCount = revisionCount;
    if (mockQuestionsSolved !== undefined) progress.mockQuestionsSolved = mockQuestionsSolved;
    if (mockQuestionsTarget !== undefined) progress.mockQuestionsTarget = mockQuestionsTarget;
    if (status !== undefined) progress.status = status;
    if (notes !== undefined) progress.notes = notes;

    progress.lastStudiedAt = new Date();
    await progress.save();

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Chapter statistics updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log daily study session
// @route   POST /api/exam/study-log
// @access  Private
export const logStudySession = async (req, res, next) => {
  try {
    const {
      subjectId,
      chapterId,
      chapterName,
      durationMinutes,
      questionsSolved,
      topicCovered,
      notes,
      date,
    } = req.body;

    if (!subjectId || !durationMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Subject and duration in minutes are required',
      });
    }

    const logDate = date || getTodayString();

    const studyLog = await StudyLog.create({
      userId: req.user.id,
      date: logDate,
      subjectId,
      chapterId: chapterId || '',
      chapterName: chapterName || '',
      durationMinutes: parseInt(durationMinutes, 10),
      questionsSolved: parseInt(questionsSolved, 10) || 0,
      topicCovered: topicCovered || '',
      notes: notes || '',
    });

    // Update chapter's question count if chapterId is present
    if (chapterId && questionsSolved > 0) {
      await UserChapterProgress.findOneAndUpdate(
        { userId: req.user.id, chapterId },
        {
          $inc: { practiceSolved: parseInt(questionsSolved, 10) },
          lastStudiedAt: new Date(),
        }
      );
    }

    // Award XP (+10 XP per 30 mins)
    const xpToAdd = Math.max(10, Math.round((durationMinutes / 30) * 10));
    await addXpToUser(req.user.id, xpToAdd);

    res.status(201).json({
      success: true,
      data: studyLog,
      xpGained: xpToAdd,
      message: `Logged ${durationMinutes} minutes of focused study! (+${xpToAdd} XP)`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get study logs
// @route   GET /api/exam/study-logs
// @access  Private
export const getStudyLogs = async (req, res, next) => {
  try {
    const { date, limit = 20 } = req.query;
    const query = { userId: req.user.id };
    if (date) query.date = date;

    const logs = await StudyLog.find(query).sort({ createdAt: -1 }).limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Exam analytics for charts
// @route   GET /api/exam/analytics
// @access  Private
export const getExamAnalytics = async (req, res, next) => {
  try {
    const progressRecords = await UserChapterProgress.find({ userId: req.user.id });
    const progressMap = new Map(progressRecords.map((r) => [r.chapterId, r]));

    // Subject breakdown
    const subjectStats = SSC_SUBJECTS.map((subj) => {
      const subjectChapters = SSC_CHAPTERS.filter((ch) => ch.subjectId === subj.subjectId);
      const aggregate = calculateSubjectAggregate(subj, subjectChapters, progressMap);
      return {
        subject: subj.shortName,
        fullName: subj.name,
        color: subj.color,
        completion: aggregate.overallProgress,
        mastered: aggregate.masteredCount,
        total: aggregate.totalChapters,
      };
    });

    // Mastery distribution status count
    const statusCounts = {
      mastered: 0,
      completed: 0,
      revision: 0,
      practicing: 0,
      learning: 0,
      not_started: 0,
    };

    SSC_CHAPTERS.forEach((ch) => {
      const userProgress = progressMap.get(ch.id);
      const st = userProgress?.status || 'not_started';
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      } else {
        statusCounts.not_started += 1;
      }
    });

    const masteryDistribution = [
      { name: 'Mastered 🏆', value: statusCounts.mastered, color: '#10b981' },
      { name: 'Completed 🟢', value: statusCounts.completed, color: '#3b82f6' },
      { name: 'Revision 🟠', value: statusCounts.revision, color: '#f59e0b' },
      { name: 'Practicing 🟡', value: statusCounts.practicing, color: '#eab308' },
      { name: 'Learning 🔵', value: statusCounts.learning, color: '#6366f1' },
      { name: 'Not Started ⚪', value: statusCounts.not_started, color: '#94a3b8' },
    ];

    // Recent 7 days study hours
    const recentLogs = await StudyLog.find({ userId: req.user.id }).sort({ date: -1 }).limit(100);
    const dayMap = {};
    recentLogs.forEach((l) => {
      if (!dayMap[l.date]) {
        dayMap[l.date] = { date: l.date, minutes: 0, questions: 0 };
      }
      dayMap[l.date].minutes += l.durationMinutes;
      dayMap[l.date].questions += l.questionsSolved;
    });

    const studyTrend = Object.values(dayMap)
      .slice(0, 14)
      .reverse()
      .map((item) => ({
        date: item.date,
        formattedDate: new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        hours: parseFloat((item.minutes / 60).toFixed(1)),
        questions: item.questions,
      }));

    res.status(200).json({
      success: true,
      data: {
        subjectStats,
        masteryDistribution,
        studyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};
