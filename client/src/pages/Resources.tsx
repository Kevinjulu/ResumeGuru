import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { jobCategories, prewrittenBullets, prewrittenSkills } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, Users, FileText, ArrowRight, Briefcase, GraduationCap, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function Resources() {
  const searchParams = useSearch();
  const initialCategory = new URLSearchParams(searchParams).get("category") || "";
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (selectedCategory === "all" && !searchQuery) return jobCategories;
    
    return jobCategories.filter((cat) => {
      const matchesCategory = selectedCategory === "all" || cat === selectedCategory;
      const matchesSearch = cat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const resources = [
    {
      title: "How to Write a Resume",
      description: "Complete guide to writing a professional resume that gets interviews.",
      icon: FileText,
      category: "Writing Tips",
    },
    {
      title: "Resume Format Guide",
      description: "Choose the right resume format for your experience level and industry.",
      icon: Briefcase,
      category: "Formatting",
    },
    {
      title: "Resume Keywords",
      description: "Learn how to optimize your resume for Applicant Tracking Systems.",
      icon: Award,
      category: "ATS Tips",
    },
    {
      title: "Education Section Guide",
      description: "How to list education on your resume effectively.",
      icon: GraduationCap,
      category: "Sections",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Resume Examples & Resources
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore 450+ resume examples reviewed by career experts. Find inspiration 
                for your industry and learn what works.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by job title or industry..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-resource-search"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Browse by Industry
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <CategoryCard 
                    category={category} 
                    isSelected={selectedCategory === category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? "all" : category)}
                  />
                </motion.div>
              ))}
            </div>

            {selectedCategory !== "all" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedCategory} Resume Examples
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      View All Categories
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Sample Bullet Points
                      </h4>
                      <ul className="space-y-3">
                        {(prewrittenBullets[selectedCategory] || prewrittenBullets["Customer Service"])?.slice(0, 4).map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Top Skills for {selectedCategory}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(prewrittenSkills[selectedCategory] || prewrittenSkills["Customer Service"])?.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Link href={`/builder?category=${encodeURIComponent(selectedCategory)}`}>
                      <Button className="gap-2" data-testid="button-build-category">
                        Build Your {selectedCategory} Resume
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Resume Writing Guides
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group" data-testid={`card-resource-${index}`}>
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <resource.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="mb-3">{resource.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to create your resume?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Use our AI-powered builder to create a professional resume in minutes. 
              Get pre-written content for your industry.
            </p>
            <Link href="/builder">
              <Button size="lg" className="gap-2" data-testid="button-resources-cta">
                Start Building Your Resume
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

function CategoryCard({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: string; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <Card 
      className={`p-4 text-center cursor-pointer transition-all ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "hover:shadow-md hover:border-primary/20"
      }`}
      onClick={onClick}
      data-testid={`card-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-colors ${
        isSelected ? "bg-primary/20" : "bg-primary/10"
      }`}>
        <Users className={`w-6 h-6 ${isSelected ? "text-primary" : "text-primary/70"}`} />
      </div>
      <h3 className={`font-medium text-sm ${isSelected ? "text-primary" : "text-gray-900"}`}>
        {category}
      </h3>
    </Card>
  );
}
