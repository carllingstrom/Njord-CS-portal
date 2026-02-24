# Authentication Temporarily Disabled

For easier development and testing, authentication has been temporarily disabled.

## Current Behavior

- **All pages are accessible** without login
- The app uses a mock admin user internally (admin@njord.com)
- All features work including:
  - Viewing FAQ/Knowledge Base
  - Using Troubleshooting Chat
  - Submitting Tickets
  - Accessing Admin Console (everyone has admin access)

## What Was Changed

1. **middleware.ts** - Disabled authentication checks
2. **lib/middleware.ts** - Modified to return mock admin user for all requests

## Access the App

Simply go to: **http://localhost:3000**

No login required! You can navigate directly to:
- Home: http://localhost:3000
- Knowledge Base: http://localhost:3000/faq
- Troubleshooting Chat: http://localhost:3000/chat
- Submit Ticket: http://localhost:3000/ticket
- Admin Console: http://localhost:3000/admin

## Re-enabling Authentication Later

To re-enable authentication in the future:

1. Configure SMTP settings in `.env`:
   ```
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   SMTP_FROM="noreply@njord.com"
   ```

2. Restore the original middleware code (check git history)

3. The login page and all auth routes are still functional, just bypassed for now

## Login Credentials (for when auth is enabled)

- Internal Admin: `admin@njord.com` / `admin123`
- Customer Admin: `admin@hospital.com` / `password123`
- Customer User: `user@hospital.com` / `password123`

