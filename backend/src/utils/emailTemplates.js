/**
 * Email Template Builder
 * Generates HTML email templates for different notification types
 */

export class EmailTemplateBuilder {
    /**
     * Build email template for email open notification
     * @param {Object} pixel - Tracking pixel object
     * @param {Object} event - Tracking event object
     * @returns {Object} { subject, html }
     */
    static buildOpenNotification(pixel, event) {
        const timestamp = new Date(event.created_at).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long',
        });

        const subject = `📧 Email Tracked: "${pixel.name}" was opened`;

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          h1 {
            color: #2563eb;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, #2563eb, #7c3aed);
            margin: 20px 0;
            border-radius: 2px;
          }
          .info-section {
            background-color: #f8fafc;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 10px 0;
          }
          .label {
            font-weight: 600;
            color: #64748b;
            display: inline-block;
            width: 120px;
          }
          .value {
            color: #1e293b;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">📧</div>
            <h1>Email Opened!</h1>
            <p style="color: #64748b; margin: 0;">Your tracked email was just opened</p>
          </div>

          <div class="divider"></div>

          <div class="info-section">
            <div class="info-row">
              <span class="label">Tracking Pixel:</span>
              <span class="value">${pixel.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Opened At:</span>
              <span class="value">${timestamp}</span>
            </div>
            ${event.metadata?.ip ? `
            <div class="info-row">
              <span class="label">IP Address:</span>
              <span class="value">${event.metadata.ip}</span>
            </div>
            ` : ''}
            ${event.metadata?.userAgent ? `
            <div class="info-row">
              <span class="label">Device:</span>
              <span class="value">${this._parseUserAgent(event.metadata.userAgent)}</span>
            </div>
            ` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://devuratracker.com'}/dashboard" class="cta-button">
              View Dashboard
            </a>
          </div>

          <div class="footer">
            <p>You're receiving this because you have email tracking notifications enabled.</p>
            <p style="margin: 5px 0;">DevuraTracker - Email Tracking Made Simple</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return { subject, html };
    }

    /**
     * Build email template for link click notification
     * @param {Object} link - Tracking link object
     * @param {Object} event - Tracking event object
     * @returns {Object} { subject, html }
     */
    static buildClickNotification(link, event) {
        const timestamp = new Date(event.created_at).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long',
        });

        const subject = `🔗 Link Clicked: "${link.name}"`;

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          h1 {
            color: #7c3aed;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, #7c3aed, #2563eb);
            margin: 20px 0;
            border-radius: 2px;
          }
          .info-section {
            background-color: #faf5ff;
            border-left: 4px solid #7c3aed;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 10px 0;
          }
          .label {
            font-weight: 600;
            color: #64748b;
            display: inline-block;
            width: 120px;
          }
          .value {
            color: #1e293b;
          }
          .url-box {
            background-color: #f1f5f9;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🔗</div>
            <h1>Link Clicked!</h1>
            <p style="color: #64748b; margin: 0;">Someone clicked your tracked link</p>
          </div>

          <div class="divider"></div>

          <div class="info-section">
            <div class="info-row">
              <span class="label">Tracking Link:</span>
              <span class="value">${link.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Clicked At:</span>
              <span class="value">${timestamp}</span>
            </div>
            <div class="info-row">
              <span class="label">Destination:</span>
            </div>
            <div class="url-box">${link.original_url}</div>
            ${event.metadata?.ip ? `
            <div class="info-row">
              <span class="label">IP Address:</span>
              <span class="value">${event.metadata.ip}</span>
            </div>
            ` : ''}
            ${event.metadata?.userAgent ? `
            <div class="info-row">
              <span class="label">Device:</span>
              <span class="value">${this._parseUserAgent(event.metadata.userAgent)}</span>
            </div>
            ` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://devuratracker.com'}/dashboard" class="cta-button">
              View Dashboard
            </a>
          </div>

          <div class="footer">
            <p>You're receiving this because you have link tracking notifications enabled.</p>
            <p style="margin: 5px 0;">DevuraTracker - Email Tracking Made Simple</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return { subject, html };
    }

    /**
     * Build email template for reply notification
     * @param {Object} pixel - Tracking pixel object
     * @param {Object} event - Tracking event object
     * @returns {Object} { subject, html }
     */
    static buildReplyNotification(pixel, event) {
        const timestamp = new Date(event.created_at).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long',
        });

        const subject = `💬 Reply Received: "${pixel.name}"`;

        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          h1 {
            color: #059669;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, #059669, #10b981);
            margin: 20px 0;
            border-radius: 2px;
          }
          .info-section {
            background-color: #f0fdf4;
            border-left: 4px solid #059669;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 10px 0;
          }
          .label {
            font-weight: 600;
            color: #64748b;
            display: inline-block;
            width: 120px;
          }
          .value {
            color: #1e293b;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">💬</div>
            <h1>Reply Received!</h1>
            <p style="color: #64748b; margin: 0;">Someone replied to your tracked email</p>
          </div>

          <div class="divider"></div>

          <div class="info-section">
            <div class="info-row">
              <span class="label">Tracking Pixel:</span>
              <span class="value">${pixel.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Reply Time:</span>
              <span class="value">${timestamp}</span>
            </div>
            ${event.metadata?.from ? `
            <div class="info-row">
              <span class="label">From:</span>
              <span class="value">${event.metadata.from}</span>
            </div>
            ` : ''}
            ${event.metadata?.subject ? `
            <div class="info-row">
              <span class="label">Subject:</span>
              <span class="value">${event.metadata.subject}</span>
            </div>
            ` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://devuratracker.com'}/dashboard" class="cta-button">
              View Dashboard
            </a>
          </div>

          <div class="footer">
            <p>You're receiving this because you have reply tracking notifications enabled.</p>
            <p style="margin: 5px 0;">DevuraTracker - Email Tracking Made Simple</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return { subject, html };
    }

    /**
     * Parse user agent string to get a friendly device/browser name
     * @private
     * @param {string} userAgent
     * @returns {string}
     */
    static _parseUserAgent(userAgent) {
        if (!userAgent || userAgent === 'unknown') {
            return 'Unknown Device';
        }

        // Simple user agent parsing
        let device = 'Desktop';
        let browser = 'Unknown Browser';

        // Detect device
        if (/mobile/i.test(userAgent)) {
            device = 'Mobile';
        } else if (/tablet|ipad/i.test(userAgent)) {
            device = 'Tablet';
        }

        // Detect browser
        if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
            browser = 'Chrome';
        } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
            browser = 'Safari';
        } else if (/firefox/i.test(userAgent)) {
            browser = 'Firefox';
        } else if (/edge/i.test(userAgent)) {
            browser = 'Edge';
        }

        return `${browser} on ${device}`;
    }
}
