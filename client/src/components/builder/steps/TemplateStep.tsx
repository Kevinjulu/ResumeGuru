import { useResume } from "@/lib/resumeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { resumeTemplates, templateColors } from "@shared/schema";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TemplateStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function TemplateStep({ onNext, onBack }: TemplateStepProps) {
  const { resumeData, setTemplate, setColor, setLayoutVariant, setSectionOrder } = useResume();
  const [userTier, setUserTier] = useState<'free'|'premium'>('free');
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.accountTier) setUserTier(d.accountTier); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userTier === 'premium') return;
    (async () => {
      const cfgRes = await fetch('/api/billing/config', { credentials: 'include' });
      const cfg = await cfgRes.json();
      if (!cfg.clientId) return;
      if (!(window as any).paypal) {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${cfg.clientId}&currency=${cfg.currency}`;
        script.onload = () => {
          (window as any).paypal.Buttons({
            createOrder: async () => {
              const r = await fetch('/api/billing/paypal/create-order', { method: 'POST', credentials: 'include' });
              const j = await r.json();
              return j.id;
            },
            onApprove: async (data: any) => {
              await fetch('/api/billing/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID }),
                credentials: 'include',
              });
              setUserTier('premium');
            },
          }).render('#paypal-upgrade-button');
        };
        document.body.appendChild(script);
      } else {
        (window as any).paypal.Buttons({
          createOrder: async () => {
            const r = await fetch('/api/billing/paypal/create-order', { method: 'POST', credentials: 'include' });
            const j = await r.json();
            return j.id;
          },
          onApprove: async (data: any) => {
            await fetch('/api/billing/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID }),
              credentials: 'include',
            });
            setUserTier('premium');
          },
        }).render('#paypal-upgrade-button');
      }
    })();
  }, [userTier]);

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
                  onClick={() => {
                    if ((('premium' in template) && (template as any).premium) && userTier !== 'premium') return;
                    setTemplate(template.id);
                  }}
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
                    {('premium' in template) && (template as any).premium && (
                      <div className="mt-1"><Badge className="text-xs">Premium</Badge></div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {(resumeData.templateId === 'compact' || resumeData.templateId === 'sidebar-pro') && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Layout Options</h3>
          <div className="flex gap-2">
            <Button variant={resumeData.layoutVariant === 'single' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutVariant('single')}>Single Column</Button>
            <Button variant={resumeData.layoutVariant === 'double' ? 'default' : 'outline'} size="sm" onClick={() => setLayoutVariant('double')}>Two Columns</Button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Section Order</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setSectionOrder(["summary","experience","education","skills","certifications"])}>Standard</Button>
          <Button size="sm" variant="outline" onClick={() => setSectionOrder(["experience","summary","education","skills","certifications"])}>Experience First</Button>
          <Button size="sm" variant="outline" onClick={() => setSectionOrder(["summary","skills","experience","education","certifications"])}>Skills Early</Button>
        </div>
      </div>

      {userTier !== 'premium' && (
        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-100">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-yellow-900">Upgrade to Premium to use premium templates</span>
            <div className="space-y-2">
              <div id="paypal-upgrade-button" />
              <Button size="sm" variant="outline" onClick={() => {
                fetch('/api/billing/upgrade', { method: 'POST', credentials: 'include' })
                  .then(r => r.json())
                  .then(d => { if (d?.accountTier === 'premium') setUserTier('premium'); });
              }}>Manual Upgrade (Dev)</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" data-testid="button-back-template">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="gap-2" data-testid="button-next-template" disabled={(resumeData.templateId && (('premium' in (resumeTemplates.find(t=>t.id===resumeData.templateId) || {})) && (resumeTemplates.find(t=>t.id===resumeData.templateId) as any).premium) && userTier!=='premium')}>
          Continue to Download
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
