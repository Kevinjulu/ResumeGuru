import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Copy, Check, ArrowRight, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExamplesCoverLetters() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const examples = [
    {
      id: "entry-level",
      title: "Entry-Level Marketing",
      category: "Marketing",
      level: "Entry Level",
      content: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Marketing Assistant position at [Company Name]. As a recent graduate with a degree in Marketing from [University Name], I am eager to bring my creative skills and passion for digital marketing to your team.\n\nDuring my internship at [Previous Company], I assisted in managing social media accounts and creating content that increased engagement by 20%. I am confident that my skills in content creation and social media management would make me a valuable asset to your team.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to [Company Name].\n\nSincerely,\n[Your Name]",
    },
    {
      id: "senior-software",
      title: "Senior Software Engineer",
      category: "Technology",
      level: "Senior",
      content: "Dear [Hiring Manager Name],\n\nWith over 8 years of experience in full-stack development, I was excited to see the opening for a Senior Software Engineer at [Company Name]. I have a proven track record of leading teams and delivering scalable solutions.\n\nIn my current role at [Current Company], I led the migration of our legacy system to a microservices architecture, resulting in a 40% improvement in system performance. I am passionate about clean code and mentoring junior developers.\n\nI would welcome the chance to discuss how my technical expertise and leadership skills align with your team's goals.\n\nBest regards,\n[Your Name]",
    },
    {
      id: "customer-service",
      title: "Customer Service Representative",
      category: "Customer Service",
      level: "Mid Level",
      content: "Dear Hiring Team,\n\nI am applying for the Customer Service Representative position with enthusiasm. With 3 years of experience in high-volume call centers, I have developed strong problem-solving skills and a commitment to customer satisfaction.\n\nAt [Previous Company], I maintained a 98% customer satisfaction rating and was recognized as 'Employee of the Month' twice. I am adept at handling difficult situations with patience and empathy.\n\nI am eager to bring my dedication to excellence to [Company Name] and help maintain your high standards of service.\n\nSincerely,\n[Your Name]",
    },
    {
      id: "project-manager",
      title: "Project Manager",
      category: "Management",
      level: "Senior",
      content: "Dear [Hiring Manager],\n\nI am writing to apply for the Project Manager role at [Company Name]. With a PMP certification and 5 years of experience managing cross-functional teams, I am confident in my ability to deliver projects on time and within budget.\n\nMy experience includes managing budgets of over $500k and leading teams of 10+ members. I excel at stakeholder communication and risk management.\n\nI look forward to discussing how my project management skills can contribute to the success of [Company Name].\n\nBest regards,\n[Your Name]",
    },
    {
      id: "nurse",
      title: "Registered Nurse",
      category: "Healthcare",
      level: "Mid Level",
      content: "Dear [Hiring Manager],\n\nI am writing to express my interest in the Registered Nurse position at [Hospital Name]. With 4 years of experience in acute care settings, I am dedicated to providing compassionate and high-quality patient care.\n\nI am skilled in patient assessment, medication administration, and collaborating with interdisciplinary teams. I am committed to continuous learning and professional development.\n\nThank you for your time and consideration. I hope to have the opportunity to join your team.\n\nSincerely,\n[Your Name]",
    },
    {
      id: "teacher",
      title: "Elementary Teacher",
      category: "Education",
      level: "Entry Level",
      content: "Dear Principal [Name],\n\nI am thrilled to apply for the Elementary Teacher position at [School Name]. As a recent graduate with a Bachelor's in Education and a passion for fostering a love of learning, I am excited about the possibility of joining your faculty.\n\nDuring my student teaching, I developed engaging lesson plans and created a positive classroom environment. I am eager to bring my enthusiasm and dedication to your school.\n\nI look forward to the possibility of discussing my application with you.\n\nSincerely,\n[Your Name]",
    },
  ];

  const filteredExamples = examples.filter((ex) =>
    ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this into the cover letter builder.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professional <span className="text-primary">Cover Letter</span> Examples
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Browse our collection of cover letter examples for every industry and career level. Copy, edit, and make them your own.
              </p>

              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search by job title or industry..."
                  className="pl-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExamples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-none shadow-md">
                    <CardContent className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {example.category}
                        </Badge>
                        <Badge variant="outline" className="text-gray-500">
                          {example.level}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {example.title}
                      </h3>

                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 font-mono leading-relaxed h-48 overflow-hidden relative group cursor-pointer" onClick={() => handleCopy(example.content, example.id)}>
                        {example.content}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-primary font-medium">Click to copy</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleCopy(example.content, example.id)}
                      >
                        {copiedId === example.id ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Text
                          </>
                        )}
                      </Button>
                      <Link href="/cover-letter-builder">
                        <Button className="flex-1 gap-2">
                          Use Template <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredExamples.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No examples found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Your Cover Letter in Minutes</h2>
            <p className="text-lg text-gray-600 mb-8">
              Don't start from scratch. Use our AI-powered builder to create a personalized cover letter that matches your resume.
            </p>
            <Link href="/cover-letter-builder">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Build My Cover Letter <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
