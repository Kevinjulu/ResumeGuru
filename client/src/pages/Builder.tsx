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
  Sun,
  Moon,
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
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (initialTemplate) {
      setTemplate(initialTemplate);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Animated Background Accents */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Back */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900" data-testid="button-back-home">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Back</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200 hidden sm:block" />
              <Link href="/">
                <span className="text-lg font-bold text-gray-900 hidden sm:inline cursor-pointer hover:text-primary transition-colors">
                  resume<span className="text-primary">guru</span>
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark((v) => !v)}
                className="gap-2 text-gray-600"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2 lg:hidden text-gray-700"
                data-testid="button-toggle-preview"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Show</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/60 backdrop-blur-sm border-r border-gray-200/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;
              const StepIcon = step.icon;

              return (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  whileHover={isAccessible ? { x: 4 } : {}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200"
                      : isCompleted
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "text-gray-400 cursor-not-allowed opacity-60"
                  }`}
                  data-testid={`nav-step-${step.id}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{step.label}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Form Area */}
          <div className={`flex-1 flex flex-col overflow-hidden ${showPreview ? "lg:w-1/2" : "w-full"}`}>
            <ScrollArea className="flex-1">
              <div className="max-w-2xl mx-auto p-6 md:p-8 lg:p-10 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    {/* Step Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white">
                          {(() => {
                            const StepIcon = steps[currentStep].icon;
                            return <StepIcon className="w-5 h-5" />;
                          })()}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{steps[currentStep].label}</h1>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base">
                        Step {currentStep + 1} of {steps.length} — Fill in your {steps[currentStep].label.toLowerCase()}
                      </p>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/50 shadow-lg">
                      {renderStep()}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex flex-col w-1/2 bg-white/60 backdrop-blur-sm border-l border-gray-200/50 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Live Preview</h3>
                  <p className="text-xs text-gray-500 mt-1">Your resume in real-time</p>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <div className="w-full max-w-sm">
                    <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                      <ResumePreview />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4 px-4">Hover over preview to download</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile Step Navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl"
      >
        <ScrollArea className="w-full">
          <div className="flex gap-2 p-3 w-full min-w-max">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-b from-orange-500 to-orange-400 text-white shadow-lg"
                      : isCompleted
                      ? "bg-green-100 text-green-600"
                      : "text-gray-400"
                  } ${!isAccessible && "cursor-not-allowed opacity-50"}`}
                  data-testid={`nav-mobile-step-${step.id}`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                      isActive
                        ? "bg-white/20"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <StepIcon className="w-3 h-3" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </motion.nav>

      {/* Mobile: Add padding for nav */}
      <div className="lg:hidden h-20" />
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
