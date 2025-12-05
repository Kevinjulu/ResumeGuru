# 🎯 AI Feature Gating - Visual Implementation Checklist

## 📌 Print This Page & Track Your Progress

---

## Phase 1️⃣: Setup (30 minutes)

### Understanding Phase
```
□ Read: AI_FEATURE_GATING_QUICK_REFERENCE.md
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Time: 5 minutes
  
□ Read: AI_CURRENT_STATE_ANALYSIS.md
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Time: 10 minutes

□ Set up test accounts
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Steps:
    □ Create Free test user
    □ Create Pro test user
    □ Create Premium test user
    □ Note account IDs for testing
```

---

## Phase 2️⃣: Frontend Implementation (1 hour)

### Step 1: Create the useAIAccess Hook
```
File: client/src/hooks/useAIAccess.ts

□ Create new file
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  
□ Copy code from: AI_FEATURE_GATING_IMPLEMENTATION.md (Section 1)
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  
□ Verify imports:
  □ useUser from @clerk/clerk-react
  □ hasFeatureAccess from @shared/schema
  
□ Test in browser console:
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Command: const { canUseFeature } = useAIAccess(); canUseFeature('aiFeatures')
  Expected: true for Pro/Premium, false for Free
```

### Step 2: Update SummaryStep Component
```
File: client/src/components/builder/steps/SummaryStep.tsx

□ Add imports at top
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Imports:
    □ Lock from lucide-react
    □ useAIAccess from @/hooks/useAIAccess
    □ pricingEvents from @/lib/analytics

□ Add hook to component
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Code: const { canUseFeature, userPlan } = useAIAccess();
  
□ Add hasAIAccess state
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Code: const hasAIAccess = canUseFeature('aiFeatures');
  
□ Update generate mutation error handler
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Add: Check for 403 error, show upgrade message
  
□ Replace "Generate with AI" button logic
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Show: Button if hasAIAccess = true
  Show: Badge if hasAIAccess = false
  
□ Add upgrade banner for free users
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Section: Show warning card if !hasAIAccess
  
□ Test locally
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Test with:
    □ Free user: should see badge + upgrade banner
    □ Pro user: should see generate button
```

---

## Phase 3️⃣: Backend Implementation (45 minutes)

### Step 1: Update API Route
```
File: server/routes.ts

□ Find route: POST /api/generate-summary
  Line: ___________
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  
□ Add requireFeature import
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Code: import { requireFeature } from './middleware/featureGate.mts';
  
□ Update route signature
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Before: app.post("/api/generate-summary", requireClerk, async (req, res) => {
  After: app.post("/api/generate-summary", requireClerk, requireFeature('aiFeatures'), async (req, res) => {
  
□ Verify middleware chain
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Order:
    1. requireClerk (authentication)
    2. requireFeature('aiFeatures') (authorization)
    3. Handler (business logic)

□ Test with cURL
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Command (Free user):
    curl -X POST http://localhost:5000/api/generate-summary \
      -H "Authorization: Bearer FREE_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{...}'
  Expected: 403 Forbidden
  
  Command (Pro user):
    curl -X POST http://localhost:5000/api/generate-summary \
      -H "Authorization: Bearer PRO_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{...}'
  Expected: 200 OK with summary
```

---

## Phase 4️⃣: Analytics Implementation (30 minutes)

### Step 1: Add Analytics Events
```
File: client/src/lib/analytics.ts

□ Find: pricingEvents object
  Line: ___________
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ Add event: aiFeatureBlocked
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Code:
    aiFeatureBlocked: (feature: string, userPlan: string) =>
      trackEvent({ name: 'ai_feature_blocked', properties: { feature, userPlan } }),

□ Add event: aiFeatureAttempted
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ Add event: aiFeatureUsed
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ Update SummaryStep to track events
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Locations:
    □ Line ~30: Track "aiFeatureAttempted" at mutation start
    □ Line ~50: Track "aiFeatureUsed" on success
    □ Line ~55: Track "aiFeatureBlocked" on 403 error

□ Test analytics
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Steps:
    □ Free user clicks: Check for "ai_feature_blocked" event
    □ Pro user clicks: Check for "ai_feature_attempted" event
    □ Generation succeeds: Check for "ai_feature_used" event
```

---

## Phase 5️⃣: Testing (2 hours)

### Test 1: Free User Flow
```
Setup:
□ Log in with Free test account
□ Navigate to /builder
□ Reach Summary step

Tests:
□ AI button shows "Pro Feature" badge
  Expected: Badge visible, button disabled
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Upgrade banner shows
  Expected: Orange banner with upgrade CTA
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Click upgrade → goes to /pricing
  Expected: Redirected to pricing page
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Analytics event fires
  Expected: "ai_feature_blocked" in console
  Result: ⏳ Pending  ✅ Pass  ❌ Fail
```

### Test 2: Pro User Flow
```
Setup:
□ Log in with Pro test account
□ Navigate to /builder
□ Reach Summary step

Tests:
□ AI button shows "Generate with AI"
  Expected: Blue button, clickable
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Click generates summary
  Expected: Loading animation, then summary appears
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Summary appears in textarea
  Expected: Professional 2-3 sentence summary
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Analytics events fire
  Expected: "ai_feature_attempted" then "ai_feature_used" in console
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Can generate multiple times
  Expected: Button still works after first generation
  Result: ⏳ Pending  ✅ Pass  ❌ Fail
```

### Test 3: Premium User Flow
```
Setup:
□ Log in with Premium test account
□ Navigate to /builder
□ Reach Summary step

Tests:
□ Same as Pro user
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
```

### Test 4: Backend Gating
```
Setup:
□ Have Free and Pro user tokens ready

Tests:
□ Free user API call returns 403
  Command: curl -X POST ... -H "Authorization: Bearer FREE_TOKEN"
  Expected: {"error": "Feature not available for your plan", "feature": "aiFeatures"}
  Result: ⏳ Pending  ✅ Pass  ❌ Fail

□ Pro user API call returns 200
  Command: curl -X POST ... -H "Authorization: Bearer PRO_TOKEN"
  Expected: {"summary": "..."}
  Result: ⏳ Pending  ✅ Pass  ❌ Fail
```

### Test 5: Error Handling
```
□ Network error shows error toast
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ Invalid response shows error toast
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ 403 error shows upgrade message
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete

□ User can retry after error
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
```

---

## Phase 6️⃣: Deployment (1 hour)

### Pre-Deployment
```
□ Code review completed
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Reviewer: _________________
  Comments: _________________________________
  
□ All tests pass (green check marks above)
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  
□ Merge to staging branch
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Branch: ___________
  Commit: ___________
```

### Staging Deployment
```
□ Deploy to staging environment
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Time deployed: ___________
  
□ Test staging build (all 5 test suites)
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  
□ Check staging logs for errors
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Errors found: ___________
  Resolution: ___________
  
□ Share staging link with team
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  URL: https://staging.resumeguru.com/builder
```

### Production Deployment
```
□ Get approval to deploy
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Approved by: _________________
  
□ Create rollback plan
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Plan: _________________________________
  
□ Deploy to production
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Time deployed: ___________
  Deployed by: _________________
  
□ Monitor logs for 1 hour
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Errors: none  /  found: ___________
  
□ Check analytics dashboard
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Free users blocked: _____ (expected: 20-50/day)
  Pro users using AI: _____ (expected: 10-30/day)
  
□ Post announcement to team
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
```

---

## 🎉 Success Indicators

### All Tests Passing
```
✅ Free user sees upgrade
✅ Pro user can generate
✅ Backend gates correctly
✅ Analytics track events
✅ No console errors
✅ No crashes in QA
```

### Metrics to Monitor (First Week)
```
□ Free users attempting AI: 20-50/day
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Actual: _____/day
  
□ Conversion rate: 15-25%
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Actual: _____%
  
□ Pro users using AI: 10-30/day
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Actual: _____/day
  
□ Average generation time: 2-3 seconds
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Actual: _____ms
  
□ Error rate: < 2%
  Status: ⏳ Not Started  ⏳ In Progress  ✅ Complete
  Actual: _____%
```

---

## 📞 Troubleshooting Quick Links

### Issue: Button doesn't show upgrade for free users
```
⚠️ Check:
□ useAIAccess hook imported correctly
□ Hook returns canUseFeature correctly
□ Clerk metadata has accountTier field
□ Test user's accountTier is "free"
Solution: See DEBUG SECTION in QUICK_REFERENCE.md
```

### Issue: Pro user still sees upgrade badge
```
⚠️ Check:
□ User reloaded (Clerk cache)
□ Clerk metadata updated to "pro"
□ Component using fresh accountTier
□ useAIAccess hook rerun
Solution: Clear browser cache, reload page
```

### Issue: Backend returns 403 for Pro user
```
⚠️ Check:
□ User token includes "pro" tier
□ requireFeature middleware installed
□ featureGate.mts exists and imported
□ API route has middleware in correct order
Solution: Verify server logs show user tier
```

### Issue: Analytics not tracking
```
⚠️ Check:
□ pricingEvents calls added to component
□ Analytics service is initialized
□ Events fire in browser console
□ Network requests show analytics calls
Solution: Check Network tab in DevTools
```

---

## 📊 Progress Summary

```
Total Phases: 6
Total Time: 8-10 hours
Total Files Modified: 3
Total Files Created: 1

Phase 1: Setup ............................ ⏳ 30 min
Phase 2: Frontend Implementation .......... ⏳ 1 hr
Phase 3: Backend Implementation .......... ⏳ 45 min
Phase 4: Analytics Implementation ........ ⏳ 30 min
Phase 5: Testing ......................... ⏳ 2 hrs
Phase 6: Deployment ...................... ⏳ 1 hr

Overall Progress: ⏳ 0%    🟡 25%    🟡 50%    🟡 75%    ✅ 100%
```

---

## 💾 Save This Progress

Print this page and:
- [ ] Tape to desk
- [ ] Share with team
- [ ] Update status as you complete phases
- [ ] Mark dates completed
- [ ] Take screenshot when done

---

## 🚀 Ready?

**Today:**
- [ ] Read QUICK_REFERENCE.md
- [ ] Create test accounts

**Tomorrow:**
- [ ] Implement Frontend + Backend
- [ ] Run all tests

**Next Day:**
- [ ] Deploy to production
- [ ] Monitor metrics

**Expected Result:**
- ✅ Free users can't use AI
- ✅ Pro users can use AI
- ✅ 15-25% convert to Pro
- ✅ Revenue increases

---

**Started**: ___________  
**Completed**: ___________  
**Deployed by**: _________________  
**Result**: ⏳ Pending  🟡 In Progress  ✅ Success  

---

*Print this page, complete the checklist, and track your progress!*
