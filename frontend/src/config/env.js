/**
 * Environment configuration
 * Validates and exports environment variables
 */

const getEnvVar = (key, defaultValue = null) => {
  const value = import.meta.env[key];
  // In production, env vars are baked in at build time
  // If missing, use defaultValue or throw in dev mode only
  if (!value && defaultValue === null) {
    const isDev = import.meta.env.DEV;
    if (isDev) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please set it in your .env file.`
      );
    }
    // In production, log warning but don't throw (already built)
    console.warn(`⚠️  Environment variable ${key} is not set`);
    return null;
  }
  return value || defaultValue;
};

// Determine if we're in production
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// API Configuration
// Default to localhost in development, must be set in production
export const API_URL = getEnvVar('VITE_API_URL', isDevelopment ? 'http://localhost:3001' : null);

// Supabase Configuration (required)
export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Export configuration object
export const config = {
  api: {
    baseURL: API_URL,
  },
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  env: {
    isProduction,
    isDevelopment,
  },
};

export default config;

