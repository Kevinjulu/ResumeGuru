# AI Integration - Current State & Architecture

## Current AI Implementation Status

### ✅ What's Already Implemented

#### 1. AI Summary Generation (ACTIVE)
**Location**: `client/src/components/builder/steps/SummaryStep.tsx`  
**Backend**: `server/routes.ts` → `/api/generate-summary`  
**Service**: Google Gemini API  
**Triggered by**: User clicks "Generate with AI" button  
**What it does**: Creates professional 2-3 sentence resume summary based on:
- Contact information
- Work experiences
- Skills list

**Status**: ✅ Working, needs plan gating

---

#### 2. AI Marketing Section (ON HOMEPAGE)
**Location**: `client/src/pages/Home.tsx` → `AISection()` component  
**What it shows**:
- "Make your resume faster with AI" section
- Demo form showing AI input/output
- Marketing copy about AI benefits
- Badge: "AI-Powered"

**Status**: ✅ Marketing content exists, no gating yet

---

### ⏭️ What's Partially Ready

#### 1. Feature Gating Infrastructure
**Location**: `server/middleware/featureGate.mts`  
**What it does**: Middleware to protect endpoints  
**Status**: ✅ Exists but not used on AI endpoints yet

**Code**:
```typescript
export function requireFeature(featureKey: string): RequestHandler {
  return async (req, res, next) => {
    const user = await storage.getUser(req.user.id);
    const tier = user.accountTier || 'free';
    if (!hasFeatureAccess(tier, featureKey)) {
      return res.status(403).json({ error: 'Feature not available for your plan' });
    }
    next();
  };
}
```

#### 2. Plan Definitions
**Location**: `shared/schema.ts` → `pricingPlans`  
**What it defines**:
- Free, Pro, Premium plans
- Features available per plan
- Access control matrix

**Status**: ✅ Complete, with `aiFeatures` flag

**Code**:
```typescript
{
  id: "pro",
  access: {
    aiFeatures: true,        // ← AI enabled for Pro
    pdfExport: true,
    wordExport: true,
    // ...
  }
}
```

#### 3. Clerk Integration
**Location**: Various  
**What it does**: Stores user's subscription tier in Clerk metadata  
**Field**: `user.publicMetadata.accountTier`  
**Values**: "free" | "pro" | "premium"

**Status**: ✅ Ready to use

---

## Current Data Flow

### Without Feature Gating (Current)

```
Free User tries AI:
  ↓
Click "Generate with AI"
  ↓
Frontend: POST /api/generate-summary
  ↓
Backend: Calls Gemini API (no check)
  ↓
Returns: Professional summary
  ↓
User gets AI benefit (free!) ❌ LEAK
```

### With Feature Gating (After Implementation)

```
Free User tries AI:
  ↓
useAIAccess() checks: canUseFeature('aiFeatures')
  ↓
Returns: false (not in free tier)
  ↓
Frontend: Shows "Upgrade" button instead
  ↓
User clicks: Redirected to /pricing
  ↓
User sees: $2/month Pro plan with AI
  ↓
User upgrades → accountTier = "pro"
  ↓
Now can use AI ✅

Pro User tries AI:
  ↓
useAIAccess() checks: canUseFeature('aiFeatures')
  ↓
Returns: true (in pro tier)
  ↓
Frontend: Shows "Generate with AI" button
  ↓
Click button → POST /api/generate-summary
  ↓
Backend: requireFeature('aiFeatures') checks tier
  ↓
Tier = "pro" → hasFeatureAccess("pro", "aiFeatures") = true
  ↓
Calls Gemini API
  ↓
Returns: Professional summary ✅
```

---

## File Inventory: AI-Related Code

### Frontend Files

#### 1. `client/src/components/builder/steps/SummaryStep.tsx`
**Purpose**: AI summary generation UI  
**Lines**: 165 total  
**AI Code**:
- Line 35-50: `generateMutation` calls `/api/generate-summary`
- Line 78: Import `Sparkles` icon
- Line 95-110: "Generate with AI" button
- Line 121-126: Examples fallback

**What needs changing**: Add plan check, show upgrade for free users

---

#### 2. `client/src/pages/Home.tsx`
**Purpose**: Homepage with AI marketing  
**Lines**: 600+ total  
**AI Code**:
- Line 237-320: `AISection()` component
- Includes: Badge with Sparkles icon, demo form, marketing copy
- Line 278-300: Fake form showing AI input/output

**What needs changing**: Marketing messaging, maybe add "Check pricing" CTA

---

#### 3. `client/src/lib/analytics.ts`
**Purpose**: Event tracking  
**Lines**: 100+ total  
**AI Code**:
- Line 51-57: AI event definitions (pdfExportBlocked, etc.)
- Missing: aiFeatureBlocked, aiFeatureAttempted, aiFeatureUsed

**What needs adding**: AI feature tracking events

---

#### 4. `client/src/lib/resumeContext.tsx`
**Purpose**: State management  
**Lines**: 300+ total  
**AI-Related**: No direct AI code, but stores generated summaries in context

**What needs changing**: None, works as-is

---

### Backend Files

#### 1. `server/routes.ts`
**Purpose**: API endpoints  
**Lines**: 200+ total  
**AI Code**:
- Line ~50-80: `POST /api/generate-summary` handler
- Calls: `generateSummaryWithGemini()`
- Missing: `requireFeature` middleware

**Current**:
```typescript
app.post("/api/generate-summary", requireClerk, async (req, res) => {
  // No plan check!
});
```

**Needs to be**:
```typescript
app.post("/api/generate-summary", requireClerk, requireFeature('aiFeatures'), async (req, res) => {
  // Now with plan check
});
```

---

#### 2. `server/middleware/featureGate.mts`
**Purpose**: Feature access control  
**Lines**: 30 total  
**Status**: ✅ Already exists and working  
**What it does**: Checks user's plan before allowing feature access

**Code** (already exists):
```typescript
export function requireFeature(featureKey: string): RequestHandler {
  return async (req, res, next) => {
    const user = await storage.getUser(u.id);
    const tier = (user?.accountTier) || 'free';
    const allowed = hasFeatureAccess(tier, featureKey);
    if (!allowed) {
      return res.status(403).json({ 
        error: 'Feature not available for your plan', 
        feature: featureKey 
      });
    }
    next();
  };
}
```

**How to use**: Already clear, just need to add to `/api/generate-summary`

---

#### 3. `server/billing.mts`
**Purpose**: Payment handling  
**Lines**: 200+ total  
**AI-Related**: Updates `accountTier` when payment received

**What it does**:
```typescript
app.post('/api/billing/paypal/capture-order', async (req, res) => {
  // ...
  await storage.upsertSubscription(u.id, { 
    tier,  // ← Updates tier to "pro" or "premium"
    // ...
  });
});
```

**Status**: ✅ Works with AI gating

---

### Shared Files

#### 1. `shared/schema.ts`
**Purpose**: Data types and plan definitions  
**Lines**: 600+ total  
**AI Code**:
- Line 440-520: `pricingPlans` array
- Line 547-560: `hasFeatureAccess()` function
- Already has: `aiFeatures` flag for each plan

**Example**:
```typescript
{
  id: "free",
  access: {
    aiFeatures: false,  // ← Blocks AI for free
    // ...
  }
},
{
  id: "pro",
  access: {
    aiFeatures: true,   // ← Allows AI for pro
    // ...
  }
}
```

**Status**: ✅ Ready to use

---

## Gemini AI Integration Details

### Where Gemini is Called

**File**: `server/routes.ts` (or separate utility)  
**Function**: `generateSummaryWithGemini()`  
**API Key**: `process.env.GEMINI_API_KEY`  

### What it Generates

Input:
```typescript
{
  contactInfo: { name, title, email, location },
  experiences: [{ title, company, duration }],
  skills: [string]
}
```

Output:
```typescript
{
  summary: "Professional with X years in Y, specializing in Z..."
}
```

### Rate Limits
- Gemini API has rate limits per project
- Need monitoring for "quota exceeded" errors
- Plan: Could add quota checking before gating

### Cost
- Gemini API: Pay per request
- With gating: Only Pro/Premium users use it
- Reduces API costs by ~80% (free users excluded)

---

## Home Page AI Section

### Current Structure

```tsx
AISection() {
  // Marketing banner with "Make your resume faster with AI"
  // Demo form showing:
  // - Input: Job Title, Experience
  // - Output: AI Generated Summary
  // No actual functionality - just demo
  // Badge: "AI-Powered" (marketing)
}
```

### What It Shows

```
┌─────────────────────────────────────┐
│ 🌟 AI-Powered (badge)               │
│                                     │
│ Make your resume faster with AI     │
│                                     │
│ Enter a few details about your      │
│ experience and we will generate     │
│ professional resume content...      │
│                                     │
│ [Demo Form]                         │
│ Job Title: ____________             │
│ Experience: ____________            │
│                                     │
│ [Generated AI Response - Demo]      │
│ "Results-driven professional..."   │
│                                     │
└─────────────────────────────────────┘
```

### Missing: Plan Information
Currently doesn't say "Pro only" or show pricing.

---

## Analytics Events (Missing)

### Events Needed for AI Tracking

```typescript
// Current: Doesn't track AI feature usage

// Needed:
pricingEvents.aiFeatureBlocked('summary', 'free')
  // When: Free user sees upgrade banner
  // Purpose: Count how many free users want AI
  // Goal: Identify high-value conversions

pricingEvents.aiFeatureAttempted('summary', 'pro')
  // When: Pro user clicks "Generate"
  // Purpose: Track feature adoption
  // Goal: See if users actually use AI

pricingEvents.aiFeatureUsed('summary', 'pro', 2450)
  // When: AI generation succeeds
  // Purpose: Track successful usage + performance
  // Goal: Monitor API performance, user satisfaction

pricingEvents.aiFeatureFailed('summary', 'pro', 'timeout')
  // When: Generation fails or times out
  // Purpose: Track errors
  // Goal: Monitor system health
```

---

## Integration Points for Gating

### Point 1: SummaryStep Component
**Current**: Shows AI button to everyone  
**Change**: Check plan before showing button  
**Code**: Add `useAIAccess()` hook

### Point 2: API Endpoint
**Current**: Accepts requests from anyone (with auth)  
**Change**: Add `requireFeature` middleware  
**Code**: `app.post("/api/generate-summary", ..., requireFeature('aiFeatures'), ...)`

### Point 3: Analytics
**Current**: Doesn't track AI usage  
**Change**: Add event calls in component  
**Code**: `pricingEvents.aiFeatureAttempted(...)`

### Point 4: Marketing
**Current**: Shows AI demo, doesn't mention plan  
**Change**: Add "Pro feature" label or pricing info  
**Code**: Update copy in `Home.tsx` AISection

---

## Plan for Other AI Features

### Future AI Features (Not Yet Built)

1. **Cover Letter Generator**
   - Feature: `coverLetters`
   - Plan: Premium only ($7/month)
   - Trigger: New step in builder or separate page
   - Implementation: Same pattern as summary

2. **LinkedIn Optimization**
   - Feature: `linkedinOptimization`
   - Plan: Premium only ($7/month)
   - Trigger: Button in skills or summary sections
   - Implementation: Same pattern

3. **ATS Score Check**
   - Feature: `aiFeatures` (shared with summary)
   - Plan: Pro+ ($2/month and up)
   - Trigger: Button in review/export step
   - Implementation: Same pattern

4. **Resume Review by AI**
   - Feature: `resumeReview`
   - Plan: Premium only ($7/month)
   - Trigger: Button on download page
   - Implementation: Same pattern

**Total Implementation Time**: ~2 hours per feature (copy-paste pattern)

---

## Current Flow (No Gating)

```
┌─────────────────────────────────────────────────────────┐
│                    Home Page                            │
│  "Make your resume faster with AI" (marketing)          │
│               [Build My Resume Now]                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Builder Page                         │
│  Step 2: Professional Summary                           │
│  [✨ Generate with AI] (available to everyone)          │
└─────────────────────────────────────────────────────────┘
                         ↓
              Free User: Works ✅
              Pro User: Works ✅
              (No difference)
```

---

## Future Flow (With Gating)

```
┌─────────────────────────────────────────────────────────┐
│                    Home Page                            │
│  "Make your resume faster with AI" (marketing)          │
│  "Available on Pro and Premium plans"                   │
│               [Build My Resume Now]                     │
└─────────────────────────────────────────────────────────┘
                         ↓
            Free User          Pro User
                 ↓                 ↓
        Sees/Uses builder   Sees/Uses builder
             (limited)          (full)
                 ↓                 ↓
        Summary Step        Summary Step
        [🔒 Pro Feature]    [✨ Generate] ✅
        [Upgrade Now] →     Works! Gets summary
                 ↓                 ↓
            /pricing             Saves time
             (convert)           (happier user)
```

---

## Implementation Roadmap

### Phase 1: Core AI Gating (This Week)
- [ ] Create `useAIAccess` hook
- [ ] Update SummaryStep component
- [ ] Add `requireFeature` to `/api/generate-summary`
- [ ] Add analytics tracking
- **Impact**: Free users can't use AI, Pro users can

### Phase 2: Marketing Updates (Next Week)
- [ ] Update Home page AISection
- [ ] Add pricing info to AI features
- [ ] Add "Upgrade to use AI" CTAs
- **Impact**: Clear messaging about AI tier

### Phase 3: Additional AI Features (Month 2)
- [ ] Cover Letter Generator (Premium)
- [ ] LinkedIn Optimization (Premium)
- [ ] ATS Score Check (Pro+)
- **Impact**: More upsell opportunities

### Phase 4: Premium Features (Month 3)
- [ ] Resume Review Service
- [ ] Custom AI prompts
- [ ] Bulk resume generation
- **Impact**: Premium-only differentiator

---

## Success Metrics to Track

### Engagement
- AI button clicks per day (free vs pro)
- AI feature adoption rate
- Avg time to generate summary

### Conversion
- Free users blocked by AI gate
- Free → Pro conversion rate from AI block
- Days from block to purchase

### Revenue
- MRR from Pro tier
- Revenue attribution from AI feature
- Customer LTV (Pro only)

### Quality
- Generated summary quality score
- Users keeping vs editing summaries
- Builder completion rate after AI use

---

## Security Considerations

### What to Watch For

1. **Token Hijacking**: Clerk token could be stolen
   - Mitigation: Backend always checks database tier
   - Never trust client-side tier only

2. **Database Sync**: User tier might be out of sync
   - Mitigation: Cache tier for 5 min, then refresh
   - Webhook updates tier immediately on purchase

3. **Race Condition**: User downgrades during API call
   - Mitigation: Check tier again in middleware
   - Return 403 if tier changed

4. **API Quota Abuse**: Attacker calls API with many tokens
   - Mitigation: Rate limit per user ID
   - Track API calls, alert on unusual activity

---

## Deployment Checklist

- [ ] All code reviewed and tested
- [ ] Analytics events fire correctly
- [ ] Free user → blocked successfully
- [ ] Pro user → works successfully
- [ ] Error messages clear and helpful
- [ ] Upgrade link goes to correct plan
- [ ] Clerk metadata synced correctly
- [ ] Database tier field populated
- [ ] Monitoring/alerts configured
- [ ] Rollback plan documented
- [ ] Team trained on new feature gating
- [ ] Announcement sent to users

---

## Conclusion

### Current State
- ✅ AI summary generation works (no gating)
- ✅ Pricing plans defined with AI feature
- ✅ Feature gate middleware exists
- ✅ Clerk integration ready
- ✅ Backend protected endpoints possible

### What's Missing
- ❌ Frontend plan check (`useAIAccess` hook)
- ❌ AI button gating in SummaryStep
- ❌ Backend gating on `/api/generate-summary`
- ❌ Analytics tracking for AI usage
- ❌ Marketing messaging about AI tier

### Next Step
→ Follow: **AI_FEATURE_GATING_IMPLEMENTATION.md**

**Estimated Time**: 2-3 hours for complete implementation
**Expected Result**: Free users can't use AI, Pro users can
**Revenue Impact**: 15-25% conversion rate of free users to Pro
