# Frontend Architecture

This document details the architecture of the client-side application, built with React and TypeScript.

## 1. Core Technologies

*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Statically typed superset of JavaScript, enhancing code quality and maintainability.
*   **Wouter**: A minimalistic routing library for React, used for navigation within the application.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development and consistent styling.
*   **Framer Motion**: A production-ready motion library for React, used for animations and transitions (e.g., in the Builder and Template steps).
*   **TanStack Query (React Query)**: For managing, caching, and synchronizing server state in the React application.
*   **Vite**: A fast build tool that provides a rapid development environment and bundles the application for production.

## 2. Application Structure (`client/src/`)

*   **`App.tsx`**: The main entry point of the React application. It sets up global contexts (QueryClientProvider, TooltipProvider) and contains the primary routing logic. Uses `React.lazy` and `Suspense` for code splitting.
*   **`main.tsx`**: Renders the `App` component into the DOM.
*   **`index.css`**: Global CSS styles, primarily Tailwind CSS imports.
*   **`components/`**: Reusable UI components.
    *   **`components/builder/`**: Components specific to the resume builder interface.
        *   **`ResumePreview.tsx`**: Displays the live preview of the resume, conditionally rendering different template components.
        *   **`steps/`**: Individual steps of the resume builder process (Contact, Summary, Experience, etc.).
        *   **`components/modals/`**: Modal components (e.g., `HowToStartModal.tsx`).
        *   **`components/layout/`**: Layout-related components (`Header.tsx`, `Footer.tsx`, `MainLayout.tsx`).
        *   **`components/templates/`**: Specific template implementations (e.g., `BasicTemplate.tsx`).
        *   **`components/ui/`**: Shadcn UI components, a collection of pre-built, accessible UI components.
*   **`hooks/`**: Custom React hooks for reusable logic (e.g., `use-mobile.tsx`, `use-toast.ts`).
*   **`lib/`**: Utility functions, context providers, and client-side configuration.
    *   **`queryClient.ts`**: Configuration for TanStack Query.
    *   **`resumeContext.tsx`**: React Context for managing the global state of the resume data during the building process.
    *   **`utils.ts`**: General utility functions.
*   **`pages/`**: Top-level page components that are typically mapped to routes (e.g., Home, Templates, Builder, Login).

## 3. State Management

The frontend uses a combination of approaches for state management:

*   **`resumeContext.tsx`**: A custom React Context that holds the current resume data being edited in the builder. It provides methods to update different sections of the resume. This is crucial for real-time updates in the `ResumePreview`.
*   **TanStack Query**: Used for fetching, caching, and updating server-side data (e.g., user authentication status, billing information). It simplifies data fetching from the backend API.
*   **Component Local State**: For UI-specific state that doesn't need to be shared globally (e.g., form input values before submission, modal open/close status).

## 4. Routing

The `wouter` library is used for client-side routing. Routes are defined in `App.tsx` using `Switch` and `Route` components, mapping URL paths to specific page components. Dynamic routes (e.g., `/reset-password/:token`) are supported.

## 5. Styling

**Tailwind CSS** is the primary styling framework. It promotes a utility-first approach, allowing for rapid and consistent styling directly within JSX. Custom styles are generally defined by composing Tailwind utility classes.

## 6. Code Splitting

`React.lazy()` and `Suspense` are employed in `App.tsx` to dynamically import page components. This ensures that JavaScript bundles for pages are loaded only when they are needed, significantly improving the application's initial load time and overall performance.

## 7. Interaction with Backend

The frontend communicates with the backend API via standard HTTP requests (e.g., `fetch` API or similar libraries). These interactions typically involve:

*   **Authentication**: Sending user credentials for login/registration.
*   **Data CRUD**: Creating, reading, updating, and deleting resume data, user profiles, etc.
*   **Billing**: Initiating and confirming payment processes.

Responses from the backend are processed, and the frontend state and UI are updated accordingly.