/**
 * Email Notification Provider
 * Implements email notifications using SMTP
 */

import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';
import { INotificationProvider } from '../../domain/interfaces/INotificationProvider.js';

export class EmailNotificationProvider extends INotificationProvider {
    constructor() {
        super();
        this.transporter = null;
        this.configured = false;
        this._initialize();
    }

    /**
     * Initialize the email transporter
     * @private
     */
    _initialize() {
        if (!config.email.user || !config.email.pass) {
            console.warn('⚠️  Email provider not configured. Notifications will be logged only.');
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                host: config.email.host,
                port: config.email.port,
                secure: config.email.port === 465, // true for 465, false for other ports
                auth: {
                    user: config.email.user,
                    pass: config.email.pass,
                },
            });

            this.configured = true;
            console.log('✓ Email notification provider configured');
        } catch (error) {
            console.error('Failed to initialize email provider:', error.message);
        }
    }

    /**
     * Send an email notification
     * @param {Object} params
     * @param {string} params.to - Recipient email address
     * @param {string} params.subject - Email subject
     * @param {string} params.message - Email message (HTML or text)
     * @param {Object} params.data - Additional data for templating
     * @returns {Promise<Object>}
     */
    async send({ to, subject, message, data = {} }) {
        if (!this.configured) {
            console.log('📧 [Email Not Configured] Would send to:', to);
            console.log('   Subject:', subject);
            console.log('   Message:', message);
            return { success: false, error: 'Email provider not configured' };
        }

        try {
            const mailOptions = {
                from: `"DevuraTracker" <${config.email.from}>`,
                to,
                subject,
                html: message,
                text: this._stripHtml(message),
            };

            const info = await this.transporter.sendMail(mailOptions);

            console.log('✓ Email sent successfully to:', to);
            console.log('  Message ID:', info.messageId);

            return {
                success: true,
                messageId: info.messageId,
                provider: this.getName(),
            };
        } catch (error) {
            console.error('Failed to send email:', error.message);
            return {
                success: false,
                error: error.message,
                provider: this.getName(),
            };
        }
    }

    /**
     * Strip HTML tags from a string for text version
     * @private
     * @param {string} html
     * @returns {string}
     */
    _stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    /**
     * Check if email provider is configured
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
        return 'email';
    }

    /**
     * Verify email configuration
     * @returns {Promise<boolean>}
     */
    async verify() {
        if (!this.configured) {
            return false;
        }

        try {
            await this.transporter.verify();
            console.log('✓ Email server connection verified');
            return true;
        } catch (error) {
            console.error('Email server verification failed:', error.message);
            return false;
        }
    }
}
