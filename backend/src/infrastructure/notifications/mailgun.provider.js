/**
 * Mailgun Notification Provider
 * Implements email notifications using Mailgun API (via native fetch)
 */

import { INotificationProvider } from '../../domain/interfaces/INotificationProvider.js';
import { config } from '../../config/env.js';
import { Buffer } from 'node:buffer';

export class MailgunNotificationProvider extends INotificationProvider {
    constructor() {
        super();
        this.apiKey = config.email?.mailgun?.apiKey || process.env.MAILGUN_API_KEY;
        this.domain = config.email?.mailgun?.domain || process.env.MAILGUN_DOMAIN;
        this.from = config.email?.mailgun?.from || process.env.MAILGUN_FROM || process.env.SMTP_FROM;

        // Check if configured
        this.configured = !!(this.apiKey && this.domain);

        if (this.configured) {
            console.log('✓ Mailgun provider initialized');
        }
    }

    /**
     * Send an email notification via Mailgun API
     * @param {Object} params
     * @param {string} params.to - Recipient email address
     * @param {string} params.subject - Email subject
     * @param {string} params.message - Email message (HTML)
     * @returns {Promise<Object>}
     */
    async send({ to, subject, message }) {
        if (!this.configured) {
            return { success: false, error: 'Mailgun provider not configured' };
        }

        try {
            const auth = Buffer.from(`api:${this.apiKey}`).toString('base64');
            const formData = new URLSearchParams();
            formData.append('from', this.from);
            formData.append('to', to);
            formData.append('subject', subject);
            formData.append('html', message);

            const response = await fetch(`https://api.mailgun.net/v3/${this.domain}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }

            console.log('✓ Mailgun email sent successfully to:', to);
            console.log('  ID:', data.id);

            return {
                success: true,
                messageId: data.id,
                provider: this.getName(),
            };
        } catch (error) {
            console.error('Failed to send Mailgun email:', error.message);
            return {
                success: false,
                error: error.message,
                provider: this.getName(),
            };
        }
    }

    /**
     * Check if provider is configured
     * @returns {boolean}
     */
    isConfigured() {
        return this.configured;
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return 'mailgun';
    }
}
