# Template Management

This document describes how templates are defined, selected, and rendered within the ResumeGuruClone application for both resumes and CVs.

## 1. Template Definitions (`shared/schema.ts`)

All available templates and their properties are defined as JavaScript objects within arrays in `shared/schema.ts`. This file serves as the single source of truth for template metadata.

### 1.1. `resumeTemplates` Array

Defines templates specifically for resumes. Each object includes:

*   **`id`**: A unique string identifier (e.g., "basic", "neo", "compact").
*   **`name`**: The display name shown to users (e.g., "Basic", "Neo Modern").
*   **`style`**: A categorization (e.g., "simple", "professional", "modern", "creative").
*   **`description`**: A brief text explaining the template's characteristics.
*   **`premium`**: (Optional boolean) Indicates if the template requires a premium user tier.

### 1.2. `cvTemplates` Array

Defines templates specifically for CVs, following the same structure as `resumeTemplates`.

### 1.3. `templateColors` Array

Defines the available color palettes that can be applied to templates. Each object includes:

*   **`id`**: A unique string identifier (e.g., "blue", "teal", "orange").
*   **`name`**: The display name of the color.
*   **`hex`**: The hexadecimal color code used for styling.

### 1.4. `templateTypography` Object

Defines typography settings for various templates, mapping `templateId` to font families and weights.

## 2. Template Selection Flow

### 2.1. Initial Selection (`client/src/pages/Templates.tsx`, `client/src/pages/CVs.tsx`)

*   Users can browse available templates on the `/templates` (for resumes) and `/cvs` (for CVs) pages.
*   When a user clicks on a template, the `HowToStartModal` is displayed.
*   The modal prompts the user to either "Upload Existing" or "Build New".
*   Selecting either option redirects the user to the `/builder` page, passing the `templateId`, `colorId`, and optionally `documentType` and `upload` query parameters.

### 2.2. In-Builder Re-selection (`client/src/components/builder/steps/TemplateStep.tsx`)

*   Within the builder flow, the `TemplateStep` allows users to change their selected template and color.
*   It dynamically displays either `resumeTemplates` or `cvTemplates` based on the `documentType` prop received from `Builder.tsx`.
*   Users can select a new template, and its effect is immediately reflected in the live preview.
*   Premium template access is restricted based on `userTier`.

## 3. Template Rendering (`client/src/components/builder/ResumePreview.tsx`)

The `ResumePreview` component is responsible for displaying the selected template with the user's data in real-time.

1.  **Data Retrieval**: It uses `useResume()` to access the `resumeData` from the `resumeContext`, which includes `templateId`, `colorId`, and all the user's content (contact info, experience, etc.).
2.  **Dynamic Component Loading**: Based on the `resumeData.templateId`, `ResumePreview` conditionally renders the appropriate template-specific React component.
    *   For example, if `templateId` is "basic", it renders `<BasicTemplate />`.
    *   This uses a series of `if (templateId === "...")` checks to decide which template component to load.
3.  **Prop Passing**: The selected template component (e.g., `BasicTemplate`) receives the `resumeData` object and the `primaryColor` (derived from `colorId`) as props.
4.  **Styling**:
    *   Each template component (e.g., `BasicTemplate`) uses Tailwind CSS classes for its layout and base styling.
    *   The `primaryColor` prop is used to apply dynamic accent colors to headings, borders, or other design elements within the template, ensuring consistency with the user's color selection.
    *   Typography settings from `templateTypography` can also be applied based on the selected `templateId`.

## 4. Custom Templates

The architecture supports adding new templates by:

1.  Defining the new template's metadata in `shared/schema.ts` (adding to `resumeTemplates` or `cvTemplates`).
2.  Creating a new React component for the template (e.g., `client/src/components/templates/MyNewTemplate.tsx`).
3.  Adding a conditional rendering block in `client/src/components/builder/ResumePreview.tsx` to include the new template component based on its `templateId`.

This modular approach ensures that templates can be easily extended and maintained.