# SMTP Configuration Update

I have updated your backend configuration with the provided credentials.

## Updated Settings

- **Sender Email:** `contact@devura.net`
- **SMTP Host:** `ssl0.ovh.net`
- **SMTP Port:** `465` (SSL/TLS enabled)
- **SMTP User:** `contact@devura.net`

## How It Works Now

1. **Sender:** All notification emails will come **FROM** `contact@devura.net`.
2. **Recipient:** The system automatically finds the user who created the tracking pixel and sends the email **TO** their registered email address.

## Status

✅ **Backend Configured:** The server has been restarted with the new credentials.
✅ **Verification:** The system is ready to send real emails.

## How to Verify

1. **Login** to your app.
2. **Create** a new tracking pixel.
3. **Send** a test email containing that pixel to yourself.
4. **Open** the email.
5. **Check your inbox** (the one you used to login to the app). You should receive a notification from `contact@devura.net`.
