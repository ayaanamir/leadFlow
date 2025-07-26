# Lead Generation SaaS - Deployment Guide

## GitHub Repository Setup

Your Lead Generation SaaS platform is ready to be pushed to: **https://github.com/ayaanamir/leadFlow.git**

### Manual Git Push Instructions

Since git operations are restricted in the Replit environment, follow these steps in your terminal:

```bash
# 1. Check current git status
git status

# 2. Add all files to staging
git add .

# 3. Commit your changes
git commit -m "feat: Complete Lead Generation SaaS Platform

- Modern UI with company branding (#8c52ff, white, black)
- Authentication system with Replit Auth
- Separate pages: Dashboard, Analytics, Settings, Campaigns, Leads
- AI-powered chat campaign creation interface
- PostgreSQL database integration with Drizzle ORM
- Professional design with animations and glass effects
- Comprehensive lead management system
- Email alerts and notification system
- n8n workflow integration ready"

# 4. Add GitHub remote (if not already added)
git remote add origin https://github.com/ayaanamir/leadFlow.git

# 5. Push to GitHub
git push -u origin main
```

### If Authentication is Required

GitHub may require authentication. Use one of these methods:

**Option 1: Personal Access Token**
- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate a new token with repository permissions
- Use your GitHub username and the token as password when prompted

**Option 2: SSH (if configured)**
```bash
git remote set-url origin git@github.com:ayaanamir/leadFlow.git
git push -u origin main
```

## Project Structure Overview

```
leadFlow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express.js backend
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── replitAuth.ts     # Authentication setup
├── shared/
│   └── schema.ts         # Shared TypeScript types
└── README.md
```

## Environment Variables Required

For production deployment, ensure these environment variables are set:

```
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_api_key (for AI chat functionality)
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
REPLIT_DOMAINS=your_domains
```

## Features Included

### ✅ Authentication & Security
- Replit OpenID Connect integration
- Session-based authentication
- Protected routes and API endpoints
- User profile management

### ✅ Modern UI/UX
- Company branding with #8c52ff purple theme
- Glass morphism effects and animations
- Responsive design for all devices
- Dark/light mode support
- Professional SaaS-style interface

### ✅ Lead Management
- Professional data table with sorting/filtering
- Lead status tracking (new, contacted, qualified, not_interested)
- Bulk operations and CSV export
- Individual lead detail views

### ✅ Campaign Management
- AI-powered campaign creation via chat interface
- Campaign lifecycle tracking
- Integration with n8n automation workflows
- Progress monitoring and status updates

### ✅ Analytics & Reporting
- Performance metrics dashboard
- Campaign analytics and insights
- Email alert system
- Activity tracking

### ✅ Settings & Configuration
- User profile management
- Notification preferences
- Integration management
- Security settings

## Next Steps After GitHub Push

1. **Set up production database** (PostgreSQL)
2. **Configure environment variables**
3. **Set up OpenAI API key** for chat functionality
4. **Configure n8n webhook endpoints**
5. **Deploy to production** (Vercel, Railway, or similar)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **AI Integration**: OpenAI GPT-4o
- **Styling**: Tailwind CSS with custom design system
- **Build Tools**: Vite

Your platform is production-ready and includes all modern SaaS features with professional UI/UX design.