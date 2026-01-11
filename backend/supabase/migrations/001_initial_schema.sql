-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but we can reference it)
-- The auth.users table is created automatically by Supabase

-- Tracking Pixels table
CREATE TABLE IF NOT EXISTS tracking_pixels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    pixel_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Links table
CREATE TABLE IF NOT EXISTS tracking_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    original_url TEXT NOT NULL,
    link_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Events table
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_pixel_id UUID REFERENCES tracking_pixels(id) ON DELETE CASCADE,
    tracking_link_id UUID REFERENCES tracking_links(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('open', 'click', 'reply')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Accounts table (for storing email client connections)
CREATE TABLE IF NOT EXISTS email_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('gmail', 'outlook', 'imap')),
    email VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_user_id ON tracking_pixels(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_pixel_id ON tracking_pixels(pixel_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_user_id ON tracking_links(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_link_id ON tracking_links(link_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_user_id ON tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_pixel_id ON tracking_events(tracking_pixel_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_link_id ON tracking_events(tracking_link_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user_id ON email_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_provider ON email_accounts(provider);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_tracking_pixels_updated_at BEFORE UPDATE ON tracking_pixels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_links_updated_at BEFORE UPDATE ON tracking_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON email_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

