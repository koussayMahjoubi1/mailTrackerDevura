# Environment Configuration Guide

The application now uses centralized environment configuration that works seamlessly in both development and production environments.

## How It Works

### Frontend (`frontend/src/config/env.js`)
- Uses `VITE_` prefixed environment variables (Vite requirement)
- Validates required variables in development mode
- Provides sensible defaults for local development
- All URLs are environment-aware (no hardcoded localhost)

### Backend (`backend/src/config/env.js`)
- Loads environment variables via `dotenv`
- Validates required variables (especially in production)
- Provides defaults for local development
- All configuration comes from environment variables

## Required Environment Variables

### Frontend (`.env` file in `frontend/` directory)

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for production, defaults to localhost in development
VITE_API_URL=http://localhost:3001
```

**For Production (Render Static Site):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (`.env` file in `backend/` directory)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Required - Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Required - Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional - Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@devuratracker.com
```

**For Production (Render Web Service):**
```env
PORT=10000
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=https://your-frontend-url.onrender.com
# ... email config if needed
```

## Key Features

✅ **No Hardcoded URLs** - All URLs come from environment variables
✅ **Development Defaults** - Sensible defaults for local development
✅ **Production Validation** - Proper validation in production mode
✅ **Centralized Config** - Single source of truth for environment variables
✅ **Type Safety** - Consistent access pattern across the app

## Migration Notes

If you're upgrading from the old setup:
1. Your existing `.env` files will continue to work
2. No changes needed to your environment variables
3. The code now uses centralized config instead of direct `process.env` access
4. All hardcoded localhost URLs have been removed

## Testing

To verify your configuration:

**Frontend:**
- Development: Should use `http://localhost:3001` for API if `VITE_API_URL` not set
- Production: Must set `VITE_API_URL` or build will fail

**Backend:**
- Development: Should use `http://localhost:3000` for CORS if `FRONTEND_URL` not set
- Production: Must set `FRONTEND_URL` or CORS will fail

## Troubleshooting

**"Missing required environment variable" error:**
- Check your `.env` file exists and has the variable
- Make sure variable names are correct (case-sensitive)
- For frontend: Variables must start with `VITE_`
- For backend: Variables are read from `.env` file in `backend/` directory

**CORS errors in production:**
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- No trailing slashes
- Include `https://` protocol

**API connection errors:**
- Frontend: Check `VITE_API_URL` matches your backend URL
- Backend: Check server is running and accessible
- Verify CORS is configured correctly

