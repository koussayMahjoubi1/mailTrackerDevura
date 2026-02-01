# Notification System - Testing & Deployment Checklist

## ✅ Local Development Testing

### Step 1: Backend Setup
- [ ] Navigate to backend directory: `cd backend`
- [ ] Install dependencies: `npm install` (if not already done)
- [ ] Check `.env` file exists
- [ ] Verify Supabase credentials are set:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_ANON_KEY`

### Step 2: Email Configuration (Optional)
- [ ] Choose email provider (Gmail, SendGrid, etc.)
- [ ] Add to `.env`:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-app-password
  SMTP_FROM=noreply@devuratracker.com
  FRONTEND_URL=http://localhost:3000
  ```

#### For Gmail Users:
- [ ] Enable 2-Factor Authentication on Google Account
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Copy app password to `SMTP_PASS`

### Step 3: Start Backend
- [ ] Run: `npm run dev`
- [ ] Verify output shows:
  ```
  ✓ Email notification provider configured
  ✓ Database connection verified
  Server running on port 3001
  ```
- [ ] If email not configured, should show:
  ```
  ⚠️  Email provider not configured. Notifications will be logged only.
  ```

### Step 4: Run Test Script
- [ ] Run: `node test/test-notifications.js`
- [ ] Verify all checks pass:
  - [ ] ✅ Notification Service initialized
  - [ ] ✅ Email templates generated successfully
  - [ ] ✅ Provider status correct
  - [ ] ✅ Console provider available

### Step 5: Test API Endpoints

#### Get Your Auth Token:
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Register/Login to get JWT token
- [ ] Copy token from browser storage or network tab

#### Test Provider Status:
```powershell
# Windows PowerShell
curl -X GET http://localhost:3001/api/notifications/status `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected Response:
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

- [ ] Status endpoint returns 200 OK
- [ ] Provider configuration is correct

#### Send Test Notification:
```powershell
# Windows PowerShell
curl -X POST http://localhost:3001/api/notifications/test `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -H "Content-Type: application/json"
```

- [ ] Test endpoint returns 200 OK
- [ ] If email configured: Check inbox for test email
- [ ] If not configured: Check backend console for notification log
- [ ] Email/log contains test notification content

### Step 6: Test Real Tracking

#### Create Tracking Pixel:
- [ ] Login to frontend
- [ ] Navigate to Tracking page
- [ ] Click "Create Pixel"
- [ ] Enter name: "Test Notification Pixel"
- [ ] Copy pixel HTML code

#### Test Email Open:
- [ ] Create a test HTML file:
  ```html
  <!DOCTYPE html>
  <html>
  <body>
    <h1>Test Email</h1>
    <p>This is a test email.</p>
    <img src="http://localhost:3001/api/tracking/pixel/YOUR_PIXEL_ID" width="1" height="1" />
  </body>
  </html>
  ```
- [ ] Send this HTML to yourself via email
- [ ] Open the email
- [ ] Check your inbox for notification email
- [ ] Verify notification contains:
  - [ ] Pixel name
  - [ ] Timestamp
  - [ ] IP address
  - [ ] Device info
  - [ ] Link to dashboard

#### Test Link Click:
- [ ] Create tracking link via frontend
- [ ] Copy tracking URL
- [ ] Click the link
- [ ] Check inbox for click notification
- [ ] Verify notification contains:
  - [ ] Link name
  - [ ] Destination URL
  - [ ] Timestamp
  - [ ] Device info

### Step 7: Verify Backend Logs
- [ ] Check backend console shows notification logs
- [ ] No errors in console
- [ ] Successful send messages visible

---

## 🚀 Production Deployment Checklist

### Pre-Deployment

#### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] Production Supabase credentials configured
- [ ] Production SMTP service configured (SendGrid, Mailgun, etc.)
- [ ] `FRONTEND_URL` set to production URL
- [ ] All sensitive keys in secure environment variables

#### Email Service Setup
- [ ] Choose production email service:
  - [ ] SendGrid (recommended)
  - [ ] Mailgun
  - [ ] AWS SES
  - [ ] Gmail (not recommended for production)
- [ ] Create account and get credentials
- [ ] Configure in deployment platform
- [ ] Verify sending limits and quotas

#### Domain Configuration (if using custom email)
- [ ] Set up SPF record
- [ ] Set up DKIM signature
- [ ] Set up DMARC policy
- [ ] Verify domain in email service

### Deployment

#### Backend Deployment (Render, Heroku, etc.)
- [ ] Backend already deployed
- [ ] Add new environment variables in platform
- [ ] Redeploy backend
- [ ] Check deployment logs for errors
- [ ] Verify health check passes: `GET /health`

#### Post-Deployment Verification
- [ ] Test status endpoint:
  ```bash
  curl https://your-backend.com/api/notifications/status \
    -H "Authorization: Bearer TOKEN"
  ```
- [ ] Verify response shows email configured
- [ ] Send test notification
- [ ] Create real tracking pixel and test
- [ ] Monitor logs for errors

### Monitoring

#### Set Up Monitoring
- [ ] Monitor email delivery rates
- [ ] Track notification failures
- [ ] Set up error alerts
- [ ] Monitor SMTP service quotas
- [ ] Track email bounce rates

#### Log Monitoring
- [ ] Check for errors in production logs
- [ ] Monitor notification send success rate
- [ ] Track response times
- [ ] Set up log aggregation (optional)

---

## 🔧 Troubleshooting Checklist

### Issue: Email Notifications Not Sending

#### Check Provider Configuration:
- [ ] Run status endpoint
- [ ] Verify SMTP credentials in `.env`
- [ ] Check if email provider requires app password
- [ ] Verify port (587 for TLS, 465 for SSL)
- [ ] Test SMTP connection directly

#### Check Backend Logs:
- [ ] Look for error messages
- [ ] Check if notification service initialized
- [ ] Verify user email was found
- [ ] Check for SMTP authentication errors

#### Verify User Email:
- [ ] User signed up with email
- [ ] Email verified in Supabase
- [ ] Check Supabase Auth users table
- [ ] Test with getUserEmail endpoint

### Issue: Getting Console Logs Instead of Emails

#### Root Cause:
- [ ] SMTP credentials not set or incorrect
- [ ] Email provider not configured

#### Solution:
- [ ] Add/fix SMTP credentials in `.env`
- [ ] Restart backend
- [ ] Run test script again
- [ ] Verify status endpoint shows email configured

### Issue: Emails Going to Spam

#### Solutions:
- [ ] Use verified sending domain
- [ ] Set up SPF/DKIM/DMARC
- [ ] Use reputable SMTP service
- [ ] Avoid spam trigger words in subject
- [ ] Test with different email providers
- [ ] Check sender reputation

### Issue: SMTP Connection Errors

#### Troubleshooting:
- [ ] Verify SMTP_HOST and SMTP_PORT
- [ ] Check firewall isn't blocking port
- [ ] Try alternative ports (587, 465, 25)
- [ ] Verify credentials are correct
- [ ] Check if 2FA/app password required
- [ ] Test with telnet: `telnet smtp.gmail.com 587`

### Issue: "User Email Not Found"

#### Solutions:
- [ ] Verify user authenticated
- [ ] Check Supabase Auth configuration
- [ ] Verify service role key has admin access
- [ ] Check user exists in auth.users table
- [ ] User must have email (not anonymous auth)

---

## 📊 Performance & Scaling Checklist

### Performance Optimization
- [ ] Email sending is non-blocking (async)
- [ ] Errors don't break tracking functionality
- [ ] Consider rate limiting on notification endpoints
- [ ] Monitor email sending latency
- [ ] Implement retry logic for failed sends

### Scaling Considerations
- [ ] Use email service with high sending limits
- [ ] Consider notification batching for high volume
- [ ] Implement queue for notification processing (optional)
- [ ] Monitor and scale backend instances
- [ ] Cache user email lookups (optional)

### Future Enhancements
- [ ] Add notification preferences (user can disable)
- [ ] Implement notification batching/digests
- [ ] Add SMS notifications
- [ ] Add push notifications
- [ ] Add Slack/Discord webhooks
- [ ] Notification analytics dashboard

---

## 📝 Documentation Verification

- [ ] README.md updated with notification features
- [ ] NOTIFICATIONS.md reviewed
- [ ] NOTIFICATION_QUICKSTART.md accessible
- [ ] NOTIFICATION_IMPLEMENTATION_SUMMARY.md complete
- [ ] NOTIFICATION_VISUAL_GUIDE.md helpful
- [ ] API endpoints documented
- [ ] Code comments comprehensive

---

## ✨ Final Verification

### Local Development
- [ ] Backend starts without errors
- [ ] Test script passes
- [ ] Status endpoint works
- [ ] Test notification works
- [ ] Real tracking triggers notifications
- [ ] Email templates look good
- [ ] Console fallback works

### Production
- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] Email service connected
- [ ] Test notification received
- [ ] Real tracking tested
- [ ] Monitoring set up
- [ ] Documentation complete

---

## 🎉 Success Criteria

Your notification system is ready when:

✅ **Functional:**
- Backend starts without errors
- All test scripts pass
- Notifications sent successfully
- Email templates render correctly

✅ **Reliable:**
- Works 24/7 (deployed backend)
- Handles errors gracefully
- Falls back to console if needed
- Logs all activity

✅ **Production-Ready:**
- SMTP service configured
- Domain verified (if applicable)
- Monitoring in place
- Documentation complete

✅ **User-Friendly:**
- Beautiful email templates
- Clear, actionable notifications
- Fast delivery (< 5 seconds)
- Mobile-responsive

---

**Congratulations! Your notification system is production-ready!** 🎉

For support, refer to:
- `NOTIFICATIONS.md` - Complete documentation
- `NOTIFICATION_QUICKSTART.md` - Setup guide
- `NOTIFICATION_IMPLEMENTATION_SUMMARY.md` - Overview
- Backend console logs - Debugging
