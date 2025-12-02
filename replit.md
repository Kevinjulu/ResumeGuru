# ResumeGuru - AI-Powered Resume Builder

## Overview

ResumeGuru is a web-based resume builder application that helps users create professional resumes quickly and efficiently. The application is a direct clone of ResumeGenius with rebranding, featuring AI-powered content generation, multiple professional templates, and a step-by-step builder interface. Users can create, customize, and download resumes in multiple formats (PDF, Word, TXT).

The platform follows a conversion-focused design approach with clear CTAs, guided user flows, and a heavy emphasis on visual template showcases to drive users into the resume builder experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing with pages including Home, Templates, Pricing, Resources, Builder, and a 404 Not Found page.

**State Management**: 
- React Context API for resume data management through `ResumeContext`
- TanStack Query (React Query) for server state and API data fetching
- Local storage persistence for draft resume data

**UI Component Library**: 
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with a custom design system
- Design system follows "new-york" style variant
- Custom CSS variables for theming (primarily light mode)

**Design System**:
- Typography: Lexend for headings, Inter for body text
- Color scheme: Orange primary (#EA723C), Blue accent (#4B94EA)
- Spacing follows Tailwind's 4px-based scale
- Component patterns emphasize professional trust and conversion focus

**Animation**: Framer Motion for page transitions and interactive elements

**Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture

**Runtime**: Node.js with Express.js server framework

**API Design**: RESTful endpoints with JSON request/response format

**Key Endpoints**:
- `/api/generate-summary` - AI-powered professional summary generation using OpenAI GPT-5

**Server Structure**:
- `server/index.ts` - Main Express application setup with middleware
- `server/routes.ts` - Route registration and API endpoint handlers
- `server/storage.ts` - Data access layer with in-memory storage implementation
- `server/static.ts` - Static file serving for production builds
- `server/vite.ts` - Vite development server integration for HMR

**Development/Production Split**:
- Development: Vite middleware for HMR and instant updates
- Production: Pre-built static files served from `dist/public`

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map-based storage class (`MemStorage`)

**Schema Design** (defined in `shared/schema.ts`):
- Users table: id, username, password (hashed)
- Resumes table: id, userId, title, templateId, colorId, data (JSONB), createdAt, updatedAt
- Resume data structure includes: contactInfo, summary, experiences, education, skills, certifications

**ORM**: Drizzle ORM configured for PostgreSQL with schema definitions

**Database Configuration**: 
- PostgreSQL expected via `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations (output to `./migrations`)
- Neon serverless PostgreSQL client for production database connections

**Note**: The application is configured for PostgreSQL but currently uses in-memory storage. Database implementation is prepared but not active.

### Resume Builder Flow

**Multi-Step Process**:
1. Contact Information - Personal and contact details
2. Summary - Professional summary (AI-generated or manual)
3. Experience - Work history with job titles, companies, dates, descriptions
4. Education - Academic background
5. Skills - Technical and soft skills
6. Certifications - Professional certifications and achievements
7. Template Selection - Choose from 10 pre-designed templates
8. Download - Export as PDF, DOCX, or TXT

**Resume Templates**: 10 professionally designed templates (Clean, Taj Mahal, 2025, Corporate, Advanced, Majestic, Modern, Minimalist, Elegant, Chicago)

**Template Customization**: 8 color schemes (Orange, Blue, Green, Red, Purple, Navy, Teal, Dark Blue)

**Preview System**: Real-time resume preview component that updates as users input data

### External Dependencies

**AI Services**:
- OpenAI API (GPT-5 model) for AI-powered content generation
- Professional summary generation based on user's experience and skills
- Graceful fallback to templated summaries when API key is unavailable

**UI Libraries**:
- Radix UI primitives for accessible component foundations
- Lucide React for iconography
- React Icons (Simple Icons) for social media icons

**Development Tools**:
- Replit-specific plugins: runtime error modal, cartographer, dev banner
- TypeScript for type safety across the entire codebase
- ESBuild for server-side bundling in production

**Build Process**:
- Vite for client bundling
- ESBuild for server bundling with selective dependency bundling
- Build script bundles allowlisted dependencies to reduce syscalls and improve cold start times

**Styling**:
- Tailwind CSS with custom configuration
- PostCSS with Autoprefixer
- Custom CSS variables for comprehensive theming

**Form & Validation**:
- React Hook Form for form state management
- Zod for runtime type validation and schema definition
- @hookform/resolvers for Zod integration

**Date Handling**: date-fns for date formatting and manipulation

**Animations**: 
- Framer Motion for declarative animations
- Embla Carousel for template galleries

**Path Aliases**:
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`