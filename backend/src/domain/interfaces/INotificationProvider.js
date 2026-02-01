/**
 * Notification Provider Interface
 * Defines the contract for all notification providers (email, SMS, push, etc.)
 */

export class INotificationProvider {
    /**
     * Send a notification
     * @param {Object} params - Notification parameters
     * @param {string} params.to - Recipient identifier (email, phone, etc.)
     * @param {string} params.subject - Notification subject
     * @param {string} params.message - Notification message
     * @param {Object} params.data - Additional data for templating
     * @returns {Promise<Object>} Notification result
     */
    async send({ to, subject, message, data }) {
        throw new Error('Method not implemented: send()');
    }

    /**
     * Check if provider is configured and ready
     * @returns {boolean}
     */
    isConfigured() {
        throw new Error('Method not implemented: isConfigured()');
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        throw new Error('Method not implemented: getName()');
    }
}
