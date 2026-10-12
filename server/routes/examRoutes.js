import express from 'express';
import {
  getExams,
  setTargetExam,
  getExamOverview,
  getSyllabus,
  getChapterDetail,
  toggleCheckpoint,
  addCustomCheckpoint,
  deleteCheckpoint,
  updateChapterStats,
  logStudySession,
  getStudyLogs,
  getExamAnalytics,
} from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/exams', getExams);
router.post('/target', setTargetExam);
router.get('/overview', getExamOverview);
router.get('/syllabus', getSyllabus);

// Chapter details & checkpoints
router.get('/chapters/:chapterId', getChapterDetail);
router.post('/chapters/:chapterId/checkpoints/:checkpointId/toggle', toggleCheckpoint);
router.post('/chapters/:chapterId/checkpoints', addCustomCheckpoint);
router.delete('/chapters/:chapterId/checkpoints/:checkpointId', deleteCheckpoint);
router.put('/chapters/:chapterId/stats', updateChapterStats);

// Study logging & analytics
router.post('/study-log', logStudySession);
router.get('/study-logs', getStudyLogs);
router.get('/analytics', getExamAnalytics);

export default router;
