import type { RequestHandler } from "express";
import { storage } from "../storage.mts";
import { hasFeatureAccess } from "@shared/schema";

// featureKey should match keys in pricingPlans[].access (e.g., 'pdfExport', 'wordExport', 'coverLetters')
export function requireFeature(featureKey: keyof (typeof import("@shared/schema").pricingPlans)[number]['access']): RequestHandler {
  return async (req, res, next) => {
    try {
      const u = (req as any).user as any;
      if (!u || !u.id) return res.status(401).json({ error: 'Unauthorized' });

      // Attempt to load user record (to get accountTier)
      const user = await storage.getUser(u.id);
      const tier = (user && (user as any).accountTier) || (u && u.accountTier) || 'free';

      const allowed = hasFeatureAccess(tier, featureKey as any);
      if (!allowed) {
        return res.status(403).json({ error: 'Feature not available for your plan', feature: featureKey });
      }

      next();
    } catch (err) {
      console.error('Feature gate error:', err);
      res.status(500).json({ error: 'Feature gate error' });
    }
  };
}
