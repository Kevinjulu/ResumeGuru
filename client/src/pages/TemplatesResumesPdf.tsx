import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TemplatesResumesPdf() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">PDF Resume Templates</h1>
        <p className="text-gray-600">Downloadable PDF-ready resume templates.</p>
      </main>
      <Footer />
    </div>
  );
}
