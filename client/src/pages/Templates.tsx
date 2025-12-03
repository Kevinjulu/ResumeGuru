import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { resumeTemplates, templateColors } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, Download, Star, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type TemplateStyle = "all" | "professional" | "modern" | "creative" | "simple";

export default function Templates() {
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = resumeTemplates.filter((template) => {
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Free Resume Templates
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of professionally designed resume templates. 
                All templates are free to use and fully customizable.
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

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300" data-testid={`card-template-${template.id}`}>
      <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div 
            className="h-16 transition-colors duration-200" 
            style={{ backgroundColor: selectedColor.hex }}
          ></div>
          <div className="p-3 space-y-2">
            <div className="h-2.5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-1.5 bg-gray-100 rounded w-full"></div>
            <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
            <div className="mt-4 h-2 bg-gray-200 rounded w-1/2"></div>
            <div className="h-1 bg-gray-100 rounded w-full"></div>
            <div className="h-1 bg-gray-100 rounded w-5/6"></div>
            <div className="h-1 bg-gray-100 rounded w-4/5"></div>
            <div className="mt-3 h-2 bg-gray-200 rounded w-1/3"></div>
            <div className="h-1 bg-gray-100 rounded w-full"></div>
            <div className="h-1 bg-gray-100 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link href={`/builder?template=${template.id}&color=${selectedColor.id}`}>
            <Button className="shadow-lg" data-testid={`button-use-template-${template.id}`}>
              Use This Template
            </Button>
          </Link>
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
                onClick={() => setSelectedColor(color)}
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
