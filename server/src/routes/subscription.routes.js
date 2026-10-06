import express from 'express';
import { createSubscription, getMySubscription } from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protect, createSubscription);
router.get('/me', protect, getMySubscription);

export default router;
