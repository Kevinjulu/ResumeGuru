# ResumeGuru

ResumeGuru is a powerful, open-source resume builder that helps you create professional resumes with ease. It features a clean, modern interface and provides a variety of templates to choose from. This project is built with a modern tech stack, including React, Node.js, and TypeScript.

## Live Demo

*[Your Live Demo URL Here]*

## Features

- **Intuitive Resume Builder**: A step-by-step guide to building a comprehensive resume.
- **Multiple Templates**: Choose from a variety of professionally designed templates.
- **Color Customization**: Customize the color scheme of your resume to match your personal brand.
- **AI-Powered Summary Generation**: Leverage AI to generate a professional summary for your resume.
- **User Authentication**: Secure user authentication and session management.
- **Premium Tier**: Unlock premium templates and features with a premium subscription.
- **PDF Export**: Download your resume as a high-quality PDF.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web development.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **shadcn/ui**: A collection of re-usable components for React.
- **TanStack Query**: A powerful data-fetching and state management library for React.
- **Wouter**: A minimalist routing library for React.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Drizzle ORM**: A TypeScript ORM for SQL databases.
- **Neon**: A serverless PostgreSQL provider.
- **Passport.js**: A simple, unobtrusive authentication middleware for Node.js.
- **Zod**: A TypeScript-first schema declaration and validation library.

### AI

- **Google Gemini**: A family of generative AI models from Google.

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)
- A PostgreSQL database (e.g., from [Neon](https://neon.tech/))

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/Kevinjulu/ResumeGuru.git
    cd ResumeGuru
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    DATABASE_URL="your_postgresql_connection_string"
    GOOGLE_API_KEY="your_google_api_key"
    SESSION_SECRET="your_session_secret"

    # For PayPal integration (optional)
    PAYPAL_CLIENT_ID="your_paypal_client_id"
    PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
    PAYPAL_CURRENCY="USD"
    ```

### Running the Project

-   **Development**: Run the development server, which includes both the frontend and backend with hot-reloading.
    ```sh
    npm run dev
    ```

-   **Build**: Build the project for production.
    ```sh
    npm run build
    ```

-   **Start**: Start the production server.
    ```sh
    npm run start
    ```

### Deploying to Vercel (frontend)

This repository builds both a frontend (`client`) and a bundled server. The Vite client build outputs static files into `dist/public` via the root `build` script. To deploy the frontend to Vercel from GitHub:

- Ensure your repo is pushed to GitHub (it already is).
- In the Vercel dashboard, create a new project and import the `ResumeGuru` repository.
- Set the project root to the repository root (the default).
- Vercel will run the `build` script defined in `package.json` by default. The `vercel.json` file included in this repo instructs Vercel to use `dist/public` as the static output directory.
- Environment variables: configure the same env vars you use locally (e.g., `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`, `DATABASE_URL`, etc.) in the Vercel project settings.

Notes:
- This `vercel.json` config deploys the frontend static build only (served from `dist/public`). The repo also contains an Express server (bundled to `dist/index.cjs` by the `build` script). Deploying the backend as a Node server on Vercel requires converting the server into Vercel Serverless Functions (or using another host like Render, Fly, or a dedicated server). If you want me to adapt the backend to Vercel Serverless Functions, I can help — it will require some changes to `server/index.ts` (exporting a handler) and adding serverless function wrappers.

If you prefer a single-click setup I can:
- Add an `api/` serverless wrapper for the Express app (so Vercel will run it as serverless functions).
- Or add documentation and a small script for deploying backend to Render/Heroku and frontend to Vercel.

-   **Lint**: Lint the codebase for errors.
    ```sh
    npm run lint
    ```

-   **Test**: Run the test suite.
    ```sh
    npm run test
    ```

## Project Structure

```
.
├── client/         # React frontend
├── server/         # Express backend
├── shared/         # Shared code between frontend and backend (e.g., schemas)
├── script/         # Build scripts
├── tests/          # Test files
├── docs/           # Documentation
└── public/         # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
