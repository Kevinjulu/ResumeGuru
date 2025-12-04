import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function GuidesResumeWriting() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Resume Writing Tips</h1>
        <p className="text-gray-600">Helpful tips for writing an effective resume.</p>
      </main>
      <Footer />
    </div>
  );
}
