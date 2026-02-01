-- Add creator_ip columns to track who created the assets
-- This enables self-tracking detection to prevent false notifications

ALTER TABLE public.tracking_pixels 
ADD COLUMN IF NOT EXISTS creator_ip VARCHAR(50);

ALTER TABLE public.tracking_links 
ADD COLUMN IF NOT EXISTS creator_ip VARCHAR(50);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_pixels_creator_ip ON public.tracking_pixels(creator_ip);
CREATE INDEX IF NOT EXISTS idx_tracking_links_creator_ip ON public.tracking_links(creator_ip);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
