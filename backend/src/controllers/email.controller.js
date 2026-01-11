import { EmailService } from '../services/email.service.js';

const emailService = new EmailService();

export class EmailController {
  async connectGmail(req, res, next) {
    try {
      // This would typically involve OAuth flow
      // For now, return a placeholder
      res.json({ message: 'Gmail connection endpoint - OAuth flow required' });
    } catch (error) {
      next(error);
    }
  }

  async connectOutlook(req, res, next) {
    try {
      res.json({ message: 'Outlook connection endpoint - OAuth flow required' });
    } catch (error) {
      next(error);
    }
  }

  async connectIMAP(req, res, next) {
    try {
      // Get email and password from authenticated user
      const userEmail = req.user.email;
      // For now, we'll need password from request body
      // In production, you might want to store encrypted password or use OAuth
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const imap = await emailService.connectIMAP({
        user: userEmail,
        password: password,
        host: 'ssl0.ovh.net',
        port: 993
      });
      
      // Store IMAP connection in database
      const { supabase } = await import('../server.js');
      await supabase
        .from('email_accounts')
        .upsert({
          user_id: req.user.id,
          provider: 'imap',
          email: userEmail,
          config: {
            host: 'ssl0.ovh.net',
            port: 993,
            encryption: 'SSL/TLS'
          },
          is_active: true
        }, {
          onConflict: 'user_id,provider'
        });
      
      res.json({ message: 'IMAP connected successfully', email: userEmail });
    } catch (error) {
      console.error('IMAP connection error:', error);
      res.status(500).json({ error: error.message || 'Failed to connect to IMAP server' });
    }
  }
}

