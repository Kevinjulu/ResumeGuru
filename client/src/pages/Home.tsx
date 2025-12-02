import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Sparkles,
  FileText,
  Download,
  Star,
  CheckCircle2,
  ArrowRight,
  Users,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { resumeTemplates, templateColors, jobCategories } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Make a Job-Ready Resume in Minutes</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The Best Resume
              <br />
              <span className="text-primary">Builder Online</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Let our AI-powered resume builder help you create a professional resume 
              quickly and effortlessly. Choose from 10+ templates and get hired faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/builder">
                <Button size="lg" className="text-lg px-8 py-6 font-semibold shadow-lg shadow-primary/25" data-testid="button-hero-build">
                  Build My Resume Now
                </Button>
              </Link>
              <Link href="/builder?upload=true">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-semibold" data-testid="button-hero-upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload My Existing Resume
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-white flex items-center justify-center text-sm font-medium text-primary"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Resume & Career Experts</span>
              </div>

              <div className="flex items-center gap-2 border-l pl-6">
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="text-sm font-semibold text-gray-900">4.5</span>
                <span className="text-sm text-gray-500">Trustpilot</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-auto text-xs text-gray-400">Resume Builder</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-16 space-y-2">
                      {["Profile", "Experience", "Education", "Skills"].map((section, i) => (
                        <div
                          key={section}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                            i === 0 ? "bg-primary/10 text-primary" : "text-gray-400"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded ${i === 0 ? "bg-primary/20" : "bg-gray-100"}`}></div>
                          <span className="hidden xl:inline">{section}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 min-h-[280px]">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-white text-xl font-bold">
                          JD
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">Your Name</h3>
                          <p className="text-sm text-gray-500">Professional Title</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">Email</Badge>
                            <Badge variant="secondary" className="text-xs">Phone</Badge>
                            <Badge variant="secondary" className="text-xs">Location</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Profile</h4>
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-4/5 mt-1"></div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Experience</h4>
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4 mt-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TemplatesSection() {
  const displayTemplates = resumeTemplates.slice(0, 8);

  return (
    <section className="py-20 bg-white" id="templates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose your favorite free resume template
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make a resume by downloading a free resume template from our collection. 
            You can also let the Guru resume builder write and format your resume for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/builder?template=${template.id}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid={`card-template-${template.id}`}>
                  <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <div className="absolute inset-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div 
                        className="h-20 rounded-t-lg" 
                        style={{ backgroundColor: templateColors.find(c => c.id === (template.style === "modern" ? "blue" : "orange"))?.hex }}
                      ></div>
                      <div className="p-3 space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-full"></div>
                        <div className="h-1.5 bg-gray-100 rounded w-4/5"></div>
                        <div className="mt-4 h-1.5 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-1 bg-gray-100 rounded w-full"></div>
                        <div className="h-1 bg-gray-100 rounded w-5/6"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" className="shadow-lg">
                        Use This Template
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-templates">
              View All Resume Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Make your resume faster with AI
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Enter a few details about your experience and qualifications, and we will 
              generate a pre-written resume that you can quickly edit in our resume builder. 
              No need to start on a blank page.
            </p>
            <div className="space-y-4">
              {[
                "Generate professional summaries instantly",
                "Get tailored bullet points for your industry",
                "Optimize keywords for ATS systems",
                "Improve your resume's impact with AI suggestions",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/builder">
              <Button size="lg" className="mt-8 gap-2" data-testid="button-ai-cta">
                <Sparkles className="w-5 h-5" />
                Try AI Resume Builder
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Card className="p-6 bg-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI Resume Generator</h4>
                  <p className="text-sm text-gray-500">Tell us about your experience</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Job Title</label>
                  <div className="h-10 bg-gray-100 rounded-lg border border-gray-200 px-3 flex items-center text-gray-500 text-sm">
                    Software Engineer
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Years of Experience</label>
                  <div className="h-10 bg-gray-100 rounded-lg border border-gray-200 px-3 flex items-center text-gray-500 text-sm">
                    5+ years
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Key Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "AWS"].map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full gap-2 mt-4">
                  <Sparkles className="w-4 h-4" />
                  Generate My Resume
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: "Quickly generate your resume's content",
      description: "Whether you're clicking pre-written bullets and skills or using AI to create a custom summary, our builder does the writing so you don't have to.",
      icon: Zap,
      color: "bg-primary",
    },
    {
      step: 2,
      title: "Select a resume template",
      description: "See how your resume looks using different templates. Choose the template that fits the job you want and best suits your professional background.",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      step: 3,
      title: "Download your resume",
      description: "Save your newly built resume as a PDF, Word Doc, or TXT file directly to your browser. You're now ready to start applying for jobs!",
      icon: Download,
      color: "bg-green-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Use our resume builder in 3 easy steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Putting together a resume has never been easier. Our resume builder fills out 
            your information and formats it into an HR-approved template.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Card className="relative p-8 h-full border-2 hover:border-primary/20 transition-colors">
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Link href="/builder">
            <Button size="lg" className="gap-2" data-testid="button-steps-build">
              Make a Resume Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/cover-letter">
            <Button size="lg" variant="outline" data-testid="button-steps-cover">
              Generate a Cover Letter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExamplesSection() {
  const categories = jobCategories.slice(0, 12);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real resume examples reviewed by experts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore 450+ resume examples for common jobs. Every sample is reviewed by a 
            relevant expert and includes suggestions to make a resume for that job.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/resources?category=${encodeURIComponent(category)}`}>
                <Card className="p-4 text-center hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group" data-testid={`card-category-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/resources">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-examples">
              View All Resume Examples
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const stats = [
    { value: "10M+", label: "Resumes Created" },
    { value: "450+", label: "Resume Examples" },
    { value: "4.5", label: "Trustpilot Rating" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to make your resume?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn how our builder software can help you create a resume that perfectly 
            highlights your talents and lands you more interviews.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/builder">
              <Button size="lg" className="text-lg px-8 py-6 font-semibold shadow-lg shadow-primary/25" data-testid="button-cta-build">
                Build My Resume Now
              </Button>
            </Link>
          </div>
          <div className="flex justify-center items-center gap-2 mt-8 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your data is secure and never shared</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TemplatesSection />
        <AISection />
        <HowItWorksSection />
        <ExamplesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
