import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../utils/supabase.js';
import { config } from '../config/env.js';

export class NotificationService {
  constructor() {
    // Only create transporter if SMTP is configured
    if (config.email.user && config.email.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: false,
        auth: {
          user: config.email.user,
          pass: config.email.pass
        }
      });
    } else {
      this.transporter = null;
      console.log('⚠️  Email notifications disabled - SMTP not configured');
    }
  }

  isEnabled() {
    return this.transporter !== null;
  }

  async getUserEmail(userId) {
    try {
      const { data, error } = await supabaseAdmin.client.auth.admin.getUserById(userId);
      if (error || !data?.user?.email) {
        console.error('Failed to get user email:', error);
        return null;
      }
      return data.user.email;
    } catch (error) {
      console.error('Error fetching user email:', error);
      return null;
    }
  }

  async sendOpenNotification(userId, pixel, event) {
    if (!this.isEnabled()) {
      return; // Silently skip if email notifications are disabled
    }

    const userEmail = await this.getUserEmail(userId);
    if (!userEmail) {
      console.log('Skipping notification - user email not found');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: userEmail,
        subject: `Email Opened: ${pixel.name}`,
        html: `
          <h2>Email Opened</h2>
          <p>Your tracked email "${pixel.name}" was opened.</p>
          <ul>
            <li><strong>Time:</strong> ${new Date(event.created_at).toLocaleString()}</li>
            <li><strong>IP:</strong> ${event.metadata?.ip || 'Unknown'}</li>
            <li><strong>User Agent:</strong> ${event.metadata?.userAgent || 'Unknown'}</li>
          </ul>
        `
      });
    } catch (error) {
      console.error('Failed to send open notification:', error);
      // Don't throw - notification failure shouldn't break tracking
    }
  }

  async sendClickNotification(userId, link, event) {
    if (!this.isEnabled()) {
      return; // Silently skip if email notifications are disabled
    }

    const userEmail = await this.getUserEmail(userId);
    if (!userEmail) {
      console.log('Skipping notification - user email not found');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: userEmail,
        subject: `Link Clicked: ${link.name}`,
        html: `
          <h2>Link Clicked</h2>
          <p>Someone clicked on your tracked link "${link.name}".</p>
          <ul>
            <li><strong>Original URL:</strong> ${link.original_url}</li>
            <li><strong>Time:</strong> ${new Date(event.created_at).toLocaleString()}</li>
            <li><strong>IP:</strong> ${event.metadata?.ip || 'Unknown'}</li>
            <li><strong>User Agent:</strong> ${event.metadata?.userAgent || 'Unknown'}</li>
          </ul>
        `
      });
    } catch (error) {
      console.error('Failed to send click notification:', error);
    }
  }

  async sendReplyNotification(userId, pixel, event) {
    if (!this.isEnabled()) {
      return; // Silently skip if email notifications are disabled
    }

    const userEmail = await this.getUserEmail(userId);
    if (!userEmail) {
      console.log('Skipping notification - user email not found');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: userEmail,
        subject: `Reply Received: ${pixel.name}`,
        html: `
          <h2>Reply Received</h2>
          <p>Someone replied to your tracked email "${pixel.name}".</p>
          <ul>
            <li><strong>Time:</strong> ${new Date(event.created_at).toLocaleString()}</li>
          </ul>
        `
      });
    } catch (error) {
      console.error('Failed to send reply notification:', error);
    }
  }
}

