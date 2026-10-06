import express from 'express';
import { 
  createSubscription, 
  getMySubscription,
  cancelSubscription,
  changePlan,
  getSubscriptionHistory
} from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protect, createSubscription);
router.get('/me', protect, getMySubscription);
router.post('/cancel', protect, cancelSubscription);
router.post('/change-plan', protect, changePlan);
router.get('/history', protect, getSubscriptionHistory);

export default router;
