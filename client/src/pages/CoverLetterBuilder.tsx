import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter"; // Import useLocation
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import { FullPageLoader } from "@/components/common/Loader";
import {
  User,
  FileText,
  Palette,
  Download,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Save,
  Mail, // For recipient info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CoverLetterProvider, useCoverLetter } from "@/lib/coverLetterContext"; // New context
import { coverLetterTemplates, templateColors } from "@shared/schema"; // Import cover letter templates
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient
import { apiRequest } from "@/lib/queryClient"; // Import apiRequest
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Import Cover Letter specific steps
import { CoverLetterContentStep } from "@/components/cover_letter_builder/steps/CoverLetterContentStep";
import { RecipientInfoStep } from "@/components/cover_letter_builder/steps/RecipientInfoStep";
import { SenderInfoStep } from "@/components/cover_letter_builder/steps/SenderInfoStep";
import { CoverLetterTemplateStep } from "@/components/cover_letter_builder/steps/CoverLetterTemplateStep";
import { CoverLetterDownloadStep } from "@/components/cover_letter_builder/steps/CoverLetterDownloadStep";
import { CoverLetterPreview } from "@/components/cover_letter_builder/CoverLetterPreview"; // New preview

const steps = [
  { id: "content", label: "Content", icon: FileText },
  { id: "recipient", label: "Recipient", icon: Mail },
  { id: "sender", label: "Sender", icon: User },
  { id: "template", label: "Template", icon: Palette },
  { id: "download", label: "Download", icon: Download },
];

function CoverLetterBuilderContent() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialTemplate = params.get("template");
  const initialColor = params.get("color");
  const coverLetterId = params.get("coverLetterId"); // For loading existing cover letters

  const { coverLetterData, setCoverLetterData, setTemplate, setColor } = useCoverLetter();
  const [currentStep, setCurrentStep] = useState(0); // Start at Content step
  const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(!!coverLetterId); // Track loading
  const [showPreview, setShowPreview] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation(); // To update URL after saving new CL

  // Handle initial template/color or load existing cover letter
  useEffect(() => {
    if (coverLetterId) {
      const fetchCoverLetter = async () => {
        try {
          setIsCoverLetterLoading(true);
          const fetchedCoverLetter = await apiRequest('GET', `/api/coverletters/${coverLetterId}`);
          setCoverLetterData(fetchedCoverLetter.data); // Set the entire data object
          setTemplate(fetchedCoverLetter.templateId);
          setColor(fetchedCoverLetter.colorId);
          setCurrentStep(0); // Go to content step after loading
        } catch (error) {
          console.error("Error loading cover letter:", error);
          toast({
            title: "Error loading cover letter",
            description: "Could not load the selected cover letter. Please try again.",
            variant: "destructive",
          });
          setCurrentStep(0); // Fallback to content step
        } finally {
          setIsCoverLetterLoading(false);
        }
      };
      fetchCoverLetter();
    } else {
      // Set initial template and color if provided via URL
      if (initialTemplate) {
        setTemplate(initialTemplate);
      }
      if (initialColor) {
        setColor(initialColor);
      }
    }
  }, [coverLetterId, initialTemplate, initialColor, setCoverLetterData, setTemplate, setColor, toast]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index <= currentStep) {
      setCurrentStep(index);
    }
  };

  // Mutation for saving/updating cover letter
  const saveCoverLetterMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: coverLetterData.recipientInfo?.company ? `${coverLetterData.recipientInfo.company} Cover Letter` : 'Untitled Cover Letter',
        data: coverLetterData,
        templateId: coverLetterData.templateId,
        colorId: coverLetterData.colorId,
      };
      if (coverLetterId) {
        // Update existing cover letter
        return apiRequest('PATCH', `/api/coverletters/${coverLetterId}`, payload);
      } else {
        // Create new cover letter
        return apiRequest('POST', '/api/coverletters', payload);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myCoverLetters'] }); // Invalidate cover letter list
      toast({
        title: "Cover Letter saved!",
        description: coverLetterId ? "Your cover letter has been updated." : "Your cover letter has been saved.",
      });
      // If new cover letter, update URL to reflect its ID
      if (!coverLetterId && data?.id) {
        navigate(`/cover-letter-builder?coverLetterId=${data.id}`, { replace: true });
      }
    },
    onError: (error: any) => {
      console.error("Error saving cover letter:", error);
      toast({
        title: "Error saving cover letter",
        description: error.message || "Failed to save your cover letter. Please try again.",
        variant: "destructive",
      });
    },
  });


  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "content":
        return <CoverLetterContentStep onNext={goToNext} />;
      case "recipient":
        return <RecipientInfoStep onNext={goToNext} onBack={goBack} />;
      case "sender":
        return <SenderInfoStep onNext={goToNext} onBack={goBack} />;
      case "template":
        return <CoverLetterTemplateStep onNext={goToNext} onBack={goBack} />;
      case "download":
        return <CoverLetterDownloadStep onBack={goBack} />;
      default:
        return null;
    }
  };

  if (isCoverLetterLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <FullPageLoader text="Loading Cover Letter..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <Link href="/">
              <span className="text-xl font-bold text-gray-900 hidden sm:inline cursor-pointer">
                resume<span className="text-primary">guru</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Button Placeholder */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveCoverLetterMutation.mutate()}
              disabled={saveCoverLetterMutation.isPending || isCoverLetterLoading}
              className="gap-2"
              data-testid="button-save-cover-letter"
            >
              {saveCoverLetterMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="w-4 h-4" />
              Save Cover Letter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2 lg:hidden"
              data-testid="button-toggle-preview"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 pb-3">
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden md:block w-56 bg-white border-r border-gray-200 p-4 sticky top-[88px] h-[calc(100vh-88px)]">
          <nav className="space-y-1">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  data-testid={`nav-step-${step.id}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isActive
                        ? "bg-primary text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium text-sm">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 flex">
          <div className={`flex-1 ${showPreview ? "lg:w-1/2" : "w-full"}`}>
            <ScrollArea className="h-[calc(100vh-88px)]">
              <div className="max-w-2xl mx-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>

          {showPreview && (
            <div className="hidden lg:block w-1/2 bg-gray-100 border-l border-gray-200 p-8 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto">
              <div className="max-w-md mx-auto">
                <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Live Preview</h3>
                <CoverLetterPreview />
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex overflow-x-auto gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              disabled={index > currentStep}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : isCompleted
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
              data-testid={`nav-mobile-step-${step.id}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
              </div>
              <span className="text-[10px] font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CoverLetterBuilder() {
  return (
    <CoverLetterProvider>
      <CoverLetterBuilderContent />
    </CoverLetterProvider>
  );
}