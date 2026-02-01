/**
 * User Repository
 * Handles data access for user information
 */

import { supabaseAdmin } from '../utils/supabase.js';

export class UserRepository {
    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User object
     */
    async getUserById(userId) {
        const { data, error } = await supabaseAdmin.client.auth.admin.getUserById(userId);

        if (error) {
            console.error('Error fetching user:', error.message);
            throw error;
        }

        return data.user;
    }

    /**
     * Get user email by user ID
     * @param {string} userId - User ID
     * @returns {Promise<string>} User email
     */
    async getUserEmail(userId) {
        const user = await this.getUserById(userId);
        return user?.email || null;
    }

    /**
     * Get multiple users by IDs
     * @param {string[]} userIds - Array of user IDs
     * @returns {Promise<Object[]>} Array of user objects
     */
    async getUsersByIds(userIds) {
        const users = [];

        for (const userId of userIds) {
            try {
                const user = await this.getUserById(userId);
                if (user) {
                    users.push(user);
                }
            } catch (error) {
                console.error(`Failed to fetch user ${userId}:`, error.message);
            }
        }

        return users;
    }
}
