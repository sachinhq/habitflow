import express from 'express';
import { getCompletionsByDate } from '../controllers/completionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/date/:date', getCompletionsByDate);

export default router;
