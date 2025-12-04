import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function SupportFaq() {
  const faqs = [
    {
      q: "How do I build my resume?",
      a: "Use the Resume Builder from the menu. Choose a template and follow the guided steps to create, preview, and download your resume as PDF or Word."
    },
    {
      q: "Are templates free to use?",
      a: "Many templates are free. Some premium or advanced templates may require a paid plan; see the Pricing page for details."
    },
    {
      q: "How do I download my resume as a Word document?",
      a: "Open your resume in the builder and choose the 'Download' option. Select the Word (DOCX) format when available."
    },
    {
      q: "How do I contact support?",
      a: "Visit the Contact Support page (Support → Contact Support) and submit a message — our team aims to reply within one business day."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-6">Common questions about using ResumeGuru and our tools.</p>

        <Accordion type="single" collapsible>
          {faqs.map((item, i) => (
            <AccordionItem value={`item-${i}`} key={i}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-700">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <Footer />
    </div>
  );
}
