import express from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const dashboardController = new DashboardController();

router.use(authenticate);

router.get('/metrics', dashboardController.getMetrics.bind(dashboardController));

export default router;

