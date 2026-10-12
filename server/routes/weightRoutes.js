import express from 'express';
import {
  getWeightData,
  logWeight,
  deleteWeightLog,
  updateWeightPreferences,
} from '../controllers/weightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWeightData)
  .post(logWeight);

router.route('/preferences')
  .put(updateWeightPreferences);

router.route('/:id')
  .delete(deleteWeightLog);

export default router;
