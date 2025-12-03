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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <header className="relative z-50 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-md border-b border-white/5 sticky top-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 transition-all" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <Link href="/">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent hidden sm:inline cursor-pointer">
                resume<span className="text-orange-400">guru</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2 lg:hidden text-white border-white/20 bg-white/5 hover:bg-white/10"
              data-testid="button-toggle-preview"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 pb-3">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative z-10">
        <aside className="hidden md:block w-64 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-md border-r border-white/10 p-4 sticky top-[88px] h-[calc(100vh-88px)]">
          <nav className="space-y-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;

              return (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!isAccessible}
                  whileHover={isAccessible ? { x: 4 } : {}}
                  whileTap={isAccessible ? { scale: 0.98 } : {}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : isCompleted
                      ? "text-gray-300 hover:bg-white/5"
                      : "text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                  data-testid={`nav-step-${step.id}`}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-gray-700 text-gray-500"
                    }`}
                    animate={isActive ? { rotate: [0, -5, 5, 0] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
                  >
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </motion.div>
                  <span className="font-semibold text-sm">{step.label}</span>
                  {isActive && (
                    <motion.div className="ml-auto w-1 h-5 bg-white rounded-full" layoutId="active-indicator" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 flex">
          <div className={`flex-1 ${showPreview ? "lg:w-1/2" : "w-full"}`}>
            <ScrollArea className="h-[calc(100vh-88px)]">
              <div className="max-w-2xl mx-auto p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="backdrop-blur"
                  >
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 backdrop-blur-xl shadow-2xl">
                      {renderStep()}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block w-1/2 bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-l border-white/10 p-8 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto backdrop-blur-md"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text mb-6 text-center"
                >
                  Live Preview
                </motion.div>
                <motion.div
                  className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <ResumePreview />
                </motion.div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 to-slate-900/80 backdrop-blur-md border-t border-white/10 px-4 py-3 flex overflow-x-auto gap-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isAccessible = index <= currentStep;

          return (
            <motion.button
              key={step.id}
              onClick={() => goToStep(index)}
              disabled={index > currentStep}
              whileHover={isAccessible ? { scale: 1.05 } : {}}
              whileTap={isAccessible ? { scale: 0.95 } : {}}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : isCompleted
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-gray-500 bg-gray-700/20"
              }`}
              data-testid={`nav-mobile-step-${step.id}`}
            >
              <motion.div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isCompleted
                    ? "bg-emerald-500/30 text-emerald-300"
                    : "bg-gray-600 text-gray-400"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
              </motion.div>
              <span className="text-[10px] font-semibold text-white">{step.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
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
