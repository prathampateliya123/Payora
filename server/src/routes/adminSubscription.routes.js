import express from 'express';
import { getAdminSubscriptions } from '../controllers/adminSubscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { admin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getAdminSubscriptions);

export default router;
