# Overall Architecture

This document provides a high-level overview of the ResumeGuruClone application's architecture, outlining its main components and how they interact.

## 1. Project Structure

The project is divided into several main directories:

*   **`client/`**: Contains the frontend React application.
*   **`server/`**: Contains the backend Node.js (Express) application.
*   **`shared/`**: Contains code and definitions shared between the client and server, primarily Drizzle schemas and constants.
*   **`docs/`**: Documentation files (like this one).
*   **`script/`**: Build scripts.
*   **`tests/`**: Unit and integration tests.

## 2. Technology Stack

*   **Frontend**: React, TypeScript, Wouter (routing), Tailwind CSS, Framer Motion (animations), TanStack Query (data fetching).
*   **Backend**: Node.js, Express.js, TypeScript, Drizzle ORM (PostgreSQL database interaction).
*   **Database**: PostgreSQL.
*   **Build Tools**: Vite, esbuild (for server build), PostCSS.

## 3. High-Level Data Flow

User interactions on the **Frontend** (React) trigger requests to the **Backend** (Express API). The backend processes these requests, often interacting with the **PostgreSQL Database** via Drizzle ORM to store or retrieve data. Responses are sent back to the frontend, which then updates the UI.

## 4. Key Systems and Their Responsibilities

### 4.1. Frontend Application (`client/`)
*   **User Interface**: Renders the application's UI, including pages like Home, Templates, Builder, Pricing, Authentication forms, etc.
*   **User Interaction**: Handles user input, navigation, and state management.
*   **API Communication**: Makes HTTP requests to the backend API to fetch, create, update, and delete data.
*   **State Management**: Uses React Context (`resumeContext`) for global resume data and TanStack Query for server-side state.
*   **Routing**: Managed by Wouter.

### 4.2. Backend API (`server/`)
*   **API Endpoints**: Defines RESTful API endpoints for various operations (authentication, resume data management, billing, storage).
*   **Authentication**: Handles user registration, login, session management (cookies), password reset, and authorization.
*   **Data Persistence**: Interacts with the PostgreSQL database via Drizzle ORM to perform CRUD operations on user and resume data.
*   **Business Logic**: Contains the core application logic for processing requests and preparing responses.
*   **Storage**: Manages static file serving and potentially other storage-related tasks.
*   **Billing**: Integrates with payment gateways (e.g., PayPal) for premium features.

### 4.3. Shared Modules (`shared/`)
*   **Database Schema**: Defines the structure of the database tables using Drizzle ORM.
*   **Constants**: Stores shared constants like template definitions (`resumeTemplates`, `cvTemplates`, `templateColors`) and other configurations.

### 4.4. Authentication System
*   Manages user accounts, including registration, login, session management, and password recovery.
*   Backend (`server/auth.ts`, `server/storage.ts`) and Frontend (`client/src/pages/Login.tsx`, etc.) components.

### 4.5. Resume Builder
*   A multi-step process on the frontend allowing users to input their resume details.
*   Integrates with `resumeContext` for local state and saves/loads data via backend APIs.
*   Supports template selection and dynamic preview.

## 5. Build Process

*   **Client Build**: Handled by Vite, which bundles React components, TypeScript, and CSS into optimized static assets. Includes code splitting for improved performance.
*   **Server Build**: Handled by `tsx script/build.ts`, which compiles TypeScript code for the Node.js server.

This overview serves as a starting point. More detailed documentation for each specific system can be found in their respective markdown files.