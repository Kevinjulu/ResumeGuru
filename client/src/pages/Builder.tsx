import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { ResumeProvider, useResume } from "@/lib/resumeContext";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { ContactStep } from "@/components/builder/steps/ContactStep";
import { SummaryStep } from "@/components/builder/steps/SummaryStep";
import { ExperienceStep } from "@/components/builder/steps/ExperienceStep";
import { EducationStep } from "@/components/builder/steps/EducationStep";
import { SkillsStep } from "@/components/builder/steps/SkillsStep";
import { CertificationsStep } from "@/components/builder/steps/CertificationsStep";
import { TemplateStep } from "@/components/builder/steps/TemplateStep";
import { DownloadStep } from "@/components/builder/steps/DownloadStep";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Palette,
  Download,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: "contact", label: "Contact", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "template", label: "Template", icon: Palette },
  { id: "download", label: "Download", icon: Download },
];

function BuilderContent() {
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const initialTemplate = params.get("template");
  const initialColor = params.get("color");

  const { setTemplate, setColor } = useResume();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (initialTemplate) {
      fetch('/api/auth/me', { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          const tpl = resumeTemplates.find(t => t.id === initialTemplate);
          const isPrem = tpl && ('premium' in tpl) && (tpl as any).premium;
          if (isPrem && d?.accountTier !== 'premium') return;
          setTemplate(initialTemplate);
        })
        .catch(() => setTemplate(initialTemplate));
    }
    if (initialColor) {
      setColor(initialColor);
    }
  }, [initialTemplate, initialColor, setTemplate, setColor]);

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

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case "contact":
        return <ContactStep onNext={goToNext} />;
      case "summary":
        return <SummaryStep onNext={goToNext} onBack={goBack} />;
      case "experience":
        return <ExperienceStep onNext={goToNext} onBack={goBack} />;
      case "education":
        return <EducationStep onNext={goToNext} onBack={goBack} />;
      case "skills":
        return <SkillsStep onNext={goToNext} onBack={goBack} />;
      case "certifications":
        return <CertificationsStep onNext={goToNext} onBack={goBack} />;
      case "template":
        return <TemplateStep onNext={goToNext} onBack={goBack} />;
      case "download":
        return <DownloadStep onBack={goBack} />;
      default:
        return null;
    }
  };

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
                <ResumePreview />
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

export default function Builder() {
  return (
    <ResumeProvider>
      <BuilderContent />
    </ResumeProvider>
  );
}
import { resumeTemplates } from "@shared/schema";
