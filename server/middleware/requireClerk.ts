import type { RequestHandler } from "express";

// Simple middleware to require a verified Clerk identity on API routes.
// Apply this middleware only when you want strict Clerk enforcement (e.g. via REQUIRE_CLERK=true).
export function requireClerk(): RequestHandler {
  return (req, res, next) => {
    const userId = (req as any).clerkUserId || (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Clerk identity required" });
    }
    next();
  };
}

export default requireClerk;
