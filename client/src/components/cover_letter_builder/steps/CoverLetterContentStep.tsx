import { useState, useEffect } from "react";
import { useCoverLetter } from "@/lib/coverLetterContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CoverLetterContentStepProps {
  onNext: () => void;
  onBack?: () => void; // Optional, as it's the first step
}

export function CoverLetterContentStep({ onNext, onBack }: CoverLetterContentStepProps) {
  const { coverLetterData, updateBody, updateSubject, updateDate } = useCoverLetter();
  const [subject, setSubject] = useState(coverLetterData.subject || "");
  const [body, setBody] = useState(coverLetterData.body || "");
  const [date, setDate] = useState(coverLetterData.date || new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const generateBodyMutation = useMutation({
    mutationFn: async () => {
      // Assuming a similar AI endpoint that can generate cover letter body
      const response = await apiRequest("POST", "/api/ai-suggestions", { // Reusing AI endpoint
        type: "cover_letter_body",
        senderInfo: coverLetterData.senderInfo,
        recipientInfo: coverLetterData.recipientInfo,
        subject: subject,
        // Potentially include attached resume data for context
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.suggestions && data.suggestions.length > 0) {
        setBody(data.suggestions[0]);
        updateBody(data.suggestions[0]);
        toast({
          title: "Cover letter body generated!",
          description: "Your AI-generated content is ready. Feel free to edit it.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate cover letter body.",
        variant: "destructive",
      });
    },
  });

  const handleChangeBody = (value: string) => {
    setBody(value);
    updateBody(value);
  };

  const handleChangeSubject = (value: string) => {
    setSubject(value);
    updateSubject(value);
  };

  const handleChangeDate = (value: string) => {
    setDate(value);
    updateDate(value);
  };

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cover Letter Content</h2>
        <p className="text-gray-600 mt-1">
          Craft the main message of your cover letter.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => handleChangeDate(e.target.value)}
          data-testid="input-cover-letter-date"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Subject Line</label>
        <Input
          value={subject}
          onChange={(e) => handleChangeSubject(e.target.value)}
          placeholder="e.g., Application for Software Engineer Position"
          data-testid="input-cover-letter-subject"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Cover Letter Body</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => generateBodyMutation.mutate()}
            disabled={generateBodyMutation.isPending || !coverLetterData.senderInfo?.firstName || !coverLetterData.recipientInfo?.name}
            className="gap-2"
            data-testid="button-generate-cover-letter-body"
          >
            {generateBodyMutation.isPending ? (
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
        </div>

        <Textarea
          value={body}
          onChange={(e) => handleChangeBody(e.target.value)}
          placeholder="Dear [Recipient Name], ..."
          className="min-h-[300px] resize-none"
          data-testid="textarea-cover-letter-body"
        />
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-cl-content">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <Button type="button" onClick={handleSubmit} className="gap-2 ml-auto" data-testid="button-next-cl-content">
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
