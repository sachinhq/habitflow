import express from 'express';
import {
  getOverview,
  getDaily,
  getWeekly,
  getMonthly,
  getTrendsData,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/daily', getDaily);
router.get('/weekly', getWeekly);
router.get('/monthly', getMonthly);
router.get('/trends', getTrendsData);

export default router;
