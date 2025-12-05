# AI Feature Gating - Quick Reference Card

## One-Page Summary

### What is AI Feature Gating?
Restricting AI features (like summary generation) based on user's subscription tier:
- **Free**: No AI access
- **Pro** ($2/mo): AI features enabled
- **Premium** ($7/mo): All AI features enabled

---

## The 3-Layer Implementation

### Layer 1: Frontend (UX)
**File**: `client/src/components/builder/steps/SummaryStep.tsx`

```tsx
import { useAIAccess } from '@/hooks/useAIAccess';

const hasAI = useAIAccess().canUseFeature('aiFeatures');

{hasAI ? (
  <Button onClick={generate}>Generate with AI</Button>
) : (
  <Link href="/pricing"><Button>Upgrade</Button></Link>
)}
```

### Layer 2: Backend (Security)
**File**: `server/routes.ts`

```typescript
import { requireFeature } from './middleware/featureGate.mts';

app.post("/api/generate-summary",
  requireClerk,
  requireFeature('aiFeatures'),  // ← Gates the API
  async (req, res) => { /* ... */ }
);
```

### Layer 3: Analytics (Tracking)
**File**: `client/src/lib/analytics.ts`

```typescript
pricingEvents.aiFeatureBlocked('summary', 'free');    // Free user
pricingEvents.aiFeatureAttempted('summary', 'pro');   // Pro user
pricingEvents.aiFeatureUsed('summary', 'pro', 2450);  // Success
```

---

## Create These Files

### 1. Create Hook: `client/src/hooks/useAIAccess.ts`
```typescript
import { useUser } from '@clerk/clerk-react';
import { hasFeatureAccess } from '@shared/schema';

export function useAIAccess() {
  const { user } = useUser();
  const userPlan = (user?.publicMetadata?.accountTier as string) || 'free';

  return {
    userPlan,
    canUseFeature: (feature: string) => hasFeatureAccess(userPlan, feature),
    requireUpgrade: (feature: string) => !hasFeatureAccess(userPlan, feature),
  };
}
```

### 2. Update: `SummaryStep.tsx`
See: **AI_FEATURE_GATING_IMPLEMENTATION.md**

### 3. Update: `server/routes.ts`
Add middleware: `requireFeature('aiFeatures')`

### 4. Update: `analytics.ts`
Add events: `aiFeatureBlocked()`, `aiFeatureAttempted()`, `aiFeatureUsed()`

---

## Test It

### Free User → Should be blocked
```bash
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Authorization: Bearer FREE_USER_TOKEN"

# Response: 403 Forbidden
```

### Pro User → Should work
```bash
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Authorization: Bearer PRO_USER_TOKEN"

# Response: 200 OK with summary
```

---

## What Users See

### Free User
```
[Your Summary]  [🔒 Pro Feature]
┌─────────────────────────────────┐
│ ⚠️  AI Summary Generator        │
│ Available on Pro plans           │
│              [UPGRADE NOW] →     │
└─────────────────────────────────┘
```

### Pro User
```
[Your Summary]  [✨ Generate with AI]
Button: ENABLED ✅
Click → Generates summary
```

---

## Feature Matrix

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| AI Summary | ❌ | ✅ | ✅ |
| AI Content | ❌ | ✅ | ✅ |
| Cover Letters | ❌ | ❌ | ✅ |
| LinkedIn Opt | ❌ | ❌ | ✅ |

---

## Code Locations

| What | File | Line |
|------|------|------|
| Plans | `shared/schema.ts` | ~440 |
| Feature Check | `shared/schema.ts` | ~547 |
| Gate Middleware | `server/middleware/featureGate.mts` | 1-30 |
| AI Button | `SummaryStep.tsx` | ~95 |
| Analytics | `client/src/lib/analytics.ts` | ~50 |

---

## Checklist

- [ ] Create `useAIAccess.ts` hook
- [ ] Update `SummaryStep.tsx` with plan check
- [ ] Add `requireFeature` to `/api/generate-summary`
- [ ] Add analytics events
- [ ] Test: Free user blocked
- [ ] Test: Pro user works
- [ ] Deploy to production
- [ ] Monitor analytics

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Button still shows for free | Check `useAIAccess` import |
| Backend returns 403 | Verify `requireFeature` middleware added |
| Analytics don't track | Check `pricingEvents` calls in component |
| Pro user still blocked | Check Clerk metadata: `accountTier: "pro"` |
| No error on 403 | Add error handler in useMutation |

---

## Response Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | Success | Pro/Premium user, AI works |
| 403 | Forbidden | Free user, no access |
| 401 | Unauthorized | Not signed in |
| 500 | Error | API failure (Gemini down) |

---

## Files Modified

```
✏️  client/src/components/builder/steps/SummaryStep.tsx
✏️  server/routes.ts
✏️  client/src/lib/analytics.ts
✨  client/src/hooks/useAIAccess.ts (NEW)
```

---

## Implementation Time

| Task | Time |
|------|------|
| Create hook | 15 min |
| Update component | 15 min |
| Update backend | 15 min |
| Add analytics | 10 min |
| Test all flows | 60 min |
| Deploy | 30 min |
| **TOTAL** | **2.5 hours** |

---

## Success Indicators

✅ Free user sees upgrade banner  
✅ Pro user can generate summaries  
✅ Backend rejects free users (403)  
✅ Analytics log feature blocks  
✅ Users convert: Free → Pro  

---

## Next: Other AI Features

Same pattern applies to:
- Cover Letter Generator (gate with `'coverLetters'`)
- LinkedIn Optimization (gate with `'linkedinOptimization'`)
- ATS Score Check (gate with `'aiFeatures'`)

Copy-paste same implementation = 15 min per feature.

---

## Complete Documentation

For more details, see:
- `AI_FEATURE_GATING_GUIDE.md` - Full reference
- `AI_FEATURE_GATING_IMPLEMENTATION.md` - Copy-paste code
- `AI_FEATURE_UX_FLOWS.md` - What users see
- `AI_FEATURE_GATING_INDEX.md` - Navigation guide

---

## Key Points

1. **Always gate on backend** - Frontend can be bypassed
2. **Check user's `accountTier`** - From Clerk metadata or database
3. **Use `hasFeatureAccess()` helper** - Already defined in schema.ts
4. **Track with analytics** - Measure conversion: blocked → purchased
5. **Show upgrade link** - Make it easy to upgrade
6. **Test both flows** - Free (blocked) and Pro (working)

---

## API Endpoint Pattern

```typescript
// BEFORE (no gating)
app.post("/api/generate-summary", requireClerk, handler);

// AFTER (with gating)
app.post("/api/generate-summary", 
  requireClerk,
  requireFeature('aiFeatures'),  // ← Added this
  handler
);

// Result:
// - Free: 403 Forbidden
// - Pro+: 200 OK
```

---

## React Hook Pattern

```typescript
// BEFORE (no gating)
const { generateMutation } = ...

// AFTER (with gating)
const { canUseFeature } = useAIAccess();
const hasAccess = canUseFeature('aiFeatures');

if (!hasAccess) return <UpgradePrompt />;
```

---

**Version**: 1.0  
**Updated**: December 4, 2025  
**Status**: Ready to implement

→ Start with: `AI_FEATURE_GATING_IMPLEMENTATION.md`
