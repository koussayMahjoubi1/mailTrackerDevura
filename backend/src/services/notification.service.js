/**
 * Notification Service
 * Orchestrates sending notifications through various providers
 * Implements clean architecture pattern with dependency injection
 */

import { EmailNotificationProvider } from '../infrastructure/notifications/email.provider.js';
import { MailgunNotificationProvider } from '../infrastructure/notifications/mailgun.provider.js';
import { DatabaseNotificationProvider } from '../infrastructure/notifications/database.provider.js';
import { ConsoleNotificationProvider } from '../infrastructure/notifications/console.provider.js';
import { UserRepository } from '../repositories/user.repository.js';
import { EmailTemplateBuilder } from '../utils/emailTemplates.js';
import { config } from '../config/env.js';

export class NotificationService {
  constructor(providers = null) {
    this.userRepository = new UserRepository();

    // Initialize providers (dependency injection for testing)
    if (providers) {
      this.providers = providers;
    } else {
      this.providers = [
        new DatabaseNotificationProvider(), // Always notify in-app
        new MailgunNotificationProvider(),
        new EmailNotificationProvider(),
        new ConsoleNotificationProvider(),
      ];
    }
  }

  /**
   * Get the primary notification provider (email)
   * Falls back to console if email is not configured
   * @private
   * @returns {INotificationProvider}
   */
  _getPrimaryProvider() {
    // Try to find configured email provider first (Mailgun or SMTP)
    const emailProvider = this.providers.find(
      p => (p.getName() === 'mailgun' || p.getName() === 'email') && p.isConfigured()
    );

    if (emailProvider) {
      return emailProvider;
    }

    // Fall back to console provider
    return this.providers.find(p => p.getName() === 'console');
  }

  /**
   * Send notification using the appropriate provider
   * @private
   * @param {string} userId - User ID to send notification to
   * @param {string} subject - Notification subject
   * @param {string} message - Notification message (HTML)
   * @param {Object} data - Additional data
   * @returns {Promise<Object>}
   */
  async _sendNotification(userId, subject, message, data = {}) {
    try {
      // 1. Get user email dynamically
      const userEmail = await this.userRepository.getUserEmail(userId);

      const results = [];
      const providersToSend = this.providers.filter(p => p.isConfigured());

      console.log(`📡 Sending notification to user ${userId} via ${providersToSend.length} providers...`);

      // 2. Clear previous error for this run
      let primarySuccess = false;
      let databaseSuccess = false;

      // 3. Send via all configured providers
      for (const provider of providersToSend) {
        try {
          console.log(`  📤 Trying provider: ${provider.getName()}`);
          const result = await provider.send({
            to: userEmail,
            userId, // Pass userId for DB provider
            subject,
            message,
            data,
          });

          console.log(`  ${result.success ? '✅' : '❌'} ${provider.getName()} result:`, result);
          results.push(result);
          if (result.success) {
            if (provider.getName() === 'database') {
              databaseSuccess = true;
              console.log('  ✓ Database notification stored successfully');
            }
            if (['mailgun', 'email'].includes(provider.getName())) {
              primarySuccess = true;
              console.log('  ✓ Email notification sent successfully');
            }
          }
        } catch (err) {
          console.log(`  ❌ ${provider.getName()} threw error:`, err.message);
          results.push({ success: false, provider: provider.getName(), error: err.message });
        }
      }

      // We consider it a success if at least the database notification was stored
      return {
        success: databaseSuccess,
        results,
        primarySuccess,
        recipient: userEmail,
        message: databaseSuccess
          ? 'Notification recorded in database'
          : 'Failed to record notification'
      };
    } catch (error) {
      console.error('CRITICAL Notification Error:', error.message);
      return {
        success: false,
        error: error.message,
        details: 'INTERNAL_SERVER_ERROR'
      };
    }
  }

  /**
   * Send notification when a tracking pixel is opened
   * @param {string} userId - User ID who owns the pixel
   * @param {Object} pixel - Tracking pixel object
   * @param {Object} event - Tracking event object
   * @returns {Promise<Object>}
   */
  async sendOpenNotification(userId, pixel, event) {
    try {
      const { subject, html } = EmailTemplateBuilder.buildOpenNotification(pixel, event);

      const result = await this._sendNotification(userId, subject, html, {
        eventType: 'open',
        pixelId: pixel.pixel_id,
        pixelName: pixel.name,
        eventId: event.id,
      });

      if (result.success) {
        console.log(`✓ Open notification sent for pixel: ${pixel.name}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to send open notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification when a tracking link is clicked
   * @param {string} userId - User ID who owns the link
   * @param {Object} link - Tracking link object
   * @param {Object} event - Tracking event object
   * @returns {Promise<Object>}
   */
  async sendClickNotification(userId, link, event) {
    try {
      const { subject, html } = EmailTemplateBuilder.buildClickNotification(link, event);

      const result = await this._sendNotification(userId, subject, html, {
        eventType: 'click',
        linkId: link.link_id,
        linkName: link.name,
        originalUrl: link.original_url,
        eventId: event.id,
      });

      if (result.success) {
        console.log(`✓ Click notification sent for link: ${link.name}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to send click notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification when an email reply is received
   * @param {string} userId - User ID who owns the pixel
   * @param {Object} pixel - Tracking pixel object
   * @param {Object} event - Tracking event object
   * @returns {Promise<Object>}
   */
  async sendReplyNotification(userId, pixel, event) {
    try {
      const { subject, html } = EmailTemplateBuilder.buildReplyNotification(pixel, event);

      const result = await this._sendNotification(userId, subject, html, {
        eventType: 'reply',
        pixelId: pixel.pixel_id,
        pixelName: pixel.name,
        eventId: event.id,
      });

      if (result.success) {
        console.log(`✓ Reply notification sent for pixel: ${pixel.name}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to send reply notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a test notification (for testing configuration)
   * @param {string} userId - User ID to send test to
   * @returns {Promise<Object>}
   */
  async sendTestNotification(userId) {
    try {
      const subject = '🧪 DevuraTracker Test Notification';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              border: 2px solid #10b981;
            }
            .icon {
              text-align: center;
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #10b981;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Test Successful!</h1>
            <p>Congratulations! Your DevuraTracker notification system is working correctly.</p>
            <p>You will now receive notifications when:</p>
            <ul>
              <li>📧 Your tracked emails are opened</li>
              <li>🔗 Your tracked links are clicked</li>
              <li>💬 Someone replies to your tracked emails</li>
            </ul>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
              DevuraTracker - Email Tracking Made Simple
            </p>
          </div>
        </body>
        </html>
      `;

      // Use the multi-provider _sendNotification method
      const result = await this._sendNotification(userId, subject, html, {
        eventType: 'system',
        test: true
      });

      return result;
    } catch (error) {
      console.error('Failed to send test notification:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get notification provider status
   * @returns {Object}
   */
  getProviderStatus() {
    return {
      providers: this.providers.map(p => ({
        name: p.getName(),
        configured: p.isConfigured(),
      })),
      primary: this._getPrimaryProvider()?.getName() || 'none',
    };
  }
}
