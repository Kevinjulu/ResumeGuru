# Backend Architecture

This document details the architecture of the server-side application, built with Node.js and Express.js.

## 1. Core Technologies

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
*   **TypeScript**: Statically typed superset of JavaScript.
*   **Drizzle ORM**: A modern TypeScript ORM for PostgreSQL, providing type-safe database interactions.
*   **PostgreSQL**: The relational database used for data storage.
*   **esbuild**: A fast bundler used for compiling the TypeScript server code.

## 2. Application Structure (`server/`)

*   **`index.ts`**: The main entry point of the server application. It initializes Express, configures middleware, and starts the server.
*   **`routes.ts`**: Defines and groups API routes, linking them to specific handler functions.
*   **`auth.ts`**: Handles all authentication-related logic, including user registration, login, session management (using cookies/JWT), password hashing, and password reset functionalities. It interacts with `storage.ts` for user data persistence.
*   **`billing.ts`**: Manages billing logic, including integration with payment gateways (e.g., PayPal), handling subscriptions, and managing user tiers. It also interacts with `storage.ts` for billing-related data.
*   **`storage.ts`**: Provides an abstraction layer for data persistence. It contains `IStorage` interface, `MemStorage` (in-memory for development/testing), and `DbStorage` (Drizzle ORM implementation for PostgreSQL). This module is responsible for direct database interactions for various data models (users, resume data, etc.).
*   **`static.ts`**: Handles serving static files (e.g., the client-side build) and potentially other static assets.
*   **`vite.ts`**: Integrates with Vite for development and serving the client-side application in production.

## 3. Data Persistence (`server/storage.ts` and `shared/schema.ts`)

The server uses **PostgreSQL** as its primary database. **Drizzle ORM** provides a type-safe interface for interacting with the database.

*   **`shared/schema.ts`**: This file defines the database schema using Drizzle ORM. It includes tables for `users`, `resumeData`, and other application-specific entities. This schema is shared between the client (for type definitions) and the server (for database interactions).
*   **`server/storage.ts`**: Contains the concrete implementations for database operations (CRUD). It abstracts away the direct Drizzle ORM calls, providing a cleaner interface for other server modules to interact with the database.

## 4. Authentication (`server/auth.ts`)

The authentication system is a critical component, handling:

*   **User Registration**: Creating new user accounts, including password hashing.
*   **User Login**: Authenticating users and establishing sessions.
*   **Session Management**: Using secure methods (e.g., HTTP-only cookies, JWTs) to maintain user sessions.
*   **Password Reset**: Generating and verifying password reset tokens, sending reset emails (simulated or actual).
*   **Authorization**: Protecting routes to ensure only authenticated and authorized users can access certain resources.

## 5. API Endpoints (`server/routes.ts`)

The `server/routes.ts` file acts as the central hub for defining API endpoints. It uses Express.js routing to:

*   Map HTTP methods (GET, POST, PUT, DELETE) and URLs to specific handler functions.
*   Organize routes logically (e.g., `/api/auth`, `/api/resume`, `/api/billing`).
*   Apply middleware for authentication, validation, and error handling.

## 6. Error Handling

Global error handling middleware is typically set up in `index.ts` to catch unhandled exceptions and send appropriate error responses to the client. Specific routes may also have their own error handling logic.

## 7. Build Process

The server-side TypeScript code is compiled into JavaScript using `esbuild` (via `tsx script/build.ts`). This process transpiles TypeScript to a Node.js compatible JavaScript version and bundles the server code for deployment.

## 8. Inter-Module Communication

Modules within the server interact by calling functions from each other (e.g., `auth.ts` calls `storage.ts` to save user data). This promotes a clean, modular design.