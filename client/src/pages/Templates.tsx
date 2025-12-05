import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { resumeTemplates, templateColors, type TemplateTier } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TierBadge } from "@/components/ui/TierBadge";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { useTemplateAccess } from "@/hooks/useTemplateAccess";
import { Search, Download, Star, CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type TemplateStyle = "all" | "professional" | "modern" | "creative" | "simple";

export default function Templates() {
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>("all");
  const [selectedTier, setSelectedTier] = useState<"all" | TemplateTier>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = resumeTemplates.filter((template) => {
    const matchesStyle = selectedStyle === "all" || template.style === selectedStyle;
    const matchesTier = selectedTier === "all" || template.tier === selectedTier;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesTier && matchesSearch;
  });

  const styles: { value: TemplateStyle; label: string }[] = [
    { value: "all", label: "All Styles" },
    { value: "professional", label: "Professional" },
    { value: "modern", label: "Modern" },
    { value: "creative", label: "Creative" },
    { value: "simple", label: "Simple" },
  ];

  const tiers: { value: "all" | TemplateTier; label: string; count: number }[] = [
    { value: "all", label: "All Tiers", count: resumeTemplates.length },
    { value: "basic", label: "Free", count: resumeTemplates.filter(t => t.tier === "basic").length },
    { value: "pro", label: "Pro", count: resumeTemplates.filter(t => t.tier === "pro").length },
    { value: "premium", label: "Premium", count: resumeTemplates.filter(t => t.tier === "premium").length },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Professional Resume Templates
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of professionally designed resume templates.
                Select your tier to see available options.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-template-search"
                />
              </div>
            </div>

            {/* Tier Filter */}
            <div className="mb-6">
              <Tabs value={selectedTier} onValueChange={(v) => setSelectedTier(v as "all" | TemplateTier)} className="w-full">
                <TabsList className="w-full max-w-xl mx-auto flex h-auto gap-1 bg-white/50 p-1">
                  {tiers.map((tier) => (
                    <TabsTrigger
                      key={tier.value}
                      value={tier.value}
                      className="flex-1 min-w-[80px] flex flex-col items-center gap-0.5"
                      data-testid={`tab-tier-${tier.value}`}
                    >
                      <span>{tier.label}</span>
                      <span className="text-xs text-gray-500">({tier.count})</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Style Filter */}
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
                  <TemplateCard template={template} />
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  No templates found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedStyle("all");
                    setSelectedTier("all");
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
                Why use our resume templates?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "ATS-Friendly",
                  description: "All templates are designed to pass through Applicant Tracking Systems with ease.",
                  icon: CheckCircle2,
                },
                {
                  title: "Easy to Customize",
                  description: "Change colors, fonts, and layouts with just a few clicks in our builder.",
                  icon: Star,
                },
                {
                  title: "Multiple Formats",
                  description: "Download your resume as PDF, Word, or TXT file instantly.",
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
      </main>

      <Footer />
    </div>
  );
}

function TemplateCard({ template }: { template: typeof resumeTemplates[number] }) {
  const [selectedColor, setSelectedColor] = useState<typeof templateColors[number]>(templateColors[0]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const { canAccessTemplate } = useTemplateAccess();

  const isLocked = !canAccessTemplate(template.id);

  const handleTemplateClick = () => {
    if (isLocked) {
      setIsUpgradeModalOpen(true);
    }
  };

  return (
    <>
      <Card
        className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
        data-testid={`card-template-${template.id}`}
        onClick={isLocked ? handleTemplateClick : undefined}
      >
        <div className="aspect-[8.5/11] bg-gray-100 relative overflow-hidden">
          {/* Actual Resume Thumbnail */}
          <img
            src={template.thumbnail}
            alt={`${template.name} resume template`}
            className={`w-full h-full object-cover object-top transition-transform duration-300 ${isLocked ? "group-hover:scale-105 opacity-60" : "group-hover:scale-105"
              }`}
            loading="lazy"
          />

          {/* Tier Badge Overlay */}
          <div className="absolute top-2 right-2 z-10">
            <TierBadge tier={template.tier} size="sm" />
          </div>

          {/* Lock Overlay for Premium Templates */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Upgrade to Unlock</p>
              </div>
            </div>
          )}

          {/* Hover Action Overlay */}
          {!isLocked && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Link href={`/builder?template=${template.id}&color=${selectedColor.id}`}>
                <Button className="shadow-lg" data-testid={`button-use-template-${template.id}`}>
                  Use This Template
                </Button>
              </Link>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <Badge variant="secondary" className="text-xs capitalize">
              {template.style}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>

          {!isLocked && (
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {templateColors.slice(0, 6).map((color) => (
                  <button
                    key={color.id}
                    className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${selectedColor.id === color.id ? "ring-2 ring-offset-1 ring-gray-400" : ""
                      }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    title={color.name}
                    data-testid={`button-color-${color.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        requiredTier={template.tier}
        templateName={template.name}
        thumbnail={template.thumbnail}
      />
    </>
  );
}
