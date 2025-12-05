# AI Feature Gating Guide - ResumeGuru

## Overview

This guide explains how AI features are integrated into ResumeGuru and how to implement plan-based access control to restrict premium AI capabilities to paying users.

## Current AI Integration

### 1. AI Summary Generation (SummaryStep)

**Location**: `client/src/components/builder/steps/SummaryStep.tsx`

**Current Implementation**:
```tsx
// AI Generate Button (Line ~95)
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => generateMutation.mutate()}
  disabled={generateMutation.isPending}
  className="gap-2"
  data-testid="button-generate-summary"
>
  <Sparkles className="w-4 h-4" />
  Generate with AI
</Button>

// API Call (Line ~35)
const generateMutation = useMutation({
  mutationFn: async () => {
    const response = await apiRequest("POST", "/api/generate-summary", {
      contactInfo: resumeData.contactInfo,
      experiences: resumeData.experiences,
      skills: resumeData.skills,
    });
    return response.json();
  },
  // ...
});
```

**Backend Endpoint**: `server/routes.ts` → `POST /api/generate-summary`

**Service**: Uses Google Gemini API for generating professional summaries

---

## Plan-Based Feature Access Model

### Pricing Plans

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| **AI Summary Generator** | ❌ | ✅ | ✅ |
| **AI Resume Content Suggestions** | ❌ | ✅ | ✅ |
| **ATS Optimization (AI)** | ❌ | ✅ | ✅ |
| **LinkedIn Optimization (AI)** | ❌ | ❌ | ✅ |
| **AI Cover Letter Generator** | ❌ | ❌ | ✅ |
| **AI Resume Review** | ❌ | ❌ | ✅ |

**Defined in**: `shared/schema.ts` → `pricingPlans`

```typescript
export const pricingPlans = [
  {
    id: "free",
    access: {
      aiFeatures: false,        // ← Blocks AI
      pdfExport: false,
      // ...
    }
  },
  {
    id: "pro",
    access: {
      aiFeatures: true,         // ← Allows AI
      pdfExport: true,
      // ...
    }
  },
  {
    id: "premium",
    access: {
      aiFeatures: true,         // ← Allows all AI
      pdfExport: true,
      // ...
    }
  }
];
```

---

## Implementation: How to Gate AI Features

### Step 1: Check Plan on Frontend

#### Option A: Check Before Showing Button

```tsx
// In SummaryStep.tsx
import { useUser } from '@clerk/clerk-react';
import { hasFeatureAccess, getPlanById } from '@shared/schema';

export function SummaryStep({ onNext, onBack }: SummaryStepProps) {
  const { user } = useUser();
  const [summary, setSummary] = useState(resumeData.summary || "");
  const { toast } = useToast();

  // Get user's plan (from Clerk user metadata)
  const userPlan = (user?.publicMetadata?.accountTier as string) || 'free';
  const canUseAI = hasFeatureAccess(userPlan, 'aiFeatures');

  return (
    <div className="space-y-6">
      {/* ... existing code ... */}
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Your Summary</label>
        
        {!canUseAI ? (
          // Premium feature badge
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              <Lock className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
            <Link href="/pricing">
              <Button 
                type="button"
                size="sm"
                variant="outline"
                className="gap-2 text-orange-600"
              >
                Upgrade to Use AI
              </Button>
            </Link>
          </div>
        ) : (
          // Normal AI button for Pro/Premium users
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="gap-2"
            data-testid="button-generate-summary"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </Button>
        )}
      </div>

      {/* ... rest of component ... */}
    </div>
  );
}
```

#### Option B: Show Disabled State with Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => generateMutation.mutate()}
        disabled={!canUseAI || generateMutation.isPending}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate with AI
      </Button>
    </TooltipTrigger>
    {!canUseAI && (
      <TooltipContent>
        <p>Upgrade to Pro to use AI features</p>
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>
```

### Step 2: Backend Feature Gate (Server-Side Protection)

**Location**: `server/middleware/featureGate.mts`

```typescript
import type { RequestHandler } from "express";
import { storage } from "../storage.mts";
import { hasFeatureAccess } from "@shared/schema";

export function requireFeature(
  featureKey: keyof (typeof import("@shared/schema").pricingPlans)[number]['access']
): RequestHandler {
  return async (req, res, next) => {
    try {
      const u = (req as any).user as any;
      if (!u || !u.id) return res.status(401).json({ error: 'Unauthorized' });

      // Get user's current plan from database
      const user = await storage.getUser(u.id);
      const tier = (user && (user as any).accountTier) || 'free';

      // Check if user has access to this feature
      const allowed = hasFeatureAccess(tier, featureKey);
      if (!allowed) {
        return res.status(403).json({ 
          error: 'Feature not available for your plan', 
          feature: featureKey 
        });
      }

      next();
    } catch (err) {
      console.error('Feature gate error:', err);
      res.status(500).json({ error: 'Feature gate error' });
    }
  };
}
```

### Step 3: Protect AI Endpoints

**In `server/routes.ts`**:

```typescript
import { requireFeature } from './middleware/featureGate.mts';
import { requireClerk } from './middleware/requireClerk';

// Protect AI summary generation
app.post('/api/generate-summary', requireClerk, requireFeature('aiFeatures'), async (req, res) => {
  try {
    const { contactInfo, experiences, skills } = req.body;

    // Call Gemini API
    const result = await generateSummaryWithGemini({
      contactInfo,
      experiences,
      skills,
    });

    res.json({ summary: result });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Example: Protect additional AI features
app.post('/api/generate-cover-letter', requireClerk, requireFeature('coverLetters'), async (req, res) => {
  // Implementation
});

app.post('/api/optimize-ats', requireClerk, requireFeature('aiFeatures'), async (req, res) => {
  // Implementation
});
```

---

## Frontend: Display Plan Restrictions

### UX Pattern 1: Feature Locked Card

```tsx
// In any builder step component
import { Lock } from 'lucide-react';

function AIFeatureLockedCard({ plan }: { plan: string }) {
  return (
    <Card className="relative border-2 border-dashed border-gray-300 opacity-60">
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">This feature requires a paid plan</p>
          <Link href="/pricing">
            <Button size="sm" className="mt-2">
              View Plans
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-6 blur">
        {/* Content is blurred */}
      </CardContent>
    </Card>
  );
}
```

### UX Pattern 2: Feature Badge

```tsx
function FeatureBadge({ plan, requiredPlan }: { plan: string; requiredPlan: string }) {
  const isLocked = plan === 'free' || 
    (plan === 'pro' && requiredPlan === 'premium');

  if (!isLocked) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-amber-50 text-amber-700">
        <Lock className="w-3 h-3 mr-1" />
        {requiredPlan.toUpperCase()} Feature
      </Badge>
    </div>
  );
}
```

### UX Pattern 3: Upsell Modal

```tsx
// Show when free user tries to use AI feature
function AIUpsellModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Unlock AI Features
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            AI resume generation helps you create professional content faster. 
            Upgrade to Pro to access this feature.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              AI-powered summary generation
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Smart content suggestions
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              ATS optimization
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Not Now
          </Button>
          <Link href="/pricing">
            <Button className="gap-2">
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Hook: useAIAccess

Create a reusable hook for checking AI access:

**File**: `client/src/hooks/useAIAccess.ts`

```typescript
import { useUser } from '@clerk/clerk-react';
import { hasFeatureAccess } from '@shared/schema';
import type { PricingPlan } from '@shared/schema';

type AIFeature = keyof (typeof import("@shared/schema").pricingPlans)[number]['access'];

export function useAIAccess() {
  const { user } = useUser();
  
  const userPlan = (user?.publicMetadata?.accountTier as string) || 'free';

  const canUseFeature = (feature: AIFeature): boolean => {
    return hasFeatureAccess(userPlan, feature);
  };

  const requireUpgrade = (feature: AIFeature): boolean => {
    return !canUseFeature(feature);
  };

  return {
    userPlan,
    canUseFeature,
    requireUpgrade,
    isProOrPremium: userPlan !== 'free',
    isPremium: userPlan === 'premium',
  };
}
```

**Usage**:

```tsx
import { useAIAccess } from '@/hooks/useAIAccess';

export function SummaryStep({ onNext, onBack }: SummaryStepProps) {
  const { canUseFeature, requireUpgrade } = useAIAccess();

  if (requireUpgrade('aiFeatures')) {
    return <UpgradePrompt feature="AI Summary Generation" />;
  }

  return (
    // Component with AI features enabled
  );
}
```

---

## Analytics: Track Feature Access

**File**: `client/src/lib/analytics.ts`

```typescript
export const pricingEvents = {
  // ... existing events
  
  aiFeatureAttempted: (feature: string, userPlan: string) => 
    trackEvent({ name: 'ai_feature_attempted', properties: { feature, userPlan } }),
    
  aiFeatureBlocked: (feature: string, userPlan: string) => 
    trackEvent({ name: 'ai_feature_blocked', properties: { feature, userPlan } }),
    
  aiFeatureUsed: (feature: string, userPlan: string, timeMs: number) => 
    trackEvent({ name: 'ai_feature_used', properties: { feature, userPlan, timeMs } }),
};
```

**Track in Components**:

```tsx
import { pricingEvents } from '@/lib/analytics';

const generateMutation = useMutation({
  mutationFn: async () => {
    const startTime = Date.now();
    pricingEvents.aiFeatureAttempted('summary_generation', userPlan);
    
    const response = await apiRequest("POST", "/api/generate-summary", {
      // ...
    });
    
    const timeMs = Date.now() - startTime;
    pricingEvents.aiFeatureUsed('summary_generation', userPlan, timeMs);
    return response.json();
  },
  onError: () => {
    pricingEvents.aiFeatureBlocked('summary_generation', userPlan);
  },
});
```

---

## Complete Example: Guarded AI Button Component

**File**: `client/src/components/builder/AIGenerateButton.tsx`

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { useAIAccess } from '@/hooks/useAIAccess';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { pricingEvents } from '@/lib/analytics';

interface AIGenerateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  feature?: 'aiFeatures' | 'coverLetters' | 'resumeReview';
}

export function AIGenerateButton({ 
  onClick, 
  isLoading = false,
  feature = 'aiFeatures'
}: AIGenerateButtonProps) {
  const { canUseFeature, userPlan } = useAIAccess();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const hasAccess = canUseFeature(feature);

  const handleClick = () => {
    if (!hasAccess) {
      pricingEvents.aiFeatureBlocked(feature, userPlan);
      setShowUpgrade(true);
      return;
    }
    pricingEvents.aiFeatureAttempted(feature, userPlan);
    onClick();
  };

  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/pricing">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 text-orange-600"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade for AI</span>
                <span className="sm:hidden">Upgrade</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Pro to use AI features</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </>
      )}
    </Button>
  );
}
```

---

## Deployment Checklist

- [ ] **Frontend**: Update all AI feature buttons to use `AIGenerateButton` or check `useAIAccess()`
- [ ] **Backend**: Add `requireFeature('aiFeatures')` middleware to `/api/generate-summary`
- [ ] **Analytics**: Track AI feature usage in `analytics.ts`
- [ ] **Database**: Ensure user `accountTier` field is synced from Clerk
- [ ] **Testing**: Test free user → blocked, Pro user → allowed
- [ ] **Documentation**: Update team on feature gating patterns
- [ ] **Communication**: Notify users about AI feature tier requirements

---

## Files to Update

| File | Change | Priority |
|------|--------|----------|
| `client/src/components/builder/steps/SummaryStep.tsx` | Add plan check, show upgrade button | 🔴 High |
| `server/routes.ts` | Add `requireFeature('aiFeatures')` | 🔴 High |
| `client/src/hooks/useAIAccess.ts` | Create new hook | 🟡 Medium |
| `client/src/components/builder/AIGenerateButton.tsx` | Create reusable component | 🟡 Medium |
| `client/src/lib/analytics.ts` | Add AI tracking events | 🟡 Medium |
| `client/src/pages/Home.tsx` | Update AI section marketing | 🟢 Low |

---

## Quick Reference: API Responses

### Success (User has access)
```json
{
  "summary": "Results-driven software engineer with 5+ years..."
}
```

### Blocked (User lacks plan)
```json
{
  "error": "Feature not available for your plan",
  "feature": "aiFeatures",
  "status": 403
}
```

### Unauthenticated
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

---

## Support & Debugging

**Check User Plan**:
```bash
# In browser console, get Clerk metadata:
clerk.user.publicMetadata.accountTier
```

**Test Feature Gate**:
```bash
# cURL to protected endpoint
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"contactInfo": {...}, "experiences": [...], "skills": [...]}'

# If 403: User doesn't have access
# If 200: User has access
```

---

**Last Updated**: December 4, 2025  
**Status**: Ready for implementation
