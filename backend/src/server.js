import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { supabaseAdmin } from './utils/supabase.js';
import authRoutes from './routes/auth.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import emailRoutes from './routes/email.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
const PORT = config.server.port;
const FRONTEND_URL = config.frontend.url;
const NODE_ENV = config.server.nodeEnv;

// Export supabase admin client for repositories
export const supabase = supabaseAdmin.client;

// Middleware
// Allow CORS from frontend for API calls, but allow all origins for tracking pixels/links
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow frontend URL
    if (origin === FRONTEND_URL) return callback(null, true);

    // Allow any origin for tracking endpoints (pixels/links need to work from emails)
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.server.isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT} (${NODE_ENV} mode)`);

  // Check if tables exist, if not, prompt user to run migration
  try {
    const { data, error } = await supabaseAdmin.client
      .from('tracking_pixels')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('\n⚠️  Database tables not found!');
      console.log('Please run the migration:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Copy contents of: backend/supabase/migrations/001_initial_schema.sql');
      console.log('3. Paste and execute\n');
    } else {
      console.log('✓ Database connection verified');
    }
  } catch (err) {
    console.log('⚠️  Could not verify database tables. Please ensure migration is run.');
  }
});

