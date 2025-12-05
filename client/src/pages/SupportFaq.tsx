import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SupportFaq() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          q: "How do I build my resume?",
          a: "Use the Resume Builder from the menu. Choose a template and follow the guided steps to create, preview, and download your resume as PDF or Word."
        },
        {
          q: "Is ResumeGuru free to use?",
          a: "Yes, you can create and download a basic resume for free. We also offer Pro and Premium plans with advanced features like unlimited downloads, premium templates, and AI tools."
        },
        {
          q: "Do I need an account to use ResumeGuru?",
          a: "You can try the builder without an account, but you'll need to sign up to save your work and download your resume."
        }
      ]
    },
    {
      category: "Templates & Customization",
      items: [
        {
          q: "Are templates ATS-friendly?",
          a: "Yes, all our templates are designed to be ATS (Applicant Tracking System) friendly, ensuring your resume gets read by hiring software."
        },
        {
          q: "Can I customize the colors and fonts?",
          a: "Absolutely! Our builder allows you to customize colors, fonts, spacing, and sections to match your personal style."
        },
        {
          q: "Can I upload my own photo?",
          a: "Yes, you can easily upload and crop a professional photo for your resume."
        }
      ]
    },
    {
      category: "Downloads & Account",
      items: [
        {
          q: "How do I download my resume as a Word document?",
          a: "Open your resume in the builder and choose the 'Download' option. Select the Word (DOCX) format. Note that this may be a premium feature."
        },
        {
          q: "How do I cancel my subscription?",
          a: "Go to your Account Settings > Billing and click on 'Cancel Subscription'. Your plan will remain active until the end of the billing period."
        },
        {
          q: "How do I contact support?",
          a: "Visit the Contact Support page (Support → Contact Support) and submit a message — our team aims to reply within one business day."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Find answers to common questions about ResumeGuru.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 text-lg bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                </div>
                <div className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, i) => (
                      <AccordionItem value={`item-${catIndex}-${i}`} key={i} className="border-b-0 mb-4 last:mb-0">
                        <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline py-2">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Can't find what you're looking for?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to help.</p>
          <a href="/support/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
            Contact Support
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
