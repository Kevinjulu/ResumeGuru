import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, PenTool, Layout, FileText, Target } from "lucide-react";
import { Link } from "wouter";

export default function GuidesResumeWriting() {
  const steps = [
    {
      title: "Choose the Right Format",
      description: "Select a format that highlights your strengths. Chronological is best for steady work history, while Functional works well for career changers.",
      icon: Layout,
    },
    {
      title: "Add Contact Information",
      description: "Include your name, phone number, email, and LinkedIn profile. Make sure your email address looks professional.",
      icon: FileText,
    },
    {
      title: "Write a Compelling Summary",
      description: "Craft a 2-3 sentence professional summary that hooks the recruiter and highlights your key achievements and career goals.",
      icon: PenTool,
    },
    {
      title: "Tailor Your Experience",
      description: "Use bullet points to describe your work history. Focus on achievements and quantifiable results rather than just duties.",
      icon: Target,
    },
  ];

  const dos = [
    "Use action verbs (e.g., Achieved, Managed, Created)",
    "Quantify results with numbers and percentages",
    "Tailor your resume to the job description",
    "Keep it to 1-2 pages maximum",
    "Proofread for spelling and grammar errors",
  ];

  const donts = [
    "Don't include personal details like age or marital status",
    "Don't use an unprofessional email address",
    "Don't include references (unless asked)",
    "Don't use a generic objective statement",
    "Don't lie or exaggerate your skills",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                How to Write a Resume That <span className="text-primary">Gets Hired</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive guide to crafting a professional resume that stands out to recruiters and passes Applicant Tracking Systems (ATS).
              </p>
              <Link href="/builder">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                  Build My Resume Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-24 w-64 h-64 bg-purple-200 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Step-by-Step Guide</h2>
              <p className="text-lg text-gray-600">Follow these essential steps to build a winning resume.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-none shadow-md bg-gray-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Resume Do's and Don'ts</h2>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                  <CheckCircle2 className="w-8 h-8 mr-3" /> Do This
                </h3>
                <ul className="space-y-4">
                  {dos.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <h3 className="text-2xl font-bold text-red-500 mb-6 flex items-center">
                  <XCircle className="w-8 h-8 mr-3" /> Avoid This
                </h3>
                <ul className="space-y-4">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Put These Tips into Practice?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Create a professional resume in minutes with our AI-powered builder. No design skills needed.
            </p>
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-lg hover:bg-white hover:text-primary transition-colors">
                Create My Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
