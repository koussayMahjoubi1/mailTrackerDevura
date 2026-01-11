import { createClient } from '@supabase/supabase-js';

// Ensure dotenv is loaded
import dotenv from 'dotenv';
dotenv.config();

// Create Supabase clients with proper environment variables
export const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
  }
  
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
};

export const getSupabaseAdminClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL and Service Role Key must be set in environment variables');
  }
  
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
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

