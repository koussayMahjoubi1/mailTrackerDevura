import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Create Supabase clients with proper environment variables
export const getSupabaseClient = () => {
  return createClient(
    config.supabase.url,
    config.supabase.anonKey
  );
};

export const getSupabaseAdminClient = () => {
  return createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey
  );
};

// Lazy-loaded singleton clients
let supabaseClient = null;
let supabaseAdminClient = null;

export const supabase = {
  get client() {
    if (!supabaseClient) {
      supabaseClient = getSupabaseClient();
    }
    return supabaseClient;
  }
};

export const supabaseAdmin = {
  get client() {
    if (!supabaseAdminClient) {
      supabaseAdminClient = getSupabaseAdminClient();
    }
    return supabaseAdminClient;
  }
};

