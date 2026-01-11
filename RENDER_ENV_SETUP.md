# Render Environment Variables Setup

## ✅ Progress Update
Your build is now working! The only remaining issue is missing environment variables.

## Required Environment Variables

Go to **Render Dashboard** → Your Service → **Environment** tab, and add these variables:

### 1. Supabase Configuration (Required - Server won't start without these)

```
SUPABASE_URL=https://gvvqaewvhcvhbyleunvi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcxNzgwMCwiZXhwIjoyMDgzMjkzODAwfQ.7_c0QLOB2PRK2tJLOECTDVAJC6t3GQOjY_Et4EHpeco
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTc4MDAsImV4cCI6MjA4MzI5MzgwMH0.f8RsamihbYQAkwPK2fKXY4Pyk1rl4ZlbVcE3rS4hu_0
```

### 2. Server Configuration (Required)

```
PORT=10000
NODE_ENV=production
```

### 3. Frontend URL (Required for CORS)

**Set this AFTER you deploy the frontend:**
```
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**For now, use a placeholder:**
```
FRONTEND_URL=http://localhost:3000
```

### 4. Email Configuration (Required for notifications)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@devuratracker.com
```

### 5. Gmail/Outlook (Optional - for future email client integration)

```
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=https://your-backend-url.onrender.com/api/auth/gmail/callback

OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
OUTLOOK_REDIRECT_URI=https://your-backend-url.onrender.com/api/auth/outlook/callback
```

## Step-by-Step Instructions

1. **Go to Render Dashboard** → Click on your backend service
2. Click **Environment** tab (left sidebar)
3. Click **Add Environment Variable** button
4. Add each variable one by one:
   - Key: `SUPABASE_URL`
   - Value: `https://gvvqaewvhcvhbyleunvi.supabase.co`
   - Click **Save Changes**
   
   Repeat for each variable above.

5. **Minimum Required (to get server running):**
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `PORT=10000`
   - ✅ `NODE_ENV=production`
   - ✅ `FRONTEND_URL` (can be localhost for now)

6. After adding variables, Render will automatically redeploy, or click **Manual Deploy** → **Deploy latest commit**

## Quick Copy-Paste (Minimum Required)

Add these first to get your server running:

```
SUPABASE_URL=https://gvvqaewvhcvhbyleunvi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcxNzgwMCwiZXhwIjoyMDgzMjkzODAwfQ.7_c0QLOB2PRK2tJLOECTDVAJC6t3GQOjY_Et4EHpeco
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTc4MDAsImV4cCI6MjA4MzI5MzgwMH0.f8RsamihbYQAkwPK2fKXY4Pyk1rl4ZlbVcE3rS4hu_0
PORT=10000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## After Adding Variables

1. Render will automatically redeploy
2. Check the logs - you should see:
   - ✅ Server starting successfully
   - ✅ Database connection working
   - ✅ Server listening on port 10000

## Next Steps

Once backend is running:
1. Deploy frontend as a Static Site
2. Update `FRONTEND_URL` with your frontend URL
3. Add email configuration if you want notifications
4. Test your deployed API!

