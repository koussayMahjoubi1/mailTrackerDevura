/**
 * Notification Routes
 * API endpoints for testing and managing notifications
 */

import express from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const notificationController = new NotificationController();

// Simple health check for this route
router.get('/health', (req, res) => {
    res.json({ status: 'Notification routes loaded', timestamp: new Date().toISOString() });
});

/**
 * POST /api/notifications/test
 * Send a test notification to the authenticated user
 */
router.post('/test', authenticate, (req, res, next) => {
    notificationController.sendTestNotification(req, res, next);
});

/**
 * GET /api/notifications/status
 * Get the status of notification providers
 */
router.get('/status', authenticate, (req, res, next) => {
    notificationController.getProviderStatus(req, res, next);
});

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user
 */
router.get('/', authenticate, (req, res, next) => {
    notificationController.getNotifications(req, res, next);
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a specific notification as read
 */
router.patch('/:id/read', authenticate, (req, res, next) => {
    notificationController.markAsRead(req, res, next);
});

/**
 * PUT /api/notifications/read-all
 * Mark all user notifications as read
 */
router.put('/read-all', authenticate, (req, res, next) => {
    notificationController.markAllAsRead(req, res, next);
});

/**
 * DELETE /api/notifications/:id
 * Delete a specific notification
 */
router.delete('/:id', authenticate, (req, res, next) => {
    notificationController.deleteNotification(req, res, next);
});

/**
 * DELETE /api/notifications
 * Delete all user notifications
 */
router.delete('/', authenticate, (req, res, next) => {
    notificationController.deleteAllNotifications(req, res, next);
});

export default router;
