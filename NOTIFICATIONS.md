# Notification System Documentation

## Overview

The DevuraTracker notification system is built using **Clean Architecture** principles, ensuring maintainability, testability, and scalability. The system sends email notifications to users when tracking events occur (email opens, link clicks, and replies).

## Architecture

The notification system follows a layered architecture:

```
┌─────────────────────────────────────────────────────┐
│                 Presentation Layer                  │
│        (Controllers & Routes)                       │
│  - notification.controller.js                       │
│  - notification.routes.js                           │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                  Service Layer                      │
│        (Business Logic)                             │
│  - notification.service.js                          │
│    • Orchestrates notifications                     │
│    • Manages multiple providers                     │
│    • Fetches user data                              │
└────────┬──────────────────────────┬─────────────────┘
         │                          │
┌────────▼─────────────┐   ┌────────▼────────────────┐
│  Repository Layer    │   │  Infrastructure Layer   │
│  (Data Access)       │   │  (External Services)    │
│  - user.repository   │   │  - email.provider       │
│  - Gets user info    │   │  - console.provider     │
└──────────────────────┘   └─────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                   Domain Layer                      │
│             (Interfaces/Contracts)                  │
│  - INotificationProvider (interface)                │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Domain Layer

**File**: `src/domain/interfaces/INotificationProvider.js`

Defines the contract for all notification providers. Any new provider (SMS, Push, Slack, etc.) must implement this interface.

```javascript
interface INotificationProvider {
  send({ to, subject, message, data }): Promise<Object>
  isConfigured(): Boolean
  getName(): String
}
```

### 2. Infrastructure Layer

**Files**: 
- `src/infrastructure/notifications/email.provider.js`
- `src/infrastructure/notifications/console.provider.js`

#### Email Provider
- Uses **nodemailer** for SMTP email sending
- Sends beautiful HTML emails with responsive templates
- Gracefully handles unconfigured state (logs instead of failing)
- Supports Gmail, Outlook, and any SMTP server

#### Console Provider
- Fallback provider for development/testing
- Logs notifications to console
- Always available, never fails

### 3. Service Layer

**File**: `src/services/notification.service.js`

Main orchestrator that:
- Manages multiple notification providers
- Fetches user email addresses from Supabase Auth
- Builds email templates for different event types
- Handles errors gracefully
- Provides test notification functionality

### 4. Repository Layer

**File**: `src/repositories/user.repository.js`

Handles data access for user information:
- Fetches user data from Supabase Auth
- Gets user email addresses for notifications
- Uses service role key for admin operations

### 5. Presentation Layer

**Files**:
- `src/controllers/notification.controller.js`
- `src/routes/notification.routes.js`

HTTP API endpoints for testing and status checking.

## How It Works

### Email Open Notification Flow

```
1. User opens email with tracking pixel
   ↓
2. GET /api/tracking/pixel/:pixelId is called
   ↓
3. tracking.controller → tracking.service.trackOpen()
   ↓
4. tracking.service records event in database
   ↓
5. tracking.service calls notification.service.sendOpenNotification()
   ↓
6. notification.service fetches user email from Supabase Auth
   ↓
7. notification.service builds email template
   ↓
8. notification.service sends via email provider
   ↓
9. User receives email notification instantly
```

### Key Features

✅ **Works even when user is logged out** - Backend runs independently
✅ **Clean Architecture** - Easy to test, maintain, and extend
✅ **Multiple Providers** - Easy to add SMS, Push, Slack, etc.
✅ **Graceful Degradation** - Falls back to console if email not configured
✅ **Beautiful Templates** - Responsive HTML emails with gradients
✅ **Production Ready** - Deployed backend handles notifications 24/7

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Required for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@devuratracker.com

# Frontend URL (for links in emails)
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup

If using Gmail:

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password"
4. Use the app password in `SMTP_PASS`

### Testing Without Email

If you don't configure SMTP credentials, the system will:
- Log notifications to console (visible in backend logs)
- Not send actual emails
- Continue working normally otherwise

## API Endpoints

### Send Test Notification

```http
POST /api/notifications/test
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Test notification sent successfully",
  "result": {
    "success": true,
    "messageId": "<message-id>",
    "provider": "email"
  }
}
```

### Get Provider Status

```http
GET /api/notifications/status
Authorization: Bearer <token>
```

**Response**:
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

## Email Templates

The system includes three beautiful, responsive email templates:

### 1. Email Open Notification
- Blue gradient theme
- Shows pixel name, timestamp, IP, device info
- Link to dashboard

### 2. Link Click Notification
- Purple gradient theme
- Shows link name, destination URL, timestamp, device
- Link to dashboard

### 3. Reply Notification
- Green gradient theme
- Shows pixel name, reply time, sender info
- Link to dashboard

All templates:
- Fully responsive (mobile-friendly)
- Modern gradient design
- Professional typography
- Include dashboard links

## Testing

### Local Testing

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Send a test notification** (requires authentication):
   ```bash
   curl -X POST http://localhost:3001/api/notifications/test \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Check provider status**:
   ```bash
   curl http://localhost:3001/api/notifications/status \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Testing Actual Tracking

1. Create a tracking pixel via the frontend
2. Embed it in an HTML email
3. Open the email
4. Check your inbox for the notification

## Production Deployment

The backend is already deployed, so notifications work even when:
- User is logged out
- User's computer is off
- Frontend is not running

The deployed backend:
- Runs 24/7
- Handles tracking events
- Sends notifications in real-time
- Scales automatically

## Adding New Notification Channels

To add a new notification channel (e.g., SMS, Slack):

1. **Create a new provider** implementing `INotificationProvider`:
   ```javascript
   // src/infrastructure/notifications/sms.provider.js
   export class SmsNotificationProvider extends INotificationProvider {
     async send({ to, subject, message, data }) {
       // Send SMS via Twilio, etc.
     }
     
     isConfigured() {
       return !!config.twilio.apiKey;
     }
     
     getName() {
       return 'sms';
     }
   }
   ```

2. **Register the provider** in `notification.service.js`:
   ```javascript
   this.providers = [
     new EmailNotificationProvider(),
     new SmsNotificationProvider(),  // Add here
     new ConsoleNotificationProvider(),
   ];
   ```

3. **Done!** The service will automatically use it based on priority.

## Troubleshooting

### Notifications not sending

1. **Check provider status**:
   ```
   GET /api/notifications/status
   ```

2. **Check backend logs** - notifications are logged

3. **Verify SMTP credentials** in `.env`

4. **Send test notification**:
   ```
   POST /api/notifications/test
   ```

### Emails going to spam

- Configure SPF/DKIM records for your domain
- Use a reputable SMTP service (SendGrid, Mailgun)
- Avoid spam trigger words

### No user email found

- User must sign up with email
- Email must be verified in Supabase
- Check Supabase Auth users table

## Best Practices

1. **Always handle errors gracefully** - Don't let notification failures break tracking
2. **Log everything** - Helps with debugging
3. **Use templates** - Consistent, professional emails
4. **Test in development** - Use console provider or test email
5. **Monitor in production** - Track delivery rates, failures

## Future Enhancements

Potential improvements:

- [ ] **Notification Preferences** - Let users choose which events to be notified about
- [ ] **Batching** - Group multiple events into one email
- [ ] **Rate Limiting** - Prevent notification spam
- [ ] **Multiple Channels** - SMS, Push, Slack, Discord
- [ ] **Templates UI** - Let users customize email templates
- [ ] **Analytics** - Track notification open rates
- [ ] **Webhooks** - Let users receive events via webhooks

## Security Considerations

- ✅ User emails fetched server-side only
- ✅ SMTP credentials stored in environment variables
- ✅ Authentication required for test endpoints
- ✅ No sensitive data in email templates
- ✅ Service role key used securely
- ✅ Rate limiting on notification endpoints (recommended)

## Summary

The notification system is:
- **Clean** - Well-organized, follows best practices
- **Extensible** - Easy to add new providers
- **Reliable** - Works 24/7 via deployed backend
- **Tested** - Test endpoints for verification
- **Production-Ready** - Handles errors gracefully

Users will receive instant email notifications whenever someone interacts with their tracked emails or links, keeping them informed in real-time!
