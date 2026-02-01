/**
 * Database Notification Provider
 * Stores notifications in the Supabase database
 */

import { INotificationProvider } from '../../domain/interfaces/INotificationProvider.js';
import { supabaseAdmin } from '../../utils/supabase.js';

export class DatabaseNotificationProvider extends INotificationProvider {
    constructor() {
        super();
        this.configured = true; // Always configured since it uses the core DB
    }

    /**
     * Store notification in database
     * @param {Object} params
     * @param {string} params.userId - User ID (Internal skip 'to' email for DB)
     * @param {string} params.subject - Title
     * @param {string} params.message - Content
     * @param {Object} params.data - Metadata
     * @returns {Promise<Object>}
     */
    async send({ userId, subject, message, data = {} }) {
        try {
            if (!userId && data.userId) userId = data.userId;

            const { data: inserted, error } = await supabaseAdmin.client
                .from('notifications')
                .insert([
                    {
                        user_id: userId,
                        title: subject,
                        message: this._stripHtml(message),
                        type: data.eventType || 'system',
                        metadata: data,
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            console.log('✓ Notification stored in database for user:', userId);

            return {
                success: true,
                messageId: inserted.id,
                provider: this.getName(),
            };
        } catch (error) {
            console.error('Failed to store database notification:', error.message);
            return {
                success: false,
                error: error.message,
                provider: this.getName(),
            };
        }
    }

    /**
     * Strip HTML tags for database storage
     * @private
     */
    _stripHtml(html) {
        if (typeof html !== 'string') return html;
        // 1. Remove style blocks and their content
        let clean = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        // 2. Remove all other HTML tags
        clean = clean.replace(/<[^>]*>?/gm, '');
        // 3. Clean up whitespace
        return clean.replace(/\s+/g, ' ').trim();
    }

    isConfigured() {
        return true;
    }

    getName() {
        return 'database';
    }
}
