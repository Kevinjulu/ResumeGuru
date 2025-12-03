import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cvTemplates, templateColors } from "@shared/schema";
import { Search, Download, Star, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { HowToStartModal } from "@/components/modals/HowToStartModal";

type TemplateStyle = "all" | "professional" | "modern" | "creative" | "simple";

export default function CVs() {
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTemplateId, setModalTemplateId] = useState<string | null>(null);
  const [modalColorId, setModalColorId] = useState<string | null>(null);

  const filteredTemplates = cvTemplates.filter((template) => {
    const matchesStyle = selectedStyle === "all" || template.style === selectedStyle;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesSearch;
  });

  const styles: { value: TemplateStyle; label: string }[] = [
    { value: "all", label: "All Templates" },
    { value: "professional", label: "Professional" },
    { value: "modern", label: "Modern" },
    { value: "creative", label: "Creative" },
    { value: "simple", label: "Simple" },
  ];

  const handleUseTemplate = (templateId: string, colorId: string) => {
    setModalTemplateId(templateId);
    setModalColorId(colorId);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <HowToStartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTemplateId={modalTemplateId}
        selectedColorId={modalColorId}
        documentType="cv"
      />

      <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free CV Templates
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of professionally designed CV templates. 
              All templates are free to use and fully customizable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search CV templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-template-search"
              />
            </div>
          </div>

          <Tabs value={selectedStyle} onValueChange={(v) => setSelectedStyle(v as TemplateStyle)} className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto flex flex-wrap h-auto gap-1 bg-white/50 p-1">
              {styles.map((style) => (
                <TabsTrigger
                  key={style.value}
                  value={style.value}
                  className="flex-1 min-w-[100px]"
                  data-testid={`tab-style-${style.value}`}
                >
                  {style.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CvTemplateCard template={template} onUseTemplate={handleUseTemplate} />
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No CV templates found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedStyle("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why use our CV templates?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "ATS-Friendly",
                description: "All CV templates are designed to pass through Applicant Tracking Systems with ease.",
                icon: CheckCircle2,
              },
              {
                title: "Easy to Customize",
                description: "Change colors, fonts, and layouts with just a few clicks in our builder.",
                icon: Star,
              },
              {
                title: "Multiple Formats",
                description: "Download your CV as PDF, Word, or TXT file instantly.",
                icon: Download,
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to create your CV?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Use our builder to create a professional CV in minutes. 
            Get pre-written content for your industry.
          </p>
          <Link href="/builder">
            <Button size="lg" className="gap-2" data-testid="button-cv-cta">
              Start Building Your CV
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}

function CvTemplateCard({ template, onUseTemplate }: { template: typeof cvTemplates[number]; onUseTemplate: (templateId: string, colorId: string) => void }) {
  const [selectedColor, setSelectedColor] = useState<typeof templateColors[number]>(templateColors[0]);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300" data-testid={`card-template-${template.id}`}>
      <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <img
            src={`/templates/cv-${template.id}-${selectedColor.id}.png`} // Placeholder image URL
            alt={`${template.name} CV Template`}
            className="w-full h-full object-cover"
          />
          {template.premium && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Premium</Badge>
          )}
        </div>
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button 
            className="shadow-lg" 
            onClick={() => onUseTemplate(template.id, selectedColor.id)}
            data-testid={`button-use-template-${template.id}`}
          >
            Use This CV Template
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <Badge variant="secondary" className="text-xs capitalize">
            {template.style}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {templateColors.slice(0, 6).map((color) => (
              <button
                key={color.id}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                  selectedColor.id === color.id ? "ring-2 ring-offset-1 ring-gray-400" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
                title={color.name}
                data-testid={`button-color-${color.id}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}