import express from 'express';
import {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
} from '../controllers/habitController.js';
import {
  toggleCompletion,
  updateNotes,
} from '../controllers/completionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .get(getHabitById)
  .put(updateHabit)
  .delete(deleteHabit);

// Habit tracking completion and notes endpoints
router.post('/:id/toggle', toggleCompletion);
router.post('/:id/complete', toggleCompletion);
router.delete('/:id/complete', toggleCompletion);
router.put('/:id/notes', updateNotes);

export default router;
