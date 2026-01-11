-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure we're using the public schema
SET search_path TO public;

-- Tracking Pixels table
CREATE TABLE IF NOT EXISTS public.tracking_pixels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    pixel_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Links table
CREATE TABLE IF NOT EXISTS public.tracking_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    original_url TEXT NOT NULL,
    link_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracking Events table
CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_pixel_id UUID REFERENCES public.tracking_pixels(id) ON DELETE CASCADE,
    tracking_link_id UUID REFERENCES public.tracking_links(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('open', 'click', 'reply')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Accounts table
CREATE TABLE IF NOT EXISTS public.email_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('gmail', 'outlook', 'imap')),
    email VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.tracking_pixels TO authenticated;
GRANT ALL ON public.tracking_links TO authenticated;
GRANT ALL ON public.tracking_events TO authenticated;
GRANT ALL ON public.email_accounts TO authenticated;

-- Grant permissions to service_role (for backend)
GRANT ALL ON public.tracking_pixels TO service_role;
GRANT ALL ON public.tracking_links TO service_role;
GRANT ALL ON public.tracking_events TO service_role;
GRANT ALL ON public.email_accounts TO service_role;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_user_id ON public.tracking_pixels(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_pixel_id ON public.tracking_pixels(pixel_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_user_id ON public.tracking_links(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_link_id ON public.tracking_links(link_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_user_id ON public.tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_pixel_id ON public.tracking_events(tracking_pixel_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_link_id ON public.tracking_events(tracking_link_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON public.tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON public.tracking_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_provider ON public.email_accounts(provider);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_tracking_pixels_updated_at ON public.tracking_pixels;
CREATE TRIGGER update_tracking_pixels_updated_at BEFORE UPDATE ON public.tracking_pixels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tracking_links_updated_at ON public.tracking_links;
CREATE TRIGGER update_tracking_links_updated_at BEFORE UPDATE ON public.tracking_links
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_accounts_updated_at ON public.email_accounts;
CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON public.email_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Refresh PostgREST schema cache (this might not work directly, but worth trying)
NOTIFY pgrst, 'reload schema';

