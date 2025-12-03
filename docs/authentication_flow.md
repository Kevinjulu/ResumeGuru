# Authentication Flow

This document details the user authentication system within the ResumeGuruClone application, covering user registration, login, session management, and password recovery.

## 1. User Journey

### 1.1. Registration
1.  User navigates to the `/register` page.
2.  User provides an email address and sets a password.
3.  Upon successful registration, the user is typically logged in automatically and redirected to a dashboard or home page.

### 1.2. Login
1.  User navigates to the `/login` page.
2.  User provides their registered email and password.
3.  Upon successful login, a session is established, and the user is redirected to a protected area of the application.

### 1.3. Forgot Password
1.  User navigates to the `/forgot-password` page.
2.  User enters their registered email address.
3.  The system sends a password reset email to the provided address containing a unique tokenized link.
4.  User clicks the link, which directs them to the `/reset-password/:token` page.

### 1.4. Reset Password
1.  On the `/reset-password/:token` page, the user enters and confirms a new password.
2.  The token is validated by the backend.
3.  If valid, the user's password is updated, and they are typically redirected to the login page to sign in with their new credentials.

### 1.5. Account Management
1.  Authenticated users can access the `/account` page.
2.  On this page, users can view their account details, change their password, manage subscriptions, or perform other profile-related actions.

### 1.6. Logout
1.  Authenticated users can log out from the application, typically via a button in the header.
2.  Logging out terminates the user's session on the server and clears local session identifiers (e.g., cookies).

## 2. Frontend Implementation (`client/src/pages/`)

*   **`Login.tsx`**: Provides the login form and handles submission, sending credentials to the backend.
*   **`Register.tsx`**: Provides the registration form and handles submission.
*   **`ForgotPassword.tsx`**: Provides a form to request a password reset email.
*   **`ResetPassword.tsx`**: Displays a form to set a new password, receiving a `token` from the URL.
*   **`Account.tsx`**: Displays user account information and options.
*   **`MainLayout.tsx` and `Header.tsx`**: Responsible for displaying dynamic login/logout/account links based on the user's authentication status.
*   **API Communication**: These components communicate with backend authentication endpoints using `fetch` or `TanStack Query`.

## 3. Backend Implementation (`server/`)

*   **`auth.ts`**: The core of the authentication logic.
    *   **User Registration**:
        *   Receives email and password.
        *   Hashes the password using a strong cryptographic hashing algorithm (e.g., bcrypt).
        *   Stores the user's email, hashed password, and default `accountTier` in the database via `storage.ts`.
    *   **User Login**:
        *   Receives email and password.
        *   Retrieves the user from the database.
        *   Compares the provided password with the stored hashed password.
        *   If credentials are valid, generates a session identifier (e.g., JWT or session ID) and sends it back to the client (often in an HTTP-only cookie).
    *   **Session Management**:
        *   Middleware to verify the authenticity of incoming requests by checking session identifiers.
        *   Maintains user login status.
    *   **Forgot Password**:
        *   Generates a unique, time-limited `passwordResetToken` for the user.
        *   Stores this token and its expiration in the `users` table via `storage.ts`.
        *   Sends an email containing a link with this token to the user.
    *   **Reset Password**:
        *   Receives the `passwordResetToken` and a new password.
        *   Validates the token's existence and expiration.
        *   Hashes the new password and updates the user's password in the database.
        *   Invalidates the used reset token.
*   **`storage.ts`**:
    *   Provides methods to interact with the `users` table in the PostgreSQL database.
    *   Handles saving, retrieving, and updating user records, including `passwordResetToken` and `passwordResetExpires` fields.
*   **`routes.ts`**:
    *   Defines specific endpoints for authentication actions (e.g., `/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/me`, `/api/auth/logout`).

## 4. Security Considerations

*   **Password Hashing**: Passwords are never stored in plain text. Strong, one-way hashing algorithms (like bcrypt) are used.
*   **Secure Sessions**: Session identifiers (e.g., JWTs, session cookies) are handled securely, often with HTTP-only flags for cookies to prevent client-side script access.
*   **Token Expiration**: Password reset tokens have a limited lifespan to prevent replay attacks.
*   **Input Validation**: All user inputs (email, password) are validated on both the client and server to prevent common vulnerabilities like SQL injection and cross-site scripting (XSS).
*   **Rate Limiting**: (Good practice, potentially implemented) To prevent brute-force attacks on login and password reset forms.

This authentication system ensures secure and reliable user management for the application.