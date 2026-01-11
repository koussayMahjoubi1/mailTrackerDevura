# Database Migration Guide

## Automatic Migration (Recommended)

Supabase doesn't support automatic migrations via API for security reasons. You need to run migrations manually.

## Manual Migration Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**

2. **Run Migration**
   - Open the file: `backend/supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

3. **Verify Tables**
   - Go to **Table Editor** in Supabase dashboard
   - You should see these tables:
     - `tracking_pixels`
     - `tracking_links`
     - `tracking_events`
     - `email_accounts`

## What the Migration Creates

- **tracking_pixels**: Stores tracking pixel definitions
- **tracking_links**: Stores tracking link definitions  
- **tracking_events**: Stores all tracking events (opens, clicks, replies)
- **email_accounts**: Stores email client connection configurations
- **Indexes**: For better query performance
- **Triggers**: For automatic `updated_at` timestamps

## Troubleshooting

If you see errors:
- Make sure you're using the **service_role** key (not anon key) for admin operations
- Check that the `uuid-ossp` extension is enabled (it should be by default)
- Verify your Supabase project is active and not paused

The server will check for tables on startup and warn you if migrations haven't been run.

