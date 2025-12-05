
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { storage } from '../storage';
import { Request, Response, NextFunction } from 'express';

// Initialize Clerk middleware
// Note: CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY must be set in environment variables
export const clerkMiddleware = ClerkExpressWithAuth();

// Middleware to ensure user is authenticated and synced to DB
export const requireClerkAuth = async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - Clerk adds auth to req
    if (!req.auth || !req.auth.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // @ts-ignore
        const clerkId = req.auth.userId;

        // Check if user exists in DB
        let user = await storage.getUser(clerkId);

        if (!user) {
            // User doesn't exist in our DB, create them
            // We need to fetch user details from Clerk to get email/username
            // For now, we'll use placeholders or try to get them from claims if available
            // Ideally, we should use the Clerk client to fetch user details

            // Since we don't have the full Clerk client set up here yet, 
            // we'll try to use a default username/email based on ID, 
            // OR we can rely on the frontend to have already created the user via a webhook (best practice)
            // BUT for this "Clone", we'll do JIT provisioning with placeholders if needed, 
            // or better: assume the user was created via a different flow?

            // Let's try to fetch from Clerk API if possible.
            // We need to import clerkClient.
            const { clerkClient } = await import('@clerk/clerk-sdk-node');
            const clerkUser = await clerkClient.users.getUser(clerkId);

            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const username = clerkUser.username || clerkUser.firstName || `user_${clerkId.substring(0, 8)}`;

            if (!email) {
                // Should not happen for a valid user
                return res.status(400).json({ error: "User has no email" });
            }

            // Check if username already exists (collision check)
            const existingUsername = await storage.getUserByUsername(username);
            const finalUsername = existingUsername ? `${username}_${Date.now()}` : username;

            user = await storage.createUser({
                id: clerkId, // Use Clerk ID as our ID
                username: finalUsername,
                email,
                password: "", // No password needed
                accountTier: (clerkUser.publicMetadata?.accountTier as string) || "free"
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in requireClerkAuth:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
