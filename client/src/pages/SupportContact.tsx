import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, MessageSquare, Clock, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SupportContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-600">
              Have questions about our resume builder? Need help with your account?
              Our team is here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Side Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Email Us</p>
                      <p className="text-sm text-slate-600 mb-1">For general inquiries</p>
                      <a href="mailto:support@resumeguru.example" className="text-blue-600 text-sm hover:underline">
                        support@resumeguru.example
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Support Hours</p>
                      <p className="text-sm text-slate-600">Monday - Friday</p>
                      <p className="text-sm text-slate-600">9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Office</p>
                      <p className="text-sm text-slate-600">123 Resume Street</p>
                      <p className="text-sm text-slate-600">New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 p-6 rounded-2xl shadow-sm text-white">
                <h3 className="text-lg font-bold mb-2">Check our FAQ</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Find quick answers to common questions about billing, templates, and more.
                </p>
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Visit Help Center
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      required
                      className="min-h-[150px] bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <Button type="submit" disabled={sending} size="lg" className="w-full md:w-auto min-w-[150px]">
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <MessageSquare className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
