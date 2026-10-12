import express from 'express';
import {
  getProfile,
  updateProfile,
  getAchievements,
  seedDemo,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/achievements', getAchievements);
router.post('/seed-demo', seedDemo);

export default router;
