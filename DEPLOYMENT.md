# DevuraTracker - Render Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Backend Ready
- [x] Self-tracking detection implemented
- [x] Public tracking URL configuration added
- [x] CORS configured for production
- [x] Environment variables documented
- [x] Database migrations ready

### ✅ Frontend Ready
- [x] Dynamic tracking URL fetching
- [x] Production API endpoint configuration
- [x] Notification system integrated

---

## 🚀 Deployment Steps

### **1. Deploy Backend to Render**

#### Create New Web Service:
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `devuratracker-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

#### Set Environment Variables:
Go to **Environment** tab and add these variables:

```bash
# Required - Supabase
SUPABASE_URL=https://gvvqaewvhcvhbyleunvi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcxNzgwMCwiZXhwIjoyMDgzMjkzODAwfQ.7_c0QLOB2PRK2tJLOECTDVAJC6t3GQOjY_Et4EHpeco
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTc4MDAsImV4cCI6MjA4MzI5MzgwMH0.f8RsamihbYQAkwPK2fKXY4Pyk1rl4ZlbVcE3rS4hu_0

# Required - Server Config
NODE_ENV=production
PORT=3001

# IMPORTANT - Set this to your Render backend URL after deployment
# Example: https://devuratracker-backend.onrender.com
PUBLIC_TRACKING_URL=https://YOUR-BACKEND-URL.onrender.com

# IMPORTANT - Set this to your frontend URL after frontend deployment
# Example: https://devuratracker.onrender.com
FRONTEND_URL=https://YOUR-FRONTEND-URL.onrender.com

# Email Configuration (Optional - for email notifications)
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=contact@devura.net
SMTP_PASS=123456789DwVlDeVuRa
SMTP_FROM=contact@devura.net
```

#### After Backend Deploys:
1. Copy your backend URL (e.g., `https://devuratracker-backend.onrender.com`)
2. Update `PUBLIC_TRACKING_URL` environment variable with this URL
3. The service will auto-redeploy

---

### **2. Deploy Frontend to Render**

#### Create New Static Site:
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `devuratracker` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### Update Frontend Config:
Before deploying, update `frontend/src/config/env.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://YOUR-BACKEND-URL.onrender.com'  // Replace with your backend URL
    : 'http://localhost:3001');
```

#### Set Environment Variables (Frontend):
```bash
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
VITE_SUPABASE_URL=https://gvvqaewvhcvhbyleunvi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTc4MDAsImV4cCI6MjA4MzI5MzgwMH0.f8RsamihbYQAkwPK2fKXY4Pyk1rl4ZlbVcE3rS4hu_0
```

---

### **3. Update Backend CORS After Frontend Deploys**

Once your frontend is live:
1. Go to backend service in Render
2. Update `FRONTEND_URL` environment variable with your frontend URL
3. Service will auto-redeploy

---

## 🧪 Testing After Deployment

### Test 1: Basic Functionality
1. Visit your frontend URL
2. Register/Login
3. Create a tracking pixel
4. Verify the pixel URL uses your production backend URL

### Test 2: Tracking Pixel
1. Copy the pixel HTML code
2. Send it via email to another device
3. Open the email
4. Check your notifications in the app

### Test 3: Self-Detection
1. Open the pixel on your own computer
2. Verify you DON'T get a notification (self-tracking prevention)

---

## 🔧 Troubleshooting

### Issue: Tracking pixels not working
- ✅ Verify `PUBLIC_TRACKING_URL` is set correctly in backend
- ✅ Check backend logs in Render dashboard
- ✅ Ensure CORS is allowing all origins for tracking endpoints

### Issue: CORS errors
- ✅ Verify `FRONTEND_URL` matches your actual frontend URL
- ✅ Check that both URLs use HTTPS in production

### Issue: Database errors
- ✅ Verify all Supabase environment variables are correct
- ✅ Check that RLS policies are properly configured

---

## 📊 Production Monitoring

### Render Dashboard:
- Monitor logs for errors
- Check service health
- Review metrics

### Supabase Dashboard:
- Monitor database usage
- Check API requests
- Review authentication logs

---

## 🎯 Post-Deployment

1. **Test thoroughly** from multiple devices
2. **Monitor logs** for the first few hours
3. **Update documentation** with production URLs
4. **Set up alerts** in Render for service downtime

---

## 🔐 Security Notes

- ✅ Never commit `.env` files to Git
- ✅ Use Render's environment variables for secrets
- ✅ Keep Supabase service role key secure
- ✅ Regularly rotate API keys and passwords

---

## 📝 Important URLs to Save

After deployment, save these:
- **Frontend**: `https://YOUR-APP.onrender.com`
- **Backend**: `https://YOUR-BACKEND.onrender.com`
- **Supabase**: `https://gvvqaewvhcvhbyleunvi.supabase.co`

---

Good luck with your deployment! 🚀
