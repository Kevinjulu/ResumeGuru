import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, HelpCircle, MessageCircle, FileText, CreditCard, Shield } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function HelpCenter() {
    const categories = [
        {
            icon: FileText,
            title: "Resume & Cover Letter",
            description: "Guides on creating, editing, and downloading your documents.",
            link: "/guides/resume-writing",
        },
        {
            icon: CreditCard,
            title: "Billing & Subscriptions",
            description: "Manage your plan, payments, and invoices.",
            link: "/support/billing",
        },
        {
            icon: Shield,
            title: "Account & Security",
            description: "Update your profile, password, and security settings.",
            link: "/account",
        },
        {
            icon: HelpCircle,
            title: "Frequently Asked Questions",
            description: "Quick answers to common questions.",
            link: "/faq",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="bg-primary py-20 text-center text-white">
                    <div className="max-w-4xl mx-auto px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            How can we help you?
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="max-w-2xl mx-auto relative"
                        >
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search for answers..."
                                className="w-full pl-12 py-6 text-lg text-gray-900 bg-white rounded-full shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-white/50"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="max-w-7xl mx-auto px-4 py-16 -mt-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <Link href={category.link}>
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md">
                                        <CardHeader>
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                <category.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl">{category.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">
                                                {category.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Our support team is available 24/7 to assist you with any issues.
                    </p>
                    <Link href="/support/contact">
                        <Button size="lg" className="gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Contact Support
                        </Button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
