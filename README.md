# DevuraTracker - Email Tracking Application

A full-stack email tracking application built with React (frontend) and Node.js/Express (backend), using Supabase for authentication and PostgreSQL database.

## Features

- **User Authentication**: Secure registration and login using Supabase Auth
- **Email Tracking**:
  - Generate reusable tracking pixels (1x1 transparent images)
  - Generate reusable tracking links
  - Track email opens, clicks, and replies
- **Dashboard**: 
  - View metrics (open rate, click rate, reply rate)
  - Filter by date range
  - Visual charts and graphs
  - Recent events timeline
- **Email Notifications**: Receive email alerts when emails are opened, clicked, or replied to
- **Email Client Support**: Integration with IMAP, Gmail, and Outlook for reply tracking

## Architecture

The application follows a clean architecture pattern:

```
Backend:
routes → controllers → services → repositories → Supabase

Frontend:
Components → Services → API → Backend
```

### Backend Structure

```
backend/
├── src/
│   ├── server.js                 # Express server setup
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.js
│   │   ├── tracking.routes.js
│   │   ├── dashboard.routes.js
│   │   └── email.routes.js
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── tracking.controller.js
│   │   ├── dashboard.controller.js
│   │   └── email.controller.js
│   ├── services/                 # Business logic
│   │   ├── tracking.service.js
│   │   ├── dashboard.service.js
│   │   ├── notification.service.js
│   │   └── email.service.js
│   ├── repositories/            # Data access layer
│   │   └── tracking.repository.js
│   └── middleware/               # Express middleware
│       └── auth.middleware.js
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

### Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx                   # Main app component with routing
│   ├── main.jsx                  # Entry point
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/                    # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── Tracking.jsx
│   ├── components/               # Reusable components
│   │   └── Layout.jsx
│   └── services/                 # API service layer
│       ├── api.js
│       ├── trackingService.js
│       └── dashboardService.js
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- SMTP server credentials (for email notifications)

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Note your project URL and API keys (anon key and service role key)
3. Run the migration file to create the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `backend/supabase/migrations/001_initial_schema.sql`
   - Execute the migration

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@devuratracker.com
   
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:3001

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## Usage

### Creating a Tracking Pixel

1. Log in to the application
2. Navigate to the "Tracking" page
3. Click "Create Pixel"
4. Enter a name for your pixel
5. Copy the tracking URL or HTML code
6. Embed the pixel in your email HTML:
   ```html
   <img src="http://localhost:3001/api/tracking/pixel/{pixel_id}" width="1" height="1" />
   ```

### Creating a Tracking Link

1. Navigate to the "Tracking" page
2. Switch to the "Tracking Links" tab
3. Click "Create Link"
4. Enter a name and the original URL
5. Copy the tracking URL
6. Replace links in your emails with the tracking URL

### Viewing Metrics

1. Navigate to the "Dashboard" page
2. Use the date filters to select a date range
3. View metrics including:
   - Open rate
   - Click rate
   - Reply rate
   - Event charts
   - Recent events

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Tracking
- `POST /api/tracking/pixel` - Create a tracking pixel (requires auth)
- `POST /api/tracking/link` - Create a tracking link (requires auth)
- `GET /api/tracking/pixels` - Get user's tracking pixels (requires auth)
- `GET /api/tracking/links` - Get user's tracking links (requires auth)
- `GET /api/tracking/pixel/:pixelId` - Track email open (public)
- `GET /api/tracking/link/:linkId` - Track link click (public)
- `GET /api/tracking/pixel/:pixelId/events` - Get pixel events (requires auth)
- `GET /api/tracking/link/:linkId/events` - Get link events (requires auth)

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics (requires auth)
  - Query params: `startDate`, `endDate`

### Email Integration
- `POST /api/email/gmail/connect` - Connect Gmail account (requires auth)
- `POST /api/email/outlook/connect` - Connect Outlook account (requires auth)
- `POST /api/email/imap/connect` - Connect IMAP account (requires auth)

## Database Schema

### Tables

- `tracking_pixels` - Stores tracking pixel definitions
- `tracking_links` - Stores tracking link definitions
- `tracking_events` - Stores all tracking events (opens, clicks, replies)
- `email_accounts` - Stores email client connection configurations

## Security Considerations

- All API endpoints (except public tracking endpoints) require authentication
- Authentication is handled via Supabase Auth with JWT tokens
- Service role key is only used server-side
- Frontend uses anon key for client-side operations
- Tracking endpoints are public but don't expose sensitive data

## Email Client Integration

### Gmail
- Uses OAuth 2.0 for authentication
- Requires Gmail API credentials
- Checks inbox for replies to tracked emails

### Outlook
- Uses Microsoft Graph API
- Requires Azure AD app registration
- Checks inbox for replies

### IMAP
- Generic IMAP support
- Requires IMAP server credentials
- Checks inbox for replies

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Update `FRONTEND_URL` to your production frontend URL
3. Use a process manager like PM2
4. Set up SSL/TLS certificates
5. Configure environment variables securely

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using a web server (nginx, Apache, etc.)
3. Configure environment variables for production

### Supabase
1. Enable Row Level Security (RLS) policies
2. Set up database backups
3. Configure API rate limiting

## Troubleshooting

### Backend won't start
- Check that all environment variables are set
- Verify Supabase credentials are correct
- Ensure port 3001 is not in use

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Authentication issues
- Verify Supabase URL and keys are correct
- Check browser console for errors
- Ensure Supabase Auth is enabled in your project

### Tracking not working
- Verify tracking URLs are correct
- Check that emails allow images to load
- Verify database schema is set up correctly

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

