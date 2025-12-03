import type { RequestHandler } from "express";

// Middleware that attempts to verify Clerk auth tokens and populate `req.clerkUserId`.
// It dynamically imports `@clerk/clerk-sdk-node` if available; otherwise it will
// decode the JWT payload without verification as a fallback (development only).

export function clerkAuthMiddleware(): RequestHandler {
  return async (req, _res, next) => {
    try {
      const authHeader = (req.get("authorization") || "").toString();
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

      let userId: string | undefined;

      if (token) {
        const clerk = await import("@clerk/clerk-sdk-node").catch(() => null);

        // Accept either CLERK_JWT_KEY or CLERK_SECRET_KEY for different deploy naming
        const clerkSecret = process.env.CLERK_JWT_KEY || process.env.CLERK_SECRET_KEY || process.env.CLERK_API_KEY;

        if (clerk) {
          try {
            // Try common verify helpers depending on Clerk SDK version.
            if (typeof (clerk as any).verifyToken === "function") {
              const payload = await (clerk as any).verifyToken(token, { secret: clerkSecret });
              userId = payload?.sub || payload?.subject || payload?.userId;
            } else if (typeof (clerk as any).jwtVerify === "function") {
              const payload = await (clerk as any).jwtVerify(token, { secret: clerkSecret });
              userId = payload?.sub || payload?.subject || payload?.userId;
            } else if ((clerk as any).Clerk && typeof (clerk as any).Clerk.verifySession === "function") {
              const payload = await (clerk as any).Clerk.verifySession(token);
              userId = payload?.userId || payload?.sub;
            } else {
              // Last resort: decode JWT without verifying (development fallback)
              const parts = token.split(".");
              if (parts.length >= 2) {
                const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
                userId = decoded?.sub || decoded?.user_id || decoded?.userId;
              }
            }
          } catch (err) {
            console.error("Clerk verification failed:", err);
          }
        } else {
          // SDK not present: best-effort decode (INSECURE — dev only)
          try {
            const parts = token.split(".");
            if (parts.length >= 2) {
              const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
              userId = decoded?.sub || decoded?.user_id || decoded?.userId;
            }
          } catch (_) {
            // ignore
          }
        }
      }

      if (userId) {
        (req as any).clerkUserId = userId;
        if (!(req as any).user) (req as any).user = { id: userId };
      }
    } catch (e) {
      console.error("Error in clerkAuthMiddleware:", e);
    }

    next();
  };
}

export default clerkAuthMiddleware;
