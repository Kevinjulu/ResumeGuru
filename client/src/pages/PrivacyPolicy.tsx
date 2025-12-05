import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: December 5, 2025</p>
                </div>

                <div className="prose prose-blue max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to ResumeGuru ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services (collectively, "Services"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our Services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information when you register or make a purchase.</li>
                                <li><strong>Resume Data:</strong> Employment history, education, skills, and other information you input into our resume builder.</li>
                                <li><strong>Communications:</strong> Content of messages you send to our support team.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Provide, maintain, and improve our Services.</li>
                            <li>Process transactions and send related information, including confirmations and invoices.</li>
                            <li>Send you technical notices, updates, security alerts, and support messages.</li>
                            <li>Respond to your comments, questions, and customer service requests.</li>
                            <li>Communicate with you about products, services, offers, and events.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal information, such as:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Accessing, correcting, or deleting your personal information.</li>
                            <li>Objecting to or restricting processing of your personal information.</li>
                            <li>Data portability.</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            To exercise these rights, please contact us at privacy@resumeguru.com.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <strong>Email:</strong> privacy@resumeguru.com
                            <br />
                            <strong>Address:</strong> 123 Resume Street, Career City, CA 90210
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
