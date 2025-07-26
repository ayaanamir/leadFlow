# Lead Generation SaaS Platform

## Overview

This is a modern lead generation SaaS platform built with React, Express, Drizzle ORM, and PostgreSQL. The application provides a chat-based interface for creating lead generation campaigns, managing prospects, and tracking campaign performance through an AI-powered conversation system called "Lead Generation Joe."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom theming support (dark/light mode)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit Auth integration with OIDC

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with connection pooling
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: `shared/schema.ts` for type sharing between client and server

## Key Components

### Authentication System
- Replit Auth integration with OIDC discovery
- Session-based authentication using connect-pg-simple
- User profile management with automatic user creation
- Protected routes with authentication middleware

### Chat Interface
- AI-powered conversation system using OpenAI GPT-4o
- "Lead Generation Joe" persona for guided campaign creation
- Real-time message exchange with structured parameter collection
- Automatic campaign creation when sufficient information is gathered

### Campaign Management
- Campaign lifecycle tracking (created → scraped → researched → complete)
- Integration hooks for n8n automation workflows
- Progress tracking and status updates
- Campaign parameter storage (locations, job titles, business types)

### Lead Management
- Professional data table with sorting, filtering, and pagination
- Lead status tracking (new, contacted, qualified, not_interested)
- Bulk operations and CSV export functionality
- Individual lead detail views and status updates

### Dashboard & Analytics
- Metric cards showing key performance indicators
- Email alerts system for prospect responses
- Recent activity feeds and quick actions
- Campaign progress visualization

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or retrieving user profiles
2. **Campaign Creation**: Users interact with the chat interface to define campaign parameters
3. **AI Processing**: OpenAI processes conversation context and extracts structured campaign data
4. **Campaign Storage**: Validated campaign data is stored in PostgreSQL via Drizzle ORM
5. **Workflow Integration**: Campaign triggers connect to external n8n automation workflows
6. **Lead Collection**: External workflows populate lead data back into the system
7. **Data Presentation**: Frontend queries and displays campaign and lead data with real-time updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **openai**: AI conversation processing for campaign creation
- **@tanstack/react-query**: Client-side data fetching and caching
- **express & express-session**: Server framework and session management

### UI Dependencies
- **@radix-ui/react-***: Comprehensive set of headless UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast development and build tooling
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development

### External Service Integrations
- **n8n Workflows**: Automation platform for lead scraping and research
- **Apollo.io**: Lead data scraping service
- **Relevance AI**: Profile and post scraping
- **Perplexity AI**: Additional AI processing capabilities

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with tsx for TypeScript execution
- **Database**: Local or Neon PostgreSQL instance
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET, REPL_ID

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations via `npm run db:push`
- **Startup**: Node.js serves both API and static files

### Configuration Requirements
- PostgreSQL database with connection pooling
- OpenAI API key for chat functionality
- Replit domains configuration for authentication
- Session secret for secure cookie signing
- n8n workflow endpoints for automation integration

The application uses a monorepo structure with shared TypeScript types between client and server, enabling type-safe development and efficient code sharing.