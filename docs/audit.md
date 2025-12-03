# Codebase Audit

This document provides an audit of the ResumeGuruClone codebase, based on an analysis performed on December 2, 2025.

## Summary of Findings

The project is a well-architected full-stack TypeScript application.

**Backend:** An Express.js server acts as the backbone. It serves a REST API for resume management and integrates with the Google Gemini AI for summary generation. A key architectural feature is the dynamic integration of the Vite dev server for a seamless development experience.

**Data Layer:** The data persistence layer is exceptionally well-designed, using a repository pattern (`IStorage` interface). This allows the application to transparently switch between a live Neon (serverless PostgreSQL) database via Drizzle ORM (`DbStorage`) and a complete in-memory mock (`MemStorage`), based on the `DATABASE_URL` environment variable.

**Shared Code:** A `shared` directory contains the single source of truth for data models (`shared/schema.ts`), which defines Drizzle schemas for the database, Zod schemas for API validation, and static data (e.g., templates, pricing plans) used by both client and server.

**Frontend (Preliminary):** The client is a React application built with Vite. It uses TanStack Query for server state management and a modern UI component stack. The core user experience is likely centered in `client/src/pages/Builder.tsx`.

**Conclusion:** The architecture is modern, robust, and highly maintainable, with clear separation of concerns. The next step in a continued audit would be a deep dive into the `client` directory to understand its component structure, state management (`resumeContext.tsx`), and data-fetching patterns.

## Exploration Trace

The following steps were taken to analyze the codebase:

1.  **Analyzed `package.json`**: Identified the project's dependencies and scripts, revealing a full-stack TypeScript project with React, Vite, Express, and Drizzle.
2.  **Read `server/index.ts`**: Understood the server's entry point, middleware, and how it integrates the client for development (Vite middleware) and production (static serving).
3.  **Inspected `server/routes.ts`**: Mapped out the REST API, identifying endpoints for resume CRUD, AI summary generation, and multi-format downloads.
4.  **Analyzed `server/storage.ts`**: Understood the data persistence layer, discovering a robust repository pattern with interchangeable database and in-memory backends.
5.  **Examined `shared/schema.ts`**: Identified it as the single source of truth for data structures, including Drizzle schemas, Zod validation schemas, and static application data.

## Relevant Locations

Here are some of the most important files in the codebase:

-   `package.json`: Defines the entire technology stack for the project, including frontend (React, Vite), backend (Express), database (Drizzle, Neon), and testing (Vitest). The scripts section explains how to run, build, and test the application.
-   `server/index.ts`: The main entry point for the backend server. It orchestrates all server-side components, including routing, authentication, and crucially, the integration with the Vite frontend server in development and serving of static client assets in production.
-   `server/storage.ts`: This file implements a robust repository pattern for data persistence. It abstracts all database logic behind an `IStorage` interface and provides two implementations: one for a live Neon PostgreSQL database using Drizzle ORM, and another for in-memory storage, chosen dynamically via an environment variable. This is the heart of the data layer.
-   `shared/schema.ts`: This is the single source of truth for all data structures in the application. It uses Drizzle to define the PostgreSQL table schemas, Zod to define validation schemas for API data, and also contains static application data like resume templates, colors, and pricing plans. Its location in `shared` means it's used by both the server and client.
-   `server/routes.ts`: Defines all the backend API endpoints. It shows how client requests are handled, how data is validated, how the `storage` module is used for database operations, and how external services like the Google Gemini AI are integrated.
-   `client/src/App.tsx`: This is likely the root component of the React application, responsible for setting up routing and overall page layout.
-   `client/src/pages/Builder.tsx`: Based on the file name and project context, this is the core feature of the application—the resume building interface. It would contain the main UI and state management for creating a resume.
