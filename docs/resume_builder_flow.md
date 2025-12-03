# Resume Builder Flow

This document outlines the user experience and underlying technical flow of the Resume Builder feature in the ResumeGuruClone application.

## 1. User Journey

1.  **Template Selection**: The user starts by selecting a resume or CV template (or opting to upload an existing document) from the `/templates` or `/cvs` page. This selection can be made via the `HowToStartModal`.
    *   **"Upload Existing"**: Redirects to `/builder?upload=true` with selected template/color.
    *   **"Build New"**: Redirects to `/builder` with selected template/color.
2.  **Builder Page Access**: The user is navigated to the `/builder` page.
3.  **Multi-Step Form**: The builder presents a multi-step form to guide the user through entering their resume details. The steps typically include:
    *   **Upload** (optional, if `upload=true` in URL params): User can upload a PDF/DOCX file to extract data. (Currently, this is a UI placeholder with simulated data extraction).
    *   **Contact Information**: Personal details like name, email, phone, address.
    *   **Summary**: Professional summary or objective statement.
    *   **Experience**: Work history, job titles, companies, dates, and bullet points.
    *   **Education**: Academic background, degrees, institutions, and graduation dates.
    *   **Skills**: Relevant skills categorized or listed.
    *   **Certifications**: Professional certifications and dates.
    *   **Template (Re-selection)**: Allows the user to change their template and color scheme within the builder.
    *   **Download**: The final step to generate and download the resume.
4.  **Live Preview**: Throughout the process, a live preview of the resume is displayed alongside the form, updating in real-time as the user enters information.
5.  **Navigation**: Users can navigate between steps using "Next" and "Back" buttons, or by clicking on the step indicators in the sidebar/mobile navigation.
6.  **Saving Progress**: (Implied, but not fully explicit in provided code) User's progress should be saved, typically to the backend, associated with their user account.
7.  **Download**: On the final step, the user can download their generated resume in various formats (e.g., PDF).

## 2. Frontend Implementation (`client/src/pages/Builder.tsx`)

*   **`Builder.tsx`**: The main component for the resume builder.
    *   **URL Parameters**: Uses `useSearch` (from `wouter`) to parse URL query parameters like `template`, `cvTemplate`, `color`, and `upload`.
    *   **`currentStep` State**: Manages the active step in the multi-step form.
    *   **`steps` Array**: An array of objects defining each step (id, label, icon).
    *   **Conditional Rendering**: The `renderStep` function dynamically renders the appropriate step component based on `currentStep`.
    *   **Navigation Logic**: `goToNext`, `goBack`, and `goToStep` functions manage state transitions between steps.
    *   **`ResumePreview`**: A component that displays the live rendering of the resume, receiving `resumeData` as props.
*   **`resumeContext.tsx` (`client/src/lib/`)**:
    *   A React Context (`ResumeProvider`, `useResume`) provides the global state for the `resumeData` object.
    *   `resumeData` is a comprehensive object containing all contact info, summary, experience, education, skills, certifications, selected template, color, layout, and section order.
    *   Functions like `setContactInfo`, `addExperience`, `setTemplate`, etc., are provided by the context to update the `resumeData` state.
*   **Step Components (`client/src/components/builder/steps/`)**: Each step (e.g., `ContactStep`, `SummaryStep`, `ExperienceStep`, `UploadStep`) is its own React component.
    *   They receive `onNext` and `onBack` props for navigation.
    *   They use `useResume()` to access and update the global `resumeData` state.
    *   Forms within these components validate user input and update `resumeData`.
*   **Template Components (`client/src/components/templates/`)**: Specific components (e.g., `BasicTemplate.tsx`) are responsible for rendering the resume data in a particular style. These are selected and rendered by `ResumePreview` based on `resumeData.templateId`.

## 3. Data Flow

1.  **Initialization**: When the builder page loads, `resumeData` is initialized. If `template` or `cvTemplate` parameters are present in the URL, `setTemplate` and `setColor` are called to set the initial template and color.
2.  **User Input**: As the user fills in forms in step components, `useResume()` hooks are used to dispatch updates to the `resumeData` object in the `resumeContext`.
3.  **Real-time Preview**: Any change to `resumeData` triggers a re-render of `ResumePreview`, which in turn re-renders the selected template component with the updated data.
4.  **Upload Flow**: If `upload=true`, the `UploadStep` is shown first. Upon "processing" a file (currently simulated), `resumeData` is populated with extracted (dummy) data, and the flow proceeds to the next step.
5.  **Persistence**: (To be fully implemented) When the user saves their progress or reaches the final download step, the complete `resumeData` object is sent to the backend API (`/api/resume/save`) to be stored in the database, associated with their user ID.

## 4. Key Considerations

*   **Responsiveness**: The builder interface should be responsive and work well on different screen sizes.
*   **User Experience**: Clear navigation, validation, and feedback are crucial.
*   **Error Handling**: Graceful handling of API errors and invalid user input.
*   **Scalability**: The modular step and template component architecture allows for easy addition of new steps or template designs.
*   **Backend Integration**: The connection between the `resumeContext` data and backend persistence mechanisms is vital for saving and loading user resumes.