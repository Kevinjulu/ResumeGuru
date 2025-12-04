import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SupportContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // Example: send to /api/support — implement server endpoint as needed
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setName("");
      setEmail("");
      setMessage("");
      // Optionally show toast (Toaster already used globally)
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
        <p className="text-gray-600 mb-6">Need help? Send us a message and our support team will get back to you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>

          <div>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>

        <section className="mt-8 text-sm text-gray-600">
          <h2 className="font-medium mb-2">Other ways to reach us</h2>
          <p>Email: <a className="text-primary" href="mailto:support@resumeguru.example">support@resumeguru.example</a></p>
          <p>Response time: 1 business day</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
