import { google } from 'googleapis';
import Imap from 'imap';
import { TrackingService } from './tracking.service.js';

const trackingService = new TrackingService();

export class EmailService {
  // Gmail integration
  async connectGmail(accessToken, refreshToken) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async checkGmailReplies(gmailClient, pixelId) {
    try {
      // Search for replies to emails containing the tracking pixel
      const response = await gmailClient.users.messages.list({
        userId: 'me',
        q: 'in:inbox is:unread',
        maxResults: 10
      });

      const messages = response.data.messages || [];
      
      for (const message of messages) {
        const msg = await gmailClient.users.messages.get({
          userId: 'me',
          id: message.id
        });

        // Check if this is a reply to an email with our tracking pixel
        // In production, you'd check the In-Reply-To header against sent emails
        // For now, this is a simplified version
        await trackingService.trackReply(pixelId, {
          messageId: message.id,
          threadId: msg.data.threadId
        });
      }
    } catch (error) {
      console.error('Gmail reply check error:', error);
      throw error;
    }
  }

  // Outlook integration
  async connectOutlook(accessToken, refreshToken) {
    // Similar to Gmail, but using Microsoft Graph API
    // Implementation would use @microsoft/microsoft-graph-client
    throw new Error('Outlook integration not fully implemented');
  }

  // IMAP integration
  async connectIMAP(config) {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: config.user,
        password: config.password,
        host: config.host || 'ssl0.ovh.net',
        port: config.port || 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 10000,
        authTimeout: 5000
      });

      imap.once('ready', () => resolve(imap));
      imap.once('error', reject);
      imap.connect();
    });
  }

  async checkIMAPReplies(imap, pixelId) {
    return new Promise((resolve, reject) => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);

        imap.search(['UNSEEN'], (err, results) => {
          if (err) return reject(err);

          if (!results || results.length === 0) {
            return resolve([]);
          }

          const fetch = imap.fetch(results, { bodies: '' });
          const replies = [];

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              let buffer = '';
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
              stream.once('end', () => {
                // Parse email and check if it's a reply
                // Simplified - in production, parse headers properly
                replies.push(buffer);
              });
            });
          });

          fetch.once('end', async () => {
            // Process replies
            for (const reply of replies) {
              await trackingService.trackReply(pixelId, {
                source: 'imap',
                raw: reply.substring(0, 500) // Limit size
              });
            }
            resolve(replies);
          });

          fetch.once('error', reject);
        });
      });
    });
  }
}

