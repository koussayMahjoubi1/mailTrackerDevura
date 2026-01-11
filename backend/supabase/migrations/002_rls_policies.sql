-- Enable Row Level Security on all tables
ALTER TABLE tracking_pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tracking pixels
CREATE POLICY "Users can view own pixels" ON tracking_pixels
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pixels" ON tracking_pixels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pixels" ON tracking_pixels
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pixels" ON tracking_pixels
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Users can only see their own tracking links
CREATE POLICY "Users can view own links" ON tracking_links
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links" ON tracking_links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links" ON tracking_links
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links" ON tracking_links
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Users can only see their own tracking events
CREATE POLICY "Users can view own events" ON tracking_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON tracking_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only manage their own email accounts
CREATE POLICY "Users can view own email accounts" ON email_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email accounts" ON email_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email accounts" ON email_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email accounts" ON email_accounts
    FOR DELETE USING (auth.uid() = user_id);

