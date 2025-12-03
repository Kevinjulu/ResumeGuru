# Convex Setup Guide

This project uses **Convex** as the backend database and serverless function platform, integrated with **Clerk** for authentication.

## Deployment Details

Your Convex deployment has been set up with the following details:

| Item | Value |
|------|-------|
| **Deployment URL** | https://upbeat-setter-988.convex.cloud |
| **HTTP Actions URL** | https://upbeat-setter-988.convex.site |
| **Project** | resumeguru |
| **Team** | bloom-technologies |

## Environment Configuration

Add the following to your `.env.local`:

```env
# Convex deployment URL (enables ConvexStorage adapter)
CONVEX_URL=https://upbeat-setter-988.convex.cloud

# Convex Deploy Key (for hosting integrations)
CONVEX_DEPLOY_KEY=prod:upbeat-setter-988|eyJ2MiI6IjlmNTY4NDA2M2EwNjQ4MWY4NmEyODUyY2MwZTIwYTlhIn0=
```

See `.env.example` for the full template.

## Data Models

The Convex backend uses the following tables (defined in `convex/schema.ts`):

- **resumes** — stores resume documents indexed by `userId`
- **coverLetters** — stores cover letter documents indexed by `userId`
- **users** — stores user profiles with Clerk `userId` reference

## Queries & Mutations

### Resumes

- `getResumes` (query) — fetch resumes for a user (accepts optional `userId` for server-side calls)
- `createResume` (mutation) — create a resume (accepts optional `userId` for server calls)
- `updateResume` (mutation) — update an existing resume
- `deleteResume` (mutation) — delete a resume

### Cover Letters

- `getCoverLetters` (query) — fetch cover letters for a user
- `createCoverLetter` (mutation) — create a cover letter
- `updateCoverLetter` (mutation) — update a cover letter
- `deleteCoverLetter` (mutation) — delete a cover letter

## Server-Side Integration

The `server/convexStorage.ts` adapter calls Convex functions using `ConvexHttpClient`. Routes pass the verified Clerk user ID (from middleware) to Convex for ownership checks.

### Authentication Flow

1. Client sends request with `Authorization: Bearer <clerk_token>` header
2. `server/middleware/clerkAuth.ts` verifies the token and populates `req.clerkUserId`
3. Routes pass `clerkUserId` to storage operations
4. Convex mutations/queries enforce ownership via `userId` checks

## Local Development

### Initialize Convex (if needed)

If you've lost `.env.local` or need to reconfigure:

```bash
npx convex dev --configure=existing --team bloom-technologies --project resumeguru
```

This will regenerate your local Convex config and `.env.local`.

### Seed Data

To populate Convex with initial data:

```bash
npm run convex:seed
```

### Testing

Use the provided test script to verify the Clerk auth middleware:

```bash
node server/scripts/testClerkAuth.js <your_clerk_token>
```

## Deployment

### To Netlify or Vercel

Use the **Convex Deploy Key** to enable automatic deployments:

```
prod:upbeat-setter-988|eyJ2MiI6IjlmNTY4NDA2M2EwNjQ4MWY4NmEyODUyY2MwZTIwYTlhIn0=
```

Add this as an environment variable in your hosting provider's dashboard (ask Convex docs for the specific env var name).

### Manual Deployment

Changes to `convex/` are automatically deployed when you run `npm run dev` locally (with Convex dev mode enabled).

For production, deploy via:

```bash
npx convex deploy
```

## Troubleshooting

### Can't connect to Convex

- Ensure `CONVEX_URL` is set correctly in `.env.local`
- Check that the URL matches your deployment (https://upbeat-setter-988.convex.cloud)
- Verify network connectivity and firewall rules

### Auth failures

- Ensure `CLERK_JWT_KEY` or `CLERK_SECRET_KEY` is set in `.env.local`
- Verify the Clerk token is valid and not expired
- Check that `REQUIRE_CLERK=true` is set if strict mode is desired

### Lost `.env.local`?

Run the reinitialize command above to regenerate config.

## References

- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- Project files:
  - `convex/resumes.ts` — Resume mutations & queries
  - `convex/coverLetters.ts` — Cover letter mutations & queries
  - `server/convexStorage.ts` — HTTP client adapter for Convex
  - `server/middleware/clerkAuth.ts` — Token verification & user ID extraction
