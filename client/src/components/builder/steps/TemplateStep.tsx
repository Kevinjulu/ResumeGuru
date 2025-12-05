import { useState } from "react";
import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/ui/TierBadge";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { useTemplateAccess } from "@/hooks/useTemplateAccess";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { resumeTemplates, templateColors } from "@shared/schema";
import { motion } from "framer-motion";

interface TemplateStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function TemplateStep({ onNext, onBack }: TemplateStepProps) {
  const { resumeData, setTemplate, setColor } = useResume();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedLockedTemplate, setSelectedLockedTemplate] = useState<typeof resumeTemplates[number] | null>(null);
  const { canAccessTemplate } = useTemplateAccess();

  const handleTemplateClick = (template: typeof resumeTemplates[number]) => {
    if (canAccessTemplate(template.id)) {
      setTemplate(template.id);
    } else {
      setSelectedLockedTemplate(template);
      setUpgradeModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Template</h2>
        <p className="text-gray-600 mt-1">
          Select a template that fits your style and customize the color scheme.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Color Scheme</h3>
        <div className="flex flex-wrap gap-3">
          {templateColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setColor(color.id)}
              className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${resumeData.colorId === color.id
                  ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                  : "hover:scale-105"
                }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              data-testid={`button-color-${color.id}`}
            >
              {resumeData.colorId === color.id && (
                <Check className="w-5 h-5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Template Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resumeTemplates.map((template, index) => {
            const isSelected = resumeData.templateId === template.id;
            const isLocked = !canAccessTemplate(template.id);

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card
                  className={`cursor-pointer overflow-hidden transition-all ${isSelected
                      ? "ring-2 ring-primary shadow-lg"
                      : isLocked
                        ? "opacity-70 hover:opacity-90"
                        : "hover:shadow-md hover:border-gray-300"
                    }`}
                  onClick={() => handleTemplateClick(template)}
                  data-testid={`card-template-select-${template.id}`}
                >
                  <div className="aspect-[8.5/11] bg-gray-100 relative overflow-hidden">
                    {/* Actual Resume Thumbnail */}
                    <img
                      src={template.thumbnail}
                      alt={`${template.name} template`}
                      className={`w-full h-full object-cover object-top ${isLocked ? "opacity-60" : ""}`}
                      loading="lazy"
                    />

                    {/* Tier Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <TierBadge tier={template.tier} size="sm" />
                    </div>

                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-xs font-semibold">Locked</p>
                        </div>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && !isLocked && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 text-center">
                    <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                    <Badge variant="secondary" className="mt-1 text-xs capitalize">
                      {template.style}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-template">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-template">
          Continue to Download
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Upgrade Modal */}
      {selectedLockedTemplate && (
        <UpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => {
            setUpgradeModalOpen(false);
            setSelectedLockedTemplate(null);
          }}
          requiredTier={selectedLockedTemplate.tier}
          templateName={selectedLockedTemplate.name}
          thumbnail={selectedLockedTemplate.thumbnail}
        />
      )}
    </div>
  );
}
