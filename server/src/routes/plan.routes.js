import express from 'express';
import { getPlans, createRazorpayPlan } from '../controllers/plan.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { admin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getPlans);
router.post('/:id/razorpay-plan', protect, admin, createRazorpayPlan);

export default router;
