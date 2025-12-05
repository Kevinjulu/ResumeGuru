# AI Feature Gating - Implementation Example

## Quick Implementation Steps

### 1. Create the useAIAccess Hook

**File**: `client/src/hooks/useAIAccess.ts` (NEW)

```typescript
import { useUser } from '@clerk/clerk-react';
import { hasFeatureAccess } from '@shared/schema';

type AIFeature = 'aiFeatures' | 'coverLetters' | 'resumeReview';

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

### 2. Update SummaryStep Component

**File**: `client/src/components/builder/steps/SummaryStep.tsx`

```tsx
import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ArrowLeft, ArrowRight, Lightbulb, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAIAccess } from "@/hooks/useAIAccess";  // NEW
import { pricingEvents } from "@/lib/analytics";    // NEW

interface SummaryStepProps {
  onNext: () => void;
  onBack: () => void;
}

const summaryExamples = [
  "Results-driven professional with 5+ years of experience in project management and team leadership. Proven track record of delivering projects on time and within budget while maintaining high quality standards.",
  "Dynamic and detail-oriented marketing specialist with expertise in digital campaigns, content creation, and data analytics. Passionate about driving brand awareness and customer engagement.",
  "Dedicated software engineer with strong problem-solving skills and experience in full-stack development. Committed to writing clean, efficient code and staying current with emerging technologies.",
];

export function SummaryStep({ onNext, onBack }: SummaryStepProps) {
  const { resumeData, updateSummary } = useResume();
  const [summary, setSummary] = useState(resumeData.summary || "");
  const { toast } = useToast();
  const { canUseFeature, userPlan } = useAIAccess();  // NEW

  const generateMutation = useMutation({
    mutationFn: async () => {
      const startTime = Date.now();
      pricingEvents.aiFeatureAttempted('summary_generation', userPlan);  // NEW
      
      const response = await apiRequest("POST", "/api/generate-summary", {
        contactInfo: resumeData.contactInfo,
        experiences: resumeData.experiences,
        skills: resumeData.skills,
      });
      
      const timeMs = Date.now() - startTime;
      pricingEvents.aiFeatureUsed('summary_generation', userPlan, timeMs);  // NEW
      return response.json();
    },
    onSuccess: (data) => {
      if (data.summary) {
        setSummary(data.summary);
        updateSummary(data.summary);
        toast({
          title: "Summary generated!",
          description: "Your AI-generated summary is ready. Feel free to edit it.",
        });
      }
    },
    onError: (error: any) => {
      // NEW: Check if it's a feature gating error
      if (error?.status === 403) {
        toast({
          title: "Upgrade Required",
          description: "AI features are available on the Pro plan and above.",
          variant: "destructive",
        });
        pricingEvents.aiFeatureBlocked('summary_generation', userPlan);  // NEW
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate summary. Please try again or write your own.",
          variant: "destructive",
        });
      }
    },
  });

  const handleChange = (value: string) => {
    setSummary(value);
    updateSummary(value);
  };

  const handleUseExample = (example: string) => {
    setSummary(example);
    updateSummary(example);
  };

  const handleSubmit = () => {
    updateSummary(summary);
    onNext();
  };

  // NEW: Check AI access
  const hasAIAccess = canUseFeature('aiFeatures');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
        <p className="text-gray-600 mt-1">
          Write a brief 2-3 sentence summary highlighting your key qualifications and career goals.
        </p>
      </div>

      <div className="space-y-4">
        {/* NEW: AI Feature Lock for Free Users */}
        {!hasAIAccess && (
          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">AI Summary Generator</h4>
                  <p className="text-sm text-amber-800">Available on Pro and Premium plans</p>
                </div>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="default">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Your Summary</label>
          
          {hasAIAccess ? (
            // Show AI button for Pro/Premium users
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="gap-2"
              data-testid="button-generate-summary"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </Button>
          ) : (
            // Show locked badge for Free users
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              <Lock className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          )}
        </div>

        <Textarea
          value={summary}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="A brief summary of your professional background, key skills, and career objectives..."
          className="min-h-[150px] resize-none"
          data-testid="textarea-summary"
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{summary.length} characters</span>
          <span>Recommended: 200-400 characters</span>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-100">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Tips for a great summary</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Lead with your years of experience and area of expertise</li>
              <li>Mention 2-3 key achievements or skills</li>
              <li>Align your summary with the job you're targeting</li>
              <li>Keep it concise - 2-4 sentences is ideal</li>
            </ul>
          </div>
        </div>
      </Card>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Need inspiration? Try one of these:</h4>
        <div className="space-y-2">
          {summaryExamples.map((example, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-gray-50 hover:border-primary/20 transition-colors"
              onClick={() => handleUseExample(example)}
              data-testid={`card-example-${index}`}
            >
              <p className="text-sm text-gray-600 line-clamp-2">{example}</p>
              <Badge variant="secondary" className="mt-2">Click to use</Badge>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-summary">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} className="gap-2" data-testid="button-next-summary">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
```

### 3. Update Backend Route

**File**: `server/routes.ts`

Add import at the top:
```typescript
import { requireFeature } from './middleware/featureGate.mts';
```

Find the `/api/generate-summary` route and update it:

```typescript
// BEFORE:
app.post("/api/generate-summary", requireClerk, async (req, res) => {
  // ... implementation
});

// AFTER:
app.post("/api/generate-summary", requireClerk, requireFeature('aiFeatures'), async (req, res) => {
  try {
    const { contactInfo, experiences, skills } = req.body;
    
    // Call Gemini API to generate summary
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
```

### 4. Update Analytics

**File**: `client/src/lib/analytics.ts`

Add these events:

```typescript
// Add to pricingEvents object
aiFeatureAttempted: (feature: string, userPlan: string) => 
  trackEvent({ 
    name: 'ai_feature_attempted', 
    properties: { feature, userPlan } 
  }),

aiFeatureBlocked: (feature: string, userPlan: string) => 
  trackEvent({ 
    name: 'ai_feature_blocked', 
    properties: { feature, userPlan } 
  }),

aiFeatureUsed: (feature: string, userPlan: string, timeMs: number) => 
  trackEvent({ 
    name: 'ai_feature_used', 
    properties: { feature, userPlan, timeMs } 
  }),
```

---

## Testing the Implementation

### Test 1: Free User Tries AI

1. Sign up as new user (automatic free tier)
2. Go to builder
3. Reach Summary step
4. Verify:
   - ✅ AI button shows "Pro Feature" badge
   - ✅ Button is disabled/not clickable
   - ✅ Upgrade notice shows
   - ✅ Click "Upgrade Now" → goes to /pricing

### Test 2: Pro User Uses AI

1. Upgrade to Pro plan
2. Go back to builder
3. Reach Summary step
4. Verify:
   - ✅ AI button shows "Generate with AI"
   - ✅ Button is clickable
   - ✅ Loading state appears while generating
   - ✅ Summary appears after generation

### Test 3: Backend Gating

```bash
# Get a free user's Clerk token
TOKEN="free_user_clerk_token"

# Try to hit AI endpoint
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contactInfo": {"name": "John"},
    "experiences": [{"title": "Dev"}],
    "skills": ["JavaScript"]
  }'

# Should return 403 Forbidden
# {"error": "Feature not available for your plan", "feature": "aiFeatures"}
```

---

## Rollout Checklist

- [ ] Create `useAIAccess` hook
- [ ] Update `SummaryStep.tsx`
- [ ] Update `/api/generate-summary` with feature gate
- [ ] Add analytics events
- [ ] Test free user flow
- [ ] Test pro user flow
- [ ] Test backend gating with cURL
- [ ] Deploy to production
- [ ] Monitor analytics for "ai_feature_blocked" events
- [ ] Measure conversion: free → pro

---

## Common Issues & Solutions

**Issue**: "Cannot find module `useAIAccess`"  
**Solution**: Ensure hook file is created at `client/src/hooks/useAIAccess.ts`

**Issue**: User has "pro" plan but still can't use AI  
**Solution**: Check that user's Clerk metadata has `accountTier: "pro"` set (not "Pro" with capital P)

**Issue**: Button shows but doesn't call API  
**Solution**: Verify `apiRequest` function exists and `/api/generate-summary` route is registered

**Issue**: 403 error when pro user tries to use AI  
**Solution**: Check that `requireFeature` middleware is imported and `featureGate.mts` uses correct plan checks

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SummaryStep Component                                  │
│  └─ useAIAccess() hook                                  │
│     └─ hasFeatureAccess(plan, 'aiFeatures')             │
│        └─ Returns: true (Pro/Premium) | false (Free)   │
│                                                         │
│  Show/Hide AI Button based on plan                      │
│  └─ Free: Show upgrade badge                           │
│  └─ Pro+: Show generate button                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
                   (API Request)
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend (Express)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  POST /api/generate-summary                            │
│  └─ requireClerk middleware                            │
│     └─ Gets Clerk user token                           │
│  └─ requireFeature('aiFeatures') middleware            │
│     └─ Validates: user.accountTier has aiFeatures: true│
│        └─ Free: 403 Forbidden                          │
│        └─ Pro+: Continue to handler                    │
│  └─ generateSummaryWithGemini(data)                    │
│     └─ Calls Google Gemini API                         │
│     └─ Returns summary text                            │
│                                                         │
│  Response: { summary: "AI Generated text..." }         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Next: Other AI Features to Gate

Apply the same pattern to:

1. **Cover Letter AI**
   - Feature: `coverLetters`
   - Endpoint: `/api/generate-cover-letter`
   - Available in: Premium only

2. **ATS Optimization**
   - Feature: `aiFeatures`
   - Endpoint: `/api/optimize-ats`
   - Available in: Pro+

3. **LinkedIn Optimization**
   - Feature: `linkedinOptimization`
   - Endpoint: `/api/optimize-linkedin`
   - Available in: Premium only

4. **Resume Review AI**
   - Feature: `resumeReview`
   - Endpoint: `/api/review-resume`
   - Available in: Premium only

All follow the same 4-step pattern shown above.
