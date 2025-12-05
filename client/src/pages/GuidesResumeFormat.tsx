import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check, Clock, Briefcase, Layers } from "lucide-react";
import { Link } from "wouter";

export default function GuidesResumeFormat() {
  const formats = [
    {
      id: "chronological",
      title: "Reverse-Chronological",
      icon: Clock,
      bestFor: "Professionals with a steady career progression in the same industry.",
      description: "The most common and widely accepted format. It lists your work experience in reverse chronological order, starting with your most recent job.",
      pros: ["Preferred by recruiters", "Easy to read", "Highlights career growth"],
      cons: ["Gaps in employment are visible", "Not ideal for career changers"],
    },
    {
      id: "functional",
      title: "Functional (Skill-Based)",
      icon: Briefcase,
      bestFor: "Career changers, recent graduates, or those with employment gaps.",
      description: "Focuses on your skills and abilities rather than your chronological work history. It groups your experience under skill categories.",
      pros: ["Hides employment gaps", "Highlights transferable skills", "Good for career pivots"],
      cons: ["Recruiters may be suspicious", "Harder for ATS to parse"],
    },
    {
      id: "combination",
      title: "Combination (Hybrid)",
      icon: Layers,
      bestFor: "Senior professionals with diverse skills and a strong work history.",
      description: "Combines elements of both chronological and functional formats. It starts with a skills summary followed by a detailed work history.",
      pros: ["Showcases both skills and experience", "Very flexible", "Great for senior roles"],
      cons: ["Can be lengthy", "Harder to format"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                The Ultimate <span className="text-primary">Resume Format</span> Guide
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Not sure which resume format to use? We break down the three main types so you can choose the one that best tells your career story.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Formats Comparison */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="chronological" className="w-full">
              <div className="text-center mb-12">
                <TabsList className="inline-flex h-auto p-1 bg-gray-100 rounded-full">
                  {formats.map((format) => (
                    <TabsTrigger
                      key={format.id}
                      value={format.id}
                      className="px-6 py-3 rounded-full text-sm md:text-base font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      {format.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {formats.map((format) => (
                <TabsContent key={format.id} value={format.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <format.icon className="w-8 h-8 text-primary" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900">{format.title} Format</h2>
                        </div>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                          {format.description}
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                          <h4 className="font-bold text-blue-900 mb-2">Best For:</h4>
                          <p className="text-blue-800">{format.bestFor}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Pros
                            </h4>
                            <ul className="space-y-3">
                              {format.pros.map((pro, i) => (
                                <li key={i} className="flex items-start text-gray-600 text-sm">
                                  <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Cons
                            </h4>
                            <ul className="space-y-3">
                              {format.cons.map((con, i) => (
                                <li key={i} className="flex items-start text-gray-600 text-sm">
                                  <div className="w-4 h-0.5 bg-red-400 mr-2 mt-2.5 flex-shrink-0"></div>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Visual Representation */}
                      <div className="bg-gray-100 p-8 rounded-2xl shadow-inner flex justify-center">
                        <div className="w-full max-w-sm bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                          <div className="h-4 bg-gray-800 w-full"></div>
                          <div className="p-6 space-y-4">
                            <div className="flex gap-4 mb-6">
                              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 w-3/4 rounded"></div>
                                <div className="h-3 bg-gray-300 w-1/2 rounded"></div>
                              </div>
                            </div>

                            {/* Layout simulation based on format */}
                            {format.id === "chronological" && (
                              <>
                                <div className="space-y-2">
                                  <div className="h-4 bg-primary/20 w-1/3 rounded mb-2"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                  <div className="h-2 bg-gray-200 w-5/6 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-primary/20 w-1/3 rounded mb-2"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                </div>
                              </>
                            )}

                            {format.id === "functional" && (
                              <>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <div className="h-3 bg-primary/20 w-full rounded"></div>
                                    <div className="h-1.5 bg-gray-200 w-full rounded"></div>
                                    <div className="h-1.5 bg-gray-200 w-full rounded"></div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-3 bg-primary/20 w-full rounded"></div>
                                    <div className="h-1.5 bg-gray-200 w-full rounded"></div>
                                    <div className="h-1.5 bg-gray-200 w-full rounded"></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-800 w-1/4 rounded mb-2"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                </div>
                              </>
                            )}

                            {format.id === "combination" && (
                              <>
                                <div className="mb-4 space-y-2">
                                  <div className="h-4 bg-primary/20 w-1/2 rounded"></div>
                                  <div className="flex flex-wrap gap-2">
                                    <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                                    <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                                    <div className="h-6 w-14 bg-gray-100 rounded-full"></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-gray-800 w-1/3 rounded"></div>
                                  <div className="h-2 bg-gray-200 w-full rounded"></div>
                                  <div className="h-2 bg-gray-200 w-5/6 rounded"></div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Found Your Format?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our builder supports all these formats. Switch between them with a single click to see what looks best.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/templates">
                <Button variant="outline" size="lg" className="px-8">View Templates</Button>
              </Link>
              <Link href="/builder">
                <Button size="lg" className="px-8">Start Building</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
