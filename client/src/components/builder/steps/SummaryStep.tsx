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
import { useAIAccess } from "@/hooks/useAIAccess";

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
  const { canUseAI, accountTier } = useAIAccess();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-summary", {
        contactInfo: resumeData.contactInfo,
        experiences: resumeData.experiences,
        skills: resumeData.skills,
      });
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
      // Handle 403 Forbidden (feature not available for plan)
      if (error?.status === 403) {
        toast({
          title: "Feature not available",
          description: "AI features are available on Pro plan and higher. Upgrade to use this feature.",
          variant: "destructive",
        });
        return;
      }
      // Generic error message for other errors
      toast({
        title: "Generation failed",
        description: "Could not generate summary. Please try again or write your own.",
        variant: "destructive",
      });
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
        <p className="text-gray-600 mt-1">
          Write a brief 2-3 sentence summary highlighting your key qualifications and career goals.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Your Summary</label>
          {!canUseAI && (
            <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800 border-yellow-200">
              <Lock className="w-3 h-3" />
              Pro Feature
            </Badge>
          )}
          {canUseAI && (
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

      {!canUseAI && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Upgrade to use AI features</h4>
              <p className="text-sm text-orange-800 mb-3">Generate professional summaries instantly with AI. Available on Pro plan ($2/month).</p>
              <a href="/pricing" className="text-sm font-medium text-orange-700 hover:text-orange-900 underline">
                View Pricing Plans →
              </a>
            </div>
          </div>
        </Card>
      )}

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
