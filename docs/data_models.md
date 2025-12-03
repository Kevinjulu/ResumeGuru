# Data Models

This document describes the primary data models used throughout the ResumeGuruClone application, focusing on the shared schema definitions and how they are used for data persistence and client-server communication.

## 1. Shared Schema (`shared/schema.ts`)

The `shared/schema.ts` file is central to the application's data management. It defines:

*   **Database Schema**: Using Drizzle ORM, it declares the structure of tables in the PostgreSQL database. This includes column definitions, relationships, and constraints.
*   **TypeScript Types**: Automatically generates TypeScript types from the Drizzle schema, ensuring type safety across both the frontend and backend when dealing with these data structures.
*   **Application Constants**: Stores various application-specific constants and configurations, such as:
    *   `resumeTemplates`: Definitions for available resume templates.
    *   `cvTemplates`: Definitions for available CV templates.
    *   `templateColors`: Predefined color palettes for templates.
    *   `templateTypography`: Typography settings for various templates.
    *   `pricingPlans`: Details about subscription tiers and their features.

## 2. Key Data Models

### 2.1. `users` Table

This table stores user account information.

*   **`id`**: Unique identifier for the user.
*   **`email`**: User's email address (unique).
*   **`password`**: Hashed password for security.
*   **`accountTier`**: User's subscription level (e.g., 'free', 'premium').
*   **`passwordResetToken`**: Token used for password reset functionality (nullable).
*   **`passwordResetExpires`**: Expiration timestamp for the password reset token (nullable).
*   **Other authentication-related fields**: Such as session tokens or last login details.

### 2.2. `resumeData` Table

This table stores the content of a user's resume or CV. The structure is designed to be flexible, often storing a JSON object representing the entire resume content.

*   **`id`**: Unique identifier for the resume entry.
*   **`userId`**: Foreign key linking to the `users` table, indicating ownership.
*   **`data`**: A JSONB field (or similar) containing the complete resume content, including:
    *   `contactInfo`: Name, email, phone, address, LinkedIn, website.
    *   `summary`: Professional summary text.
    *   `experiences`: Array of work experience entries (job title, company, dates, description/bullets).
    *   `education`: Array of education entries (degree, school, dates, GPA, honors).
    *   `skills`: Array of skill entries (name, level/category).
    *   `certifications`: Array of certification entries (name, issuer, date).
    *   `templateId`: Identifier of the selected template.
    *   `colorId`: Identifier of the selected color scheme.
    *   `layoutVariant`: Specific layout options for certain templates.
    *   `sectionOrder`: Custom order of sections in the resume.
*   **`createdAt`**: Timestamp of creation.
*   **`updatedAt`**: Timestamp of last update.

### 2.3. Template Definitions (e.g., `resumeTemplates`, `cvTemplates`)

These are not database tables but arrays of objects defined in `shared/schema.ts`. Each object represents an available template:

*   **`id`**: Unique identifier for the template (e.g., "basic", "neo").
*   **`name`**: Display name of the template.
*   **`style`**: Categorization of the template (e.g., "simple", "professional", "creative").
*   **`description`**: A brief description of the template.
*   **`premium`**: (Optional) Boolean indicating if the template is for premium users.

### 2.4. `templateColors`

An array of objects defining the available color schemes:

*   **`id`**: Unique identifier for the color (e.g., "blue", "green").
*   **`name`**: Display name of the color.
*   **`hex`**: Hexadecimal color code.

## 3. Data Flow and Consistency

*   **Frontend**: Uses the TypeScript types generated from `shared/schema.ts` to ensure that data sent to and received from the backend conforms to the expected structure. `resumeContext` holds the current `ResumeData` object.
*   **Backend**: Uses the Drizzle ORM schema from `shared/schema.ts` to define the database tables and perform type-safe queries. It validates incoming data against these schemas before processing and persisting it.
*   **Drizzle Migrations**: Changes to the database schema (`shared/schema.ts`) are managed through Drizzle migrations, ensuring that database updates are applied safely and consistently.