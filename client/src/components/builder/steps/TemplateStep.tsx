import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { resumeTemplates, templateColors } from "@shared/schema";
import { motion } from "framer-motion";

interface TemplateStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function TemplateStep({ onNext, onBack }: TemplateStepProps) {
  const { resumeData, setTemplate, setColor } = useResume();

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
              className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                resumeData.colorId === color.id
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
            const currentColor = templateColors.find((c) => c.id === resumeData.colorId) || templateColors[0];

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card
                  className={`cursor-pointer overflow-hidden transition-all ${
                    isSelected
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md hover:border-gray-300"
                  }`}
                  onClick={() => setTemplate(template.id)}
                  data-testid={`card-template-select-${template.id}`}
                >
                  <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div
                        className="h-12 transition-colors duration-200"
                        style={{ backgroundColor: currentColor.hex }}
                      ></div>
                      <div className="p-2 space-y-1">
                        <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-100 rounded w-full"></div>
                        <div className="h-1 bg-gray-100 rounded w-4/5"></div>
                        <div className="mt-2 h-1 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-0.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-0.5 bg-gray-100 rounded w-5/6"></div>
                      </div>
                    </div>
                    
                    {isSelected && (
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
    </div>
  );
}
