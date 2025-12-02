import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricingPlans } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, X, Sparkles, Shield, Clock, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const faqs = [
    {
      question: "Can I try ResumeGuru for free?",
      answer: "Yes! You can create one resume with our free plan, using 3 templates and basic formatting. You can download it as a TXT file. For full features including PDF/Word downloads and AI tools, upgrade to Pro or Premium.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are securely processed through Stripe.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with our service, contact our support team within 14 days of purchase for a full refund.",
    },
    {
      question: "What's included in the AI features?",
      answer: "Our AI features include automatic summary generation, pre-written bullet points tailored to your industry, keyword optimization for ATS systems, and intelligent suggestions to improve your resume's impact.",
    },
    {
      question: "Can I download my resume in different formats?",
      answer: "Pro and Premium plans allow you to download your resume as PDF, Microsoft Word (.docx), or plain text (.txt) files. The free plan only supports TXT downloads.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose the plan that works best for you. All plans include access to our 
                  professional resume builder and expert-designed templates.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-white px-4 py-1 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card 
                    className={`h-full flex flex-col ${
                      plan.popular 
                        ? "border-2 border-primary shadow-xl scale-105" 
                        : "border border-gray-200"
                    }`}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    <CardHeader className="text-center pb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-gray-500">/{plan.period}</span>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-3 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation) => (
                          <li key={limitation} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-400 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link href={plan.id === "free" ? "/builder" : "/checkout?plan=" + plan.id}>
                        <Button 
                          className={`w-full mt-6 ${
                            plan.popular 
                              ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" 
                              : ""
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                          size="lg"
                          data-testid={`button-select-${plan.id}`}
                        >
                          {plan.id === "free" ? "Get Started Free" : "Choose " + plan.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: Shield,
                  title: "14-Day Money Back",
                  description: "Not satisfied? Get a full refund within 14 days.",
                },
                {
                  icon: Clock,
                  title: "Instant Access",
                  description: "Start building your resume immediately after signup.",
                },
                {
                  icon: HeadphonesIcon,
                  title: "24/7 Support",
                  description: "Our team is here to help you anytime you need.",
                },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-2 rounded-lg border">
                  <AccordionTrigger className="px-6 text-left font-medium hover:no-underline" data-testid={`faq-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build your perfect resume?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join millions of job seekers who have successfully landed their dream jobs 
              using ResumeGuru.
            </p>
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-semibold" data-testid="button-pricing-cta">
                Start Building for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
