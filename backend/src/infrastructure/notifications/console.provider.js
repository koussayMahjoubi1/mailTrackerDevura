/**
 * Console Notification Provider
 * Useful for development and testing - logs notifications to console
 */

import { INotificationProvider } from '../../domain/interfaces/INotificationProvider.js';

export class ConsoleNotificationProvider extends INotificationProvider {
    constructor() {
        super();
    }

    /**
     * Send a console notification (log to console)
     * @param {Object} params
     * @param {string} params.to - Recipient identifier
     * @param {string} params.subject - Notification subject
     * @param {string} params.message - Notification message
     * @param {Object} params.data - Additional data
     * @returns {Promise<Object>}
     */
    async send({ to, subject, message, data = {} }) {
        console.log('\n' + '='.repeat(80));
        console.log('📨 NOTIFICATION (Console Provider)');
        console.log('='.repeat(80));
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('-'.repeat(80));
        console.log(message);
        if (Object.keys(data).length > 0) {
            console.log('-'.repeat(80));
            console.log('Additional Data:');
            console.log(JSON.stringify(data, null, 2));
        }
        console.log('='.repeat(80) + '\n');

        return {
            success: true,
            provider: this.getName(),
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Console provider is always configured
     * @returns {boolean}
     */
    isConfigured() {
        return true;
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return 'console';
    }
}
