# Quick Start Guide

Get DevuraTracker up and running in 5 minutes!

## Step 1: Supabase Setup (2 minutes)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secret!)
4. Go to **SQL Editor** and run the migration:
   - Open `backend/supabase/migrations/001_initial_schema.sql`
   - Copy and paste into SQL Editor
   - Click "Run"

## Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install
cp env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

Start the backend:
```bash
npm run dev
```

Backend should be running on http://localhost:3001

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend
npm install
cp env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

Frontend should be running on http://localhost:3000

## Step 4: Test It Out! (1 minute)

1. Open http://localhost:3000 in your browser
2. Click "Register" and create an account
3. Go to the "Tracking" page
4. Create a tracking pixel
5. Copy the HTML code and test it in an email!

## Optional: Email Notifications

To enable email notifications when emails are opened/clicked:

1. Get SMTP credentials (Gmail App Password recommended)
2. Add to `backend/.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@devuratracker.com
   ```

## Troubleshooting

**Backend won't start?**
- Check `.env` file exists and has correct values
- Make sure port 3001 is not in use

**Frontend can't connect?**
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`

**Can't register/login?**
- Verify Supabase credentials are correct
- Check Supabase dashboard for any errors

**Database errors?**
- Make sure you ran the migration SQL
- Check Supabase dashboard → Database → Tables

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Set up email client integrations (Gmail, Outlook, IMAP)
- Configure production deployment settings

