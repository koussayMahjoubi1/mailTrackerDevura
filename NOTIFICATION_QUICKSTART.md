# Notification System Quick Start

This guide will help you get the notification system up and running quickly.

## Step 1: Install Dependencies

The backend already has all required dependencies. If you need to reinstall:

```bash
cd backend
npm install
```

## Step 2: Configure Email (Optional but Recommended)

### Option A: Using Gmail

1. **Enable 2FA** on your Google Account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password

3. **Update `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=noreply@devuratracker.com
   FRONTEND_URL=http://localhost:3000
   ```

### Option B: Using Other SMTP Services

**Outlook/Office365**:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**SendGrid**:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Option C: Skip Email Configuration

If you skip email config:
- Notifications will be logged to console
- You can still test the system
- Everything else works normally

## Step 3: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✓ Email notification provider configured
✓ Database connection verified
Server running on port 3001 (development mode)
```

Or if email not configured:
```
⚠️  Email provider not configured. Notifications will be logged only.
```

## Step 4: Test the Notification System

### 4.1: Check Provider Status

First, get your auth token by logging in via the frontend, then:

```bash
# Windows PowerShell
curl -X GET http://localhost:3001/api/notifications/status `
  -H "Authorization: Bearer YOUR_TOKEN"

# Linux/Mac
curl -X GET http://localhost:3001/api/notifications/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "status": {
    "providers": [
      { "name": "email", "configured": true },
      { "name": "console", "configured": true }
    ],
    "primary": "email"
  },
  "message": "Email notifications are enabled"
}
```

### 4.2: Send Test Notification

```bash
# Windows PowerShell
curl -X POST http://localhost:3001/api/notifications/test `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json"

# Linux/Mac
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**What happens**:
- If email configured: You'll receive a test email
- If not configured: Check console logs for the notification

### 4.3: Test with Real Tracking

1. **Create a tracking pixel** via the frontend
2. **Copy the pixel HTML** (something like):
   ```html
   <img src="http://localhost:3001/api/tracking/pixel/abc123" width="1" height="1" />
   ```
3. **Create a test HTML file**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <h1>Test Email</h1>
     <p>This is a test email with tracking.</p>
     <img src="http://localhost:3001/api/tracking/pixel/abc123" width="1" height="1" />
   </body>
   </html>
   ```
4. **Send this HTML to yourself** (via Gmail, Outlook, etc.)
5. **Open the email**
6. **Check your inbox** for the notification email!

## Step 5: View Backend Logs

The backend logs all notification activity:

```
✓ Open notification sent for pixel: My Campaign
📧 [Email] Sent to: user@example.com
   Subject: 📧 Email Tracked: "My Campaign" was opened
```

Or if email not configured:
```
================================================================================
📨 NOTIFICATION (Console Provider)
================================================================================
To: user@example.com
Subject: 📧 Email Tracked: "My Campaign" was opened
--------------------------------------------------------------------------------
[HTML email content]
================================================================================
```

## Troubleshooting

### Issue: "Email provider not configured"

**Solution**: Add SMTP credentials to `.env` file and restart the backend.

### Issue: "User email not found"

**Solution**: Make sure you're logged in with an email account (not anonymous auth).

### Issue: Emails going to spam

**Solution**: 
- Check your spam folder
- Use a verified sender domain
- Consider using SendGrid or Mailgun for production

### Issue: SMTP connection error

**Solution**:
1. Check SMTP_HOST and SMTP_PORT
2. Verify credentials are correct
3. Check if your firewall blocks port 587
4. Try port 465 with `secure: true`

## What's Next?

### For Local Development:
- Notifications work when backend is running
- User must be logged in to receive notifications
- Check console logs for debugging

### For Production:
- Backend is deployed and runs 24/7
- Notifications work even when user is logged out
- No need for frontend to be running
- Configure production SMTP service (SendGrid, Mailgun)

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Test notification | `/api/notifications/test` | POST |
| Check status | `/api/notifications/status` | GET |
| Create pixel | `/api/tracking/pixel` | POST |
| Track open | `/api/tracking/pixel/:id` | GET |

## Architecture Overview

```
User Opens Email
      ↓
Pixel Request → Backend → Record Event → Get User Email → Send Notification
      ↓                                                            ↓
Returns 1x1                                              User Receives Email
   Image                                                   Notification
```

## Email Templates Preview

You'll receive three types of notifications:

1. **📧 Email Open**: Blue gradient, shows device & IP
2. **🔗 Link Click**: Purple gradient, shows destination URL
3. **💬 Reply**: Green gradient, shows sender info

All are mobile-responsive with beautiful designs!

## Production Checklist

Before deploying:

- [ ] Configure production SMTP service
- [ ] Test with real email addresses
- [ ] Set `FRONTEND_URL` to production URL
- [ ] Set `NODE_ENV=production`
- [ ] Monitor email delivery rates
- [ ] Set up email domain verification (SPF/DKIM)
- [ ] Consider rate limiting

## Support

If you encounter issues:

1. Check backend console logs
2. Check `/api/notifications/status` endpoint
3. Send test notification
4. Review `NOTIFICATIONS.md` for detailed docs

---

**You're all set!** 🎉 Your notification system is ready to keep you informed of all tracking events in real-time.
