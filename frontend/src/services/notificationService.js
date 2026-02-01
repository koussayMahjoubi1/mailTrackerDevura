import api, { getSupabaseClient } from './api';

export const notificationService = {
    /**
     * Send a test notification to the authenticated user
     */
    async sendTestNotification() {
        try {
            const response = await api.post('/api/notifications/test');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to send test notification' };
        }
    },

    /**
     * Get notification provider status
     */
    async getStatus() {
        try {
            const response = await api.get('/api/notifications/status');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch notification status' };
        }
    },

    /**
     * Get all notifications for the user
     */
    async getNotifications() {
        try {
            const response = await api.get('/api/notifications');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch notifications' };
        }
    },

    /**
     * Mark a notification as read
     */
    async markAsRead(id) {
        try {
            const response = await api.patch(`/api/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to mark notification as read' };
        }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        try {
            const response = await api.put('/api/notifications/read-all');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to mark all notifications as read' };
        }
    },

    /**
     * Delete a notification permanently
     */
    async deleteNotification(id) {
        try {
            const response = await api.delete(`/api/notifications/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to delete notification' };
        }
    },

    /**
     * Delete all notifications permanently
     */
    async deleteAllNotifications() {
        try {
            const response = await api.delete('/api/notifications');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to clear all notifications' };
        }
    },

    /**
     * Subscribe to real-time notifications for the current user
     */
    subscribeToNotifications(onNewNotification) {
        const supabase = getSupabaseClient();

        // Get current user ID
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;

            const channel = supabase
                .channel(`public:notifications:user_id=eq.${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log('🔔 New real-time notification Arrival:', payload.new);
                        onNewNotification(payload.new);
                    }
                )
                .subscribe();

            return channel;
        });
    }
};
