import { randomUUID } from 'crypto';
import { supabase } from '../server.js';

export class TrackingRepository {
  async createTrackingPixel(userId, name) {
    const { data, error } = await supabase
      .from('tracking_pixels')
      .insert({
        user_id: userId,
        name,
        pixel_id: randomUUID()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createTrackingLink(userId, name, originalUrl) {
    const { data, error } = await supabase
      .from('tracking_links')
      .insert({
        user_id: userId,
        name,
        original_url: originalUrl,
        link_id: randomUUID()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTrackingPixel(pixelId) {
    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .eq('pixel_id', pixelId)
      .single();

    if (error) throw error;
    return data;
  }

  async getTrackingLink(linkId) {
    const { data, error } = await supabase
      .from('tracking_links')
      .select('*')
      .eq('link_id', linkId)
      .single();

    if (error) throw error;
    return data;
  }

  async recordOpen(pixelId, metadata = {}) {
    const pixel = await this.getTrackingPixel(pixelId);
    
    const { data, error } = await supabase
      .from('tracking_events')
      .insert({
        tracking_pixel_id: pixel.id,
        user_id: pixel.user_id,
        event_type: 'open',
        metadata: metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async recordClick(linkId, metadata = {}) {
    const link = await this.getTrackingLink(linkId);
    
    const { data, error } = await supabase
      .from('tracking_events')
      .insert({
        tracking_link_id: link.id,
        user_id: link.user_id,
        event_type: 'click',
        metadata: metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async recordReply(pixelId, metadata = {}) {
    const pixel = await this.getTrackingPixel(pixelId);
    
    const { data, error } = await supabase
      .from('tracking_events')
      .insert({
        tracking_pixel_id: pixel.id,
        user_id: pixel.user_id,
        event_type: 'reply',
        metadata: metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserPixels(userId) {
    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        throw new Error('Database tables not found. Please run the migration in Supabase SQL Editor.');
      }
      throw error;
    }
    return data || [];
  }

  async getUserLinks(userId) {
    const { data, error } = await supabase
      .from('tracking_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        throw new Error('Database tables not found. Please run the migration in Supabase SQL Editor.');
      }
      throw error;
    }
    return data || [];
  }

  async getEventsByPixel(pixelId, startDate, endDate) {
    // First get the pixel to get its internal ID
    const pixel = await this.getTrackingPixel(pixelId);
    if (!pixel) throw new Error('Pixel not found');

    let query = supabase
      .from('tracking_events')
      .select('*')
      .eq('tracking_pixel_id', pixel.id);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getEventsByLink(linkId, startDate, endDate) {
    // First get the link to get its internal ID
    const link = await this.getTrackingLink(linkId);
    if (!link) throw new Error('Link not found');

    let query = supabase
      .from('tracking_events')
      .select('*')
      .eq('tracking_link_id', link.id);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getUserEvents(userId, startDate, endDate) {
    let query = supabase
      .from('tracking_events')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async deletePixel(userId, pixelId) {
    // First verify ownership and get the pixel
    const pixel = await this.getTrackingPixel(pixelId);
    if (!pixel) {
      throw new Error('Pixel not found');
    }
    if (pixel.user_id !== userId) {
      throw new Error('Unauthorized: You do not own this pixel');
    }

    // Delete the pixel (CASCADE will delete associated events)
    const { error } = await supabase
      .from('tracking_pixels')
      .delete()
      .eq('id', pixel.id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }

  async deleteLink(userId, linkId) {
    // First verify ownership and get the link
    const link = await this.getTrackingLink(linkId);
    if (!link) {
      throw new Error('Link not found');
    }
    if (link.user_id !== userId) {
      throw new Error('Unauthorized: You do not own this link');
    }

    // Delete the link (CASCADE will delete associated events)
    const { error } = await supabase
      .from('tracking_links')
      .delete()
      .eq('id', link.id)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }
}

