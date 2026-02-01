/**
 * Notification Controller
 * Handles HTTP requests for notification-related operations
 */

import { NotificationService } from '../services/notification.service.js';
import { supabaseAdmin } from '../utils/supabase.js';

export class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    /**
     * Send a test notification
     * POST /api/notifications/test
     */
    async sendTestNotification(req, res, next) {
        try {
            console.log('🧪 Test notification endpoint hit');

            if (!req.user || !req.user.id) {
                console.error('❌ No user found in request');
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const userId = req.user.id;
            console.log('🧪 Sending test notification for user:', userId);

            try {
                const result = await this.notificationService.sendTestNotification(userId);

                console.log('📊 Test notification result:', JSON.stringify(result, null, 2));

                if (result.success) {
                    return res.json({
                        message: result.message,
                        primarySuccess: result.primarySuccess,
                        result,
                    });
                } else {
                    console.error('❌ Test notification failed:', result);
                    return res.status(500).json({
                        error: 'Failed to process notification',
                        results: result.results,
                        message: 'Database storage failed, which is a critical error.'
                    });
                }
            } catch (serviceError) {
                console.error('❌ Service error:', serviceError);
                return res.status(500).json({
                    error: 'Service error',
                    message: serviceError.message,
                    stack: serviceError.stack
                });
            }
        } catch (error) {
            console.error('❌ Critical error in sendTestNotification:', error);
            return res.status(500).json({
                error: 'Critical error',
                message: error.message,
                stack: error.stack
            });
        }
    }

    /**
     * Get notification provider status
     * GET /api/notifications/status
     */
    async getProviderStatus(req, res, next) {
        try {
            const status = this.notificationService.getProviderStatus();
            res.json({ status });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user notifications
     * GET /api/notifications
     */
    async getNotifications(req, res, next) {
        try {
            const userId = req.user.id;
            const { data: notifications, error } = await supabaseAdmin.client
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            res.json({
                notifications: notifications || [],
                count: notifications?.length || 0
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabaseAdmin.client
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id)
                .eq('user_id', req.user.id);

            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(req, res, next) {
        try {
            const { error } = await supabaseAdmin.client
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', req.user.id)
                .eq('is_read', false);

            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a specific notification
     */
    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = await supabaseAdmin.client
                .from('notifications')
                .delete()
                .eq('id', id)
                .eq('user_id', req.user.id);

            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete all notifications for the user
     */
    async deleteAllNotifications(req, res, next) {
        try {
            const { error } = await supabaseAdmin.client
                .from('notifications')
                .delete()
                .eq('user_id', req.user.id);

            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }
}
