# Quick Fix for Render Deployment Error

## The Error
```
Could not read package.json: Error: ENOENT: no such file or directory, open '/opt/render/project/src/package.json'
```

## The Problem
Render is looking for `package.json` in the wrong location because your project structure is:
```
DevuraTracker/
  ├── backend/
  │   └── package.json  ← Your actual package.json
  └── frontend/
      └── package.json
```

## Solution: Two Options

### ✅ Option 1: Set Root Directory (Best - Do This First!)

1. Go to **Render Dashboard** → Click on your service
2. Click **Settings** tab
3. Scroll down and look for **"Root Directory"** field
   - It might be under an "Advanced" section
   - If you don't see it, try Option 2 below
4. Set **Root Directory** to: `backend`
5. Keep **Build Command** as: `npm install`
6. Keep **Start Command** as: `npm start`
7. Click **Save Changes**
8. Click **Manual Deploy** → **Deploy latest commit**

### ✅ Option 2: Update Build Command (If Root Directory Not Available)

If you can't find the "Root Directory" setting, update your Render service settings:

1. Go to **Render Dashboard** → Click on your service
2. Click **Settings** tab
3. Change **Build Command** to:
   ```
   cd backend && npm install
   ```
4. Change **Start Command** to:
   ```
   cd backend && npm start
   ```
5. Click **Save Changes**
6. Click **Manual Deploy** → **Deploy latest commit**

### ❌ Option 3: Delete and Recreate Service (Last Resort)

If neither option works:

1. **Delete** your current Render service
2. Create a **New Web Service**
3. When configuring, **FIRST** set **Root Directory** to `backend` (this option is often only available during creation)
4. Then set other settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

## Which Option Should You Use?

1. **Try Option 1 first** - This is the cleanest solution
2. **If Root Directory field doesn't exist** - Use Option 2
3. **If Option 2 doesn't work** - Use Option 3

## Verify It Worked

After deploying, check the logs. You should see:
- ✅ `npm install` running successfully
- ✅ Dependencies installing from `backend/package.json`
- ✅ Server starting with `npm start`

If you still see errors about `package.json` not found, the Root Directory or Build Command wasn't set correctly.

## ✅ Build Fixed! Next Step: Environment Variables

**Great news!** Your build is now working. If you see an error about missing environment variables (like `Supabase URL and Service Role Key must be set`), you need to add environment variables in Render.

**See `RENDER_ENV_SETUP.md` for complete instructions on adding environment variables.**

