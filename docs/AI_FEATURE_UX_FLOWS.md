# AI Feature Gating - User Experience Flows

## Visual Comparison: What Each User Sees

### FREE USER Experience

#### Summary Step (Free User)

```
┌─────────────────────────────────────────────────────────┐
│  ↶ BACK                                                 │
│                                                         │
│  Professional Summary                                   │
│  Write a brief 2-3 sentence summary highlighting your  │
│  key qualifications and career goals.                  │
│                                                         │
│  ┌─────────────────────────────────────────────────── │
│  │ ⚠️  AI Summary Generator                           │
│  │ Available on Pro and Premium plans                  │
│  │                          [UPGRADE NOW] →           │
│  └─────────────────────────────────────────────────── │
│                                                         │
│  Your Summary        [🔒 Pro Feature]                  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐│
│  │                                                   ││
│  │ A brief summary of your professional background,││
│  │ key skills, and career objectives...             ││
│  │                                                   ││
│  │                                                   ││
│  │ (0 characters / Recommended: 200-400 characters) ││
│  └───────────────────────────────────────────────────┘│
│                                                         │
│  💡 Tips for a great summary                           │
│  • Lead with your years of experience...              │
│  • Mention 2-3 key achievements...                    │
│  • Align with the job you're targeting...             │
│  • Keep it concise - 2-4 sentences ideal              │
│                                                         │
│  Need inspiration? Try one of these:                   │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Results-driven professional with 5+ years of...  │ │
│  │ [Click to use]                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  [BACK]                             [SAVE & CONTINUE] │
└─────────────────────────────────────────────────────────┘
```

**Behavior When Free User Tries to Generate**:
1. Clicks upgrade banner → goes to pricing page
2. Or scrolls down to see manual examples to use

---

### PRO USER Experience

#### Summary Step (Pro User)

```
┌─────────────────────────────────────────────────────────┐
│  ↶ BACK                                                 │
│                                                         │
│  Professional Summary                                   │
│  Write a brief 2-3 sentence summary highlighting your  │
│  key qualifications and career goals.                  │
│                                                         │
│  Your Summary        [✨ Generate with AI]              │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │ A brief summary of your professional background,│ │
│  │ key skills, and career objectives...             │ │
│  │                                                   │ │
│  │                                                   │ │
│  │ (0 characters / Recommended: 200-400 characters) │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  💡 Tips for a great summary                           │
│  • Lead with your years of experience...              │
│  • Mention 2-3 key achievements...                    │
│  • Align with the job you're targeting...             │
│  • Keep it concise - 2-4 sentences ideal              │
│                                                         │
│  Need inspiration? Try one of these:                   │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Results-driven professional with 5+ years of...  │ │
│  │ [Click to use]                                    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
│  [BACK]                             [SAVE & CONTINUE] │
└─────────────────────────────────────────────────────────┘
```

#### When Pro User Clicks "Generate with AI"

```
Loading State:
┌───────────────────────────────────────────────────────┐
│  Your Summary        [⏳ Generating...]                 │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │ [Loading animation...]                          │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘

After Generation:
┌───────────────────────────────────────────────────────┐
│  Your Summary        [✨ Generate with AI]              │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Results-driven software engineer with 5+ years │ │
│  │ of experience in full-stack development and    │ │
│  │ cloud architecture. Proven track record of...  │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ✅ Summary generated! Feel free to edit it.          │
│     (239 characters / Recommended: 200-400)          │
└───────────────────────────────────────────────────────┘
```

---

### PREMIUM USER Experience

Same as Pro User, but with additional features:

```
Additional in Builder:

┌─────────────────────────────────────────────────────────┐
│  📝 COVER LETTER BUILDER                                │
│  [✨ Generate with AI]  ← Available for Premium only   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🎯 LINKEDIN OPTIMIZATION                               │
│  [✨ Optimize Profile]  ← Available for Premium only   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📊 ATS SCORE CHECK                                     │
│  [✨ Check ATS Compatibility]  ← All Pro+ see this    │
└─────────────────────────────────────────────────────────┘
```

---

## Payment Flow: Free → Pro Conversion

### User Attempts AI as Free Member

```
Step 1: Free user in builder
                    │
                    ↓
        Clicks "Upgrade Now" button
                    │
                    ↓
        Redirected to /pricing
                    │
                    ↓
      ┌─────────────────────────────┐
      │   PRICING PAGE              │
      │                             │
      │  ☐ Free                     │
      │  ☑ Pro ($2/month)           │
      │      ✓ Unlimited Resumes    │
      │      ✓ AI Features          │
      │      ✓ PDF/Word Export      │
      │    [SELECT PLAN]            │
      │                             │
      │  ☐ Premium ($7/month)       │
      │      ✓ Everything           │
      │      ✓ Cover Letters        │
      │      ✓ Priority Support     │
      │    [SELECT PLAN]            │
      └─────────────────────────────┘
                    │
                    ↓
        User selects Pro plan
                    │
                    ↓
      ┌─────────────────────────────┐
      │  PAYPAL CHECKOUT            │
      │                             │
      │  Pro Plan - $2/month        │
      │  [Continue to PayPal] →     │
      └─────────────────────────────┘
                    │
                    ↓
        Payment successful
                    │
                    ↓
      User redirected back to app
      (accountTier changed to "pro")
                    │
                    ↓
        Navigate back to builder
                    │
                    ↓
      ✅ AI button now active!
```

---

## Analytics: What Gets Tracked

### Conversion Funnel

```
Users in Builder: 1000
        ↓
Try to use AI (free user): 150
        ├─ Sees upgrade banner
        │
Clicks "Upgrade Now": 45 (30% CTR)
        ├─ Redirected to /pricing
        │
Views Pricing Page: 45
        │
Selects Plan: 18 (40% conversion)
        │
Completes Payment: 15 (83% checkout completion)
        │
Returns to Builder as Pro: 15
        │
Uses AI successfully: 12 (80% feature adoption)
```

### Events Logged

```javascript
// When free user tries AI
{
  event: "ai_feature_blocked",
  property: {
    feature: "summary_generation",
    userPlan: "free",
    timestamp: "2025-12-04T10:30:00Z"
  }
}

// When pro user generates summary (success)
{
  event: "ai_feature_used",
  properties: {
    feature: "summary_generation",
    userPlan: "pro",
    timeMs: 2450,  // How long it took
    timestamp: "2025-12-04T10:30:00Z"
  }
}

// When pro user generates summary (failure)
{
  event: "ai_feature_failed",
  properties: {
    feature: "summary_generation",
    userPlan: "pro",
    error: "API rate limit exceeded",
    timestamp: "2025-12-04T10:30:00Z"
  }
}
```

---

## API Response Examples

### Free User Tries AI (403 Forbidden)

**Request**:
```bash
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d {
    "contactInfo": {"name": "John Doe"},
    "experiences": [{"title": "Developer"}],
    "skills": ["JavaScript", "React"]
  }
```

**Response** (403):
```json
{
  "error": "Feature not available for your plan",
  "feature": "aiFeatures",
  "status": 403
}
```

**In Frontend**:
```
❌ Upgrade Required
AI features are available on the Pro plan and above.
```

---

### Pro User Uses AI (200 Success)

**Request**: Same as above

**Response** (200):
```json
{
  "summary": "Results-driven software engineer with 5+ years of experience in full-stack development and cloud architecture. Proven track record of delivering scalable applications and mentoring junior developers. Passionate about clean code and modern technologies."
}
```

**In Frontend**:
```
✅ Summary generated!
Your AI-generated summary is ready. Feel free to edit it.
```

---

### Unauthenticated User (401 Unauthorized)

**Response** (401):
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

**In Frontend**:
```
Please sign in to use AI features.
```

---

## Email Notifications

### When User Upgrades to Pro

```
Subject: 🎉 Welcome to ResumeGuru Pro!

Hi [Name],

You've successfully upgraded to ResumeGuru Pro! 🚀

Here's what you now have access to:

✓ AI-Powered Summary Generation
  Get professionally written summaries in seconds

✓ Unlimited Resumes & All 10+ Templates
  Build as many as you need with any template

✓ PDF & Word Export
  Download your resume in any format

✓ No Watermarks
  Clean, professional downloads

✓ Keyword Optimization
  Improve your resume for ATS systems

Start building your perfect resume:
[Button: Go to Builder]

Questions? Reply to this email or visit our help center.

Cheers,
The ResumeGuru Team
```

### When Free User's First AI Attempt is Blocked

```
Subject: Ready to unlock AI-powered resumes? ✨

Hi [Name],

You tried to use our AI resume generator, and we'd love to help!

With ResumeGuru Pro, you can:

✓ Generate professional summaries in seconds
✓ Get smart content suggestions
✓ Optimize for ATS systems
✓ Export to PDF or Word

Best part? Just $2/month

Try it free for 7 days:
[Button: Upgrade to Pro]

Your resume, powered by AI.

The ResumeGuru Team
```

---

## State Management in Component

```tsx
// State flow in SummaryStep

Initial State:
{
  summary: "",
  userPlan: "free",
  hasAIAccess: false,
  generateMutation: { isPending: false }
}

User clicks "Upgrade Now":
{
  summary: "",
  userPlan: "free",
  hasAIAccess: false,
  → Redirect to /pricing
}

User upgrades to Pro, returns:
{
  summary: "",
  userPlan: "pro",
  hasAIAccess: true,
  generateMutation: { isPending: false }
}

User clicks "Generate with AI":
{
  summary: "",
  userPlan: "pro",
  hasAIAccess: true,
  generateMutation: { isPending: true }
}

Generation succeeds:
{
  summary: "Results-driven...",
  userPlan: "pro",
  hasAIAccess: true,
  generateMutation: { isPending: false }
}
```

---

## Copy for Different Scenarios

### Feature Locked (Free User)

```
🔒 AI Summary Generator
This feature is available on Pro and Premium plans.

Why upgrade?
• Generate professional summaries in seconds
• Save hours of writing time
• Get AI-optimized content
• Works with your existing experience

Pro Plan: $2/month
Premium Plan: $7/month (includes cover letters + more)

[UPGRADE NOW]  or  [USE TEMPLATE INSTEAD]
```

### Feature Generating (Pro User)

```
⏳ Generating your summary with AI...

This may take a few moments while we create
a professional summary based on your
experience and skills.
```

### Feature Ready (Pro User)

```
✅ Summary generated!
Your AI-generated summary is ready.
Feel free to edit it to make it more personal.

Don't like it? [GENERATE ANOTHER]
```

### Upsell Message on Home Page

```
✨ AI-Powered Resume Generator

Let our AI do the heavy lifting. Instead of starting
from a blank page, tell us about your experience
and let AI generate a professional summary.

Available on Pro and Premium plans.

[BUILD WITH AI]  [VIEW PRICING]
```

---

## Testing Scenarios

### Scenario 1: Free User Full Flow

```
1. Sign up as new user (automatic free tier)
   ✓ Verify Clerk metadata has accountTier: "free"

2. Navigate to /builder
   ✓ Can access builder

3. Reach Summary step
   ✓ AI button disabled
   ✓ Shows "Pro Feature" badge
   ✓ Shows upgrade banner

4. Click upgrade banner
   ✓ Redirected to /pricing
   ✓ Analytics logged: "ai_feature_blocked"

5. Purchase Pro plan
   ✓ Clerk metadata updated to accountTier: "pro"
   ✓ Navigate back to builder

6. At Summary step again
   ✓ AI button enabled
   ✓ Can click "Generate with AI"
   ✓ Analytics logged: "ai_feature_attempted"
   ✓ Summary generated successfully
   ✓ Analytics logged: "ai_feature_used"
```

### Scenario 2: Pro User Uses AI Multiple Times

```
1. Sign in as Pro user
2. Go to Summary step
3. Click "Generate with AI" 3 times
   ✓ Each generates different summary
   ✓ 3 events logged: "ai_feature_used"
4. Edit manually
   ✓ Still can regenerate
5. Save & continue to next step
```

### Scenario 3: Network Error Handling

```
1. Pro user tries to generate summary
2. Network fails (simulate with DevTools)
   ✓ Loading state shows for 5 seconds
   ✓ Then shows error toast
   ✓ Button becomes enabled again
   ✓ User can retry

Error toast:
"Generation failed - Could not generate summary.
 Please try again or write your own."
```

---

## Metrics Dashboard

```
AI Feature Usage:

Daily:
├─ Feature Attempts (all users): 450
├─ Feature Blocked (free users): 180 (40%)
├─ Feature Used (pro/premium): 270 (60%)
│  ├─ Pro users: 210 (70%)
│  └─ Premium users: 60 (30%)
├─ Feature Errors: 12 (2%)
└─ Avg Generation Time: 2.3s

Conversion:
├─ Free users blocked: 180/day
├─ Click "Upgrade Now": 54 (30% CTR)
├─ Complete purchase: 15 (28%)
├─ Return to builder: 14 (93%)
└─ Use AI after upgrade: 12 (86%)

Revenue Impact:
├─ Users from AI blocking: 420/month
├─ Conversion rate: 12%
├─ MRR from AI feature: $360/month
└─ LTV: $150 (15 months avg)
```

---

## Summary

Free users see:
- ❌ AI button disabled
- 📌 Upgrade banner
- 🔒 "Pro Feature" badge
- 🔗 Link to pricing

Pro users see:
- ✅ AI button enabled
- ⚡ "Generate with AI" functionality
- 📊 Success notifications
- 🔄 Ability to regenerate

Premium users see:
- ✅ All of Pro features
- ➕ Additional AI features (cover letters, LinkedIn optimization)
- 🎯 Advanced analytics
- 👑 Priority support
