/**
 * Environment configuration
 * Validates and exports environment variables
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const getEnvVar = (key, defaultValue = null, required = false) => {
  const value = process.env[key];
  // Only throw if explicitly required, not just because we're in production
  if (!value && defaultValue === null && required) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please set it in your .env file or deployment environment.`
    );
  }
  return value || defaultValue;
};

// Determine environment
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// Server Configuration
export const PORT = parseInt(getEnvVar('PORT', '3001'), 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Supabase Configuration
export const SUPABASE_URL = getEnvVar('SUPABASE_URL', null, true);
export const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', null, true);
export const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY', null, true);

// Frontend Configuration (for CORS) - Required in production
export const FRONTEND_URL = getEnvVar('FRONTEND_URL', isDevelopment ? 'http://localhost:3000' : null, true);

// Public Tracking URL (for pixels/links sent externally)
// Falls back to local backend if not set
export const PUBLIC_TRACKING_URL = getEnvVar('PUBLIC_TRACKING_URL', `http://localhost:${PORT}`);

// Email Configuration
export const SMTP_HOST = getEnvVar('SMTP_HOST', 'smtp.gmail.com');
export const SMTP_PORT = parseInt(getEnvVar('SMTP_PORT', '587'), 10);
export const SMTP_USER = getEnvVar('SMTP_USER', null);
export const SMTP_PASS = getEnvVar('SMTP_PASS', null);
export const SMTP_FROM = getEnvVar('SMTP_FROM', 'noreply@devuratracker.com');

// Mailgun Configuration (Prioritized if available)
export const MAILGUN_API_KEY = getEnvVar('MAILGUN_API_KEY', null);
export const MAILGUN_DOMAIN = getEnvVar('MAILGUN_DOMAIN', null);
export const MAILGUN_FROM = getEnvVar('MAILGUN_FROM', SMTP_FROM); // Default to SMTP_FROM if not set

// Check if email notifications are enabled
export const EMAIL_NOTIFICATIONS_ENABLED = !!(SMTP_USER && SMTP_PASS);

// OAuth Configuration (optional)
export const GMAIL_CLIENT_ID = getEnvVar('GMAIL_CLIENT_ID');
export const GMAIL_CLIENT_SECRET = getEnvVar('GMAIL_CLIENT_SECRET');
export const GMAIL_REDIRECT_URI = getEnvVar('GMAIL_REDIRECT_URI');
export const OUTLOOK_CLIENT_ID = getEnvVar('OUTLOOK_CLIENT_ID');
export const OUTLOOK_CLIENT_SECRET = getEnvVar('OUTLOOK_CLIENT_SECRET');
export const OUTLOOK_REDIRECT_URI = getEnvVar('OUTLOOK_REDIRECT_URI');

// Export configuration object
export const config = {
  server: {
    port: PORT,
    nodeEnv: NODE_ENV,
    isProduction,
    isDevelopment,
  },
  supabase: {
    url: SUPABASE_URL,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
    anonKey: SUPABASE_ANON_KEY,
  },
  frontend: {
    url: FRONTEND_URL,
  },
  tracking: {
    publicUrl: PUBLIC_TRACKING_URL,
  },
  email: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: SMTP_FROM,
  },
  oauth: {
    gmail: {
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      redirectUri: GMAIL_REDIRECT_URI,
    },
    outlook: {
      clientId: OUTLOOK_CLIENT_ID,
      clientSecret: OUTLOOK_CLIENT_SECRET,
      redirectUri: OUTLOOK_REDIRECT_URI,
    },
  },
};

export default config;

