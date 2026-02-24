# Quick Setup Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set at minimum:
   - `JWT_SECRET` (any random string)
   - `NEXTAUTH_URL` (http://localhost:3000 for local dev)

3. **Initialize database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Login:**
   - Go to http://localhost:3000/login
   - Use: `admin@njord.com` / `admin123` (Internal Admin)
   - Or: `admin@hospital.com` / `password123` (Customer Admin)

## Troubleshooting

### Database Issues
- If you get Prisma errors, try: `npm run db:push` again
- To reset database: Delete `prisma/dev.db` and run `npm run db:push` and `npm run db:seed`

### Email/Magic Links
- Magic links require SMTP configuration in `.env`
- For development, you can use password login instead
- Magic links will be logged to console if SMTP is not configured

### Port Already in Use
- Change port: `PORT=3001 npm run dev`

## Default Users Created by Seed

- **Internal Admin**: `admin@njord.com` / `admin123`
  - Full access to admin console
  - Can manage KB articles, flows, view all tickets

- **Customer Admin**: `admin@hospital.com` / `password123`
  - Belongs to "Njord Medtech Hospital" organization
  - Can invite users (functionality can be added)

- **Customer User**: `user@hospital.com` / `password123`
  - Belongs to "Njord Medtech Hospital" organization
  - Can view KB, use chat, submit tickets

## Categories

The system uses 6 main categories:
1. Account & Access
2. Setup / Installation (includes maintenance)
3. Feature Not Working
4. Performance / Reliability
5. Billing / Subscription
6. Other / Contact Support

## Next Steps

1. Configure SMTP for magic link emails
2. Customize organization names and users
3. Add more KB articles via Admin Console
4. Create custom troubleshooting flows
5. Set up file storage for ticket attachments (currently just stores filenames)

