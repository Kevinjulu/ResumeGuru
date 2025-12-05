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
import { pricingPlans, featureComparisonMatrix } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, X, Sparkles, Shield, Clock, HeadphonesIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { pricingEvents } from "@/lib/analytics";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  
  // Track page view on mount
  useEffect(() => {
    pricingEvents.pageViewed();
  }, []);
  
  const faqs = [
    {
      question: "What's included in the Free plan?",
      answer: "The Free plan includes 1 resume, 3 basic templates, text formatting, TXT downloads, and access to our online editor. You can try all our core features to see if ResumeGuru is right for you.",
    },
    {
      question: "What are the key differences between Pro and Premium?",
      answer: "Pro ($2/month) includes unlimited resumes, all templates, PDF/Word exports, and AI features. Premium ($7/month) adds cover letters, priority 24/7 support, LinkedIn optimization, expert resume review, and a portfolio website.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
    },
    {
      question: "Do you offer a free trial for Pro and Premium?",
      answer: "Yes! We offer a 14-day free trial for Pro and Premium plans so you can try all features before committing.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are securely processed through Stripe.",
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact our support team within 14 days of purchase for a full refund.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Affordable Plans for Every Job Seeker
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Start for free, upgrade anytime. All plans include our professional resume builder 
                and expert-designed templates. Pay only for what you need.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div key={plan.id} variants={itemVariants}>
                  {plan.popular && (
                    <div className="flex justify-center mb-4">
                      <Badge className="bg-primary text-white px-4 py-1 shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card 
                    className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg ${
                      plan.popular 
                        ? "border-2 border-primary shadow-xl ring-2 ring-primary/10 scale-105" 
                        : "border border-gray-200 hover:border-primary/50"
                    }`}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    {/* Card Header */}
                    <CardHeader className="text-center pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-5xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 ml-2">/{plan.period}</span>
                      </div>
                      {plan.price === 0 && (
                        <p className="text-sm text-gray-600 mt-2">Forever free, no credit card required</p>
                      )}
                    </CardHeader>
                    
                    {/* Card Content */}
                    <CardContent className="flex-1 flex flex-col p-6">
                      {/* Features List */}
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.length > 0 && (
                          <>
                            {plan.limitations.map((limitation) => (
                              <li key={limitation} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm">{limitation}</span>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                      
                      {/* CTA Button */}
                      <Link href={plan.id === "free" ? "/builder" : `/checkout?plan=${plan.id}`}>
                        <Button 
                          onClick={() => pricingEvents.ctaButtonClicked(plan.id)}
                          className={`w-full flex items-center justify-center gap-2 transition-all duration-300 ${
                            plan.popular 
                              ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 text-white" 
                              : ""
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                          size="lg"
                          data-testid={`button-select-${plan.id}`}
                        >
                          {plan.id === "free" ? "Get Started Free" : `Try ${plan.name} Free`}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      {plan.price > 0 && (
                        <p className="text-xs text-gray-500 text-center mt-3">
                          14-day free trial, cancel anytime
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Info Box */}
            <motion.div
              className="mt-12 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-blue-900 font-medium">
                ✨ All plans include our world-class resume templates, online editor, and core features.
                <br />
                Upgrade anytime to unlock premium features like AI tools, cover letters, and expert support.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Feature Comparison */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => pricingEvents.comparisonTableViewed()}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Detailed Feature Comparison
              </h2>
              <p className="text-lg text-gray-600">
                See exactly what's included in each plan
              </p>
            </motion.div>

            {/* Feature Comparison Table */}
            <motion.div
              className="overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold" scope="col">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold" scope="col" aria-label="Available in Free plan">Free</th>
                    <th className="px-6 py-4 text-center font-semibold bg-primary/10" scope="col" aria-label="Available in Pro plan">Pro</th>
                    <th className="px-6 py-4 text-center font-semibold" scope="col" aria-label="Available in Premium plan">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: "Resumes", free: "1", pro: "Unlimited", premium: "Unlimited" },
                    { name: "Templates", free: "3", pro: "10+", premium: "10+" },
                    { name: "Online Editor", free: "✓", pro: "✓", premium: "✓" },
                    { name: "PDF Export", free: "✗", pro: "✓", premium: "✓" },
                    { name: "Word Export", free: "✗", pro: "✓", premium: "✓" },
                    { name: "No Watermark", free: "✗", pro: "✓", premium: "✓" },
                    { name: "AI Summary Generator", free: "✗", pro: "✓", premium: "✓" },
                    { name: "Keyword Optimization", free: "✗", pro: "✓", premium: "✓" },
                    { name: "ATS Compatibility Check", free: "✗", pro: "✓", premium: "✓" },
                    { name: "Cover Letter Builder", free: "✗", pro: "✗", premium: "✓" },
                    { name: "LinkedIn Optimizer", free: "✗", pro: "✗", premium: "✓" },
                    { name: "Expert Resume Review", free: "✗", pro: "✗", premium: "✓" },
                    { name: "Priority Support", free: "✗", pro: "✗", premium: "✓" },
                    { name: "Portfolio Website", free: "✗", pro: "✗", premium: "✓" },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                      <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-center">
                        {row.free === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.free === "✗" ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-gray-600 font-medium">{row.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary/5">
                        {row.pro === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.pro === "✗" ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-gray-600 font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.premium === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : row.premium === "✗" ? (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-gray-600 font-medium">{row.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: Shield,
                  title: "14-Day Money Back",
                  description: "Not satisfied? Get a full refund within 14 days, no questions asked.",
                },
                {
                  icon: Clock,
                  title: "Instant Access",
                  description: "Start building your resume immediately. No setup time required.",
                },
                {
                  icon: HeadphonesIcon,
                  title: "24/7 Support",
                  description: "Premium plan members get priority support from our expert team.",
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

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-2 rounded-lg border">
                  <AccordionTrigger 
                    className="px-6 text-left font-medium hover:no-underline" 
                    data-testid={`faq-${index}`}
                    onClick={() => pricingEvents.faqAccordionOpened(faq.question)}
                  >
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

        {/* Final CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to create your perfect resume?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join millions of job seekers who have successfully landed their dream jobs 
                using ResumeGuru. Start free today!
              </p>
              <Link href="/builder">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-6 font-semibold hover:shadow-lg transition-all" 
                  data-testid="button-pricing-cta"
                >
                  Start Building for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
