import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Singleton Supabase client
let supabaseClient = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
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

