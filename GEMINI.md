# Project Overview

This is a full-stack resume builder application called ResumeGuru. It allows users to create, manage, and download professional resumes and cover letters. The application features a modern, intuitive user interface and provides a variety of templates to choose from. It also includes features like AI-powered summary generation, user authentication, and a premium subscription tier.

The frontend is built with React, Vite, and TypeScript, and styled with Tailwind CSS and shadcn/ui. The backend is a Node.js server using Express, with a PostgreSQL database and Drizzle ORM.

# Building and Running

## Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)
- A PostgreSQL database (e.g., from [Neon](https://neon.tech/))

## Installation

1.  **Install dependencies:**
    ```sh
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```
    DATABASE_URL="your_postgresql_connection_string"
    GOOGLE_API_KEY="your_google_api_key"
    SESSION_SECRET="your_session_secret"
    ```

## Key Commands

-   **Run in development mode:**
    ```sh
    npm run dev
    ```
    This command starts both the frontend and backend servers with hot-reloading.

-   **Build for production:**
    ```sh
    npm run build
    ```
    This command builds the frontend and backend for production.

-   **Run in production mode:**
    ```sh
    npm run start
    ```
    This command starts the production server.

-   **Run linter:**
    ```sh
    npm run lint
    ```

-   **Run tests:**
    ```sh
    npm run test
    ```

# Development Conventions

## Code Style

The project uses ESLint to enforce a consistent coding style. You can run `npm run lint` to check for any linting errors.

## Testing

The project uses Vitest for testing. You can run `npm run test` to execute the test suite.

## Project Structure

-   `client/`: Contains the React frontend application.
-   `server/`: Contains the Node.js backend server.
-   `shared/`: Contains shared code between the frontend and backend, such as data schemas.
-   `script/`: Contains build scripts.
-   `tests/`: Contains test files.
-   `docs/`: Contains project documentation.
-   `public/`: Contains static assets.
