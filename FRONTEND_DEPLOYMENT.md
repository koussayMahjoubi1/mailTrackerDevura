# Frontend Deployment Guide (Render Static Site)

## Overview

You deployed your backend to: `https://mailtrackerdevura.onrender.com/`

The `{"error":"Route not found"}` message is **normal** - that's your API endpoint, not your frontend. You need to deploy the frontend as a separate **Static Site** on Render.

## Step 1: Deploy Frontend as Static Site

1. Go to **Render Dashboard**
2. Click **New** → **Static Site**
3. Connect your GitHub repository: `koussayMahjoubi1/mailTrackerDevura`
4. Configure the service:

   - **Name**: `devura-tracker-frontend` (or your choice)
   - **Root Directory**: `frontend` ← **IMPORTANT!**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` ← This is where Vite outputs the build

5. **Environment Variables** - Click **Add Environment Variable** and add:

   ```
   VITE_SUPABASE_URL=https://gvvqaewvhcvhbyleunvi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dnFhZXd2aGN2aGJ5bGV1bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTc4MDAsImV4cCI6MjA4MzI5MzgwMH0.f8RsamihbYQAkwPK2fKXY4Pyk1rl4ZlbVcE3rS4hu_0
   VITE_API_URL=https://mailtrackerdevura.onrender.com
   ```

   **Important Notes:**
   - `VITE_` prefix is required for Vite environment variables
   - `VITE_API_URL` should be your **backend URL** (the one you just deployed)
   - Don't include trailing slash in `VITE_API_URL`

6. Click **Create Static Site**

## Step 2: Wait for Deployment

- Render will build your React app
- You'll get a frontend URL like: `https://devura-tracker-frontend.onrender.com`
- This is your **actual app URL** that users visit!

## Step 3: Update Backend CORS (Important!)

After frontend is deployed, you need to update your backend's `FRONTEND_URL`:

1. Go to **Backend Service** → **Environment** tab
2. Update `FRONTEND_URL` to your new frontend URL:
   ```
   FRONTEND_URL=https://devura-tracker-frontend.onrender.com
   ```
3. Save changes (Render will redeploy backend automatically)

This allows your frontend to make API calls to your backend (CORS).

## Step 4: Test Your Deployed App!

1. Visit your **frontend URL** (e.g., `https://devura-tracker-frontend.onrender.com`)
2. You should see your login/register page
3. Try logging in
4. Everything should work!

## Architecture Summary

```
User Browser
    ↓
Frontend (Static Site) → https://devura-tracker-frontend.onrender.com
    ↓ (API calls)
Backend (Web Service) → https://mailtrackerdevura.onrender.com
    ↓ (database)
Supabase → https://gvvqaewvhcvhbyleunvi.supabase.co
```

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is set to your backend URL (no trailing slash)
- Check backend `FRONTEND_URL` matches your frontend URL
- Check backend CORS settings in `server.js`

### Build fails
- Make sure **Root Directory** is set to `frontend`
- Check that **Publish Directory** is `dist`
- Review build logs for specific errors

### 404 errors on routes
- Make sure you're visiting the **frontend URL**, not the backend URL
- Backend URL (`/api/*`) is for API calls only
- Frontend URL is your React app

### Environment variables not working
- Variables must start with `VITE_` prefix
- Redeploy after adding/changing environment variables
- Vite bakes env vars into the build at build time

## Quick Checklist

- [ ] Deployed frontend as Static Site on Render
- [ ] Set Root Directory to `frontend`
- [ ] Added environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`)
- [ ] Got frontend URL from Render
- [ ] Updated backend `FRONTEND_URL` environment variable
- [ ] Tested frontend URL in browser
- [ ] Tested login/register functionality

## Alternative: Deploy to Netlify/Vercel

If you prefer, you can also deploy to:
- **Netlify**: Similar process, supports monorepos
- **Vercel**: Also supports monorepos with root directory setting

But Render Static Sites work great too, and keeps everything in one place!

