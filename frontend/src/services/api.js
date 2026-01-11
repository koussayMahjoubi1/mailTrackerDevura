import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Singleton Supabase client
let supabaseClient = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      config.supabase.url,
      config.supabase.anonKey
    );
  }
  return supabaseClient;
};

const api = axios.create({
  baseURL: config.api.baseURL,
});

// Get token from Supabase and add to requests
api.interceptors.request.use(async (config) => {
  try {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

export default api;

