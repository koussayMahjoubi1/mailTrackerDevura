# 🚀 Quick Deployment Checklist

## Before You Deploy

- [ ] Push all code to GitHub
- [ ] Verify `.env` files are in `.gitignore` (they should be)
- [ ] Run the SQL migration in Supabase (if not done):
  ```sql
  ALTER TABLE public.tracking_pixels ADD COLUMN IF NOT EXISTS creator_ip VARCHAR(50);
  ALTER TABLE public.tracking_links ADD COLUMN IF NOT EXISTS creator_ip VARCHAR(50);
  ```

---

## Deploy Backend to Render

1. [ ] Create new Web Service on Render
2. [ ] Connect GitHub repository
3. [ ] Set Root Directory: `backend`
4. [ ] Set Build Command: `npm install`
5. [ ] Set Start Command: `npm start`
6. [ ] Add ALL environment variables from `backend/.env.example`
7. [ ] **IMPORTANT**: Leave `PUBLIC_TRACKING_URL` empty initially
8. [ ] Deploy and wait for it to finish
9. [ ] Copy your backend URL (e.g., `https://xyz.onrender.com`)
10. [ ] Go back to Environment tab
11. [ ] Set `PUBLIC_TRACKING_URL` to your backend URL
12. [ ] Service will auto-redeploy

---

## Deploy Frontend to Render

1. [ ] Create new Static Site on Render
2. [ ] Connect GitHub repository
3. [ ] Set Root Directory: `frontend`
4. [ ] Set Build Command: `npm install && npm run build`
5. [ ] Set Publish Directory: `dist`
6. [ ] Add environment variables:
   - `VITE_API_URL` = Your backend URL from step above
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
7. [ ] Deploy and wait for it to finish
8. [ ] Copy your frontend URL

---

## Final Configuration

1. [ ] Go back to backend service in Render
2. [ ] Update `FRONTEND_URL` environment variable with your frontend URL
3. [ ] Wait for auto-redeploy

---

## Test Everything

1. [ ] Visit your frontend URL
2. [ ] Register/Login
3. [ ] Create a tracking pixel
4. [ ] Verify pixel URL shows your production backend URL
5. [ ] Copy pixel HTML and send via email to another device
6. [ ] Open email on that device
7. [ ] Check notifications in your app

---

## ✅ You're Done!

Your DevuraTracker is now live in production! 🎉

**Save these URLs:**
- Frontend: `https://_____.onrender.com`
- Backend: `https://_____.onrender.com`
