# Deployment Guide for Render

This is a monorepo with separate `backend/` and `frontend/` directories. You need to deploy them as separate services on Render.

## Deployment Structure

1. **Backend Service** - Node.js/Express API
2. **Frontend Static Site** - React/Vite build

## Step 1: Deploy Backend

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `devura-tracker-backend` (or your choice)
   - **Root Directory**: `backend` ← **IMPORTANT!**
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build` (or just `npm install` if you don't have a build step)
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add Environment Variables:
   ```
   PORT=10000
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@devuratracker.com
   ```

5. Click **Create Web Service**

## Step 2: Deploy Frontend

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `devura-tracker-frontend` (or your choice)
   - **Root Directory**: `frontend` ← **IMPORTANT!**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. Click **Create Static Site**

## Step 3: Update URLs

After both services are deployed:

1. Get your backend URL (e.g., `https://devura-tracker-backend.onrender.com`)
2. Get your frontend URL (e.g., `https://devura-tracker-frontend.onrender.com`)
3. Update Frontend environment variables in Render:
   - Set `VITE_API_URL` to your backend URL
4. Update Backend environment variables in Render:
   - Set `FRONTEND_URL` to your frontend URL

## Step 4: Database Migration

Run the database migration in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste contents of `backend/supabase/migrations/001_initial_schema.sql`
3. Execute the migration
4. (Optional) Run `backend/supabase/migrations/002_rls_policies.sql` for RLS policies

## Troubleshooting

### Error: Could not read package.json (ENOENT)

**Quick Fix (Applied):** I've created a root-level `package.json` that works as a workaround. This should fix your immediate deployment issue.

**Proper Fix (Recommended):** Set "Root Directory" to `backend` in Render service settings:
1. Render Dashboard → Your Service → Settings
2. Look for "Root Directory" field (may be under "Advanced")
3. Set to: `backend`
4. Save and redeploy

**If Root Directory field doesn't exist:**
- The root-level `package.json` workaround I created should work
- Or delete the service and create a new one (Root Directory can sometimes only be set during creation)

### Backend can't connect to Supabase
- Verify environment variables are set correctly
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the service_role key (not anon key)

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set to your backend URL (include `https://`)
- Check CORS settings in backend - `FRONTEND_URL` should match your frontend URL

### Build fails
- Make sure Node.js version is compatible (v16+)
- Check that all dependencies are listed in package.json
- Review build logs for specific errors

### 500 errors after deployment
- Check that database migration has been run
- Verify all environment variables are set
- Check backend logs in Render dashboard

## Alternative: Single Root Directory

If Render doesn't support root directory setting, you can create a root `package.json`:

```json
{
  "name": "devura-tracker",
  "private": true,
  "scripts": {
    "install:backend": "cd backend && npm install",
    "install:frontend": "cd frontend && npm install",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "start:backend": "cd backend && npm start"
  }
}
```

But the **Root Directory** approach is cleaner and recommended.

## Notes

- Backend service will get a URL like: `https://devura-tracker-backend.onrender.com`
- Frontend static site will get a URL like: `https://devura-tracker-frontend.onrender.com`
- Free tier services spin down after inactivity - first request may be slow
- Consider upgrading to paid tier for always-on services

