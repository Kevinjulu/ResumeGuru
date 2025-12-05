import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Newspaper, Mail } from "lucide-react";

export default function Press() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Newsroom
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                            Latest news, updates, and resources for media professionals.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" className="gap-2">
                                <Download className="w-4 h-4" /> Download Press Kit
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                                <Mail className="w-4 h-4" /> Contact Press Team
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Recent News Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-10">Recent News</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* News Item 1 */}
                            <Card>
                                <CardHeader>
                                    <div className="text-sm text-blue-600 font-medium mb-2">December 1, 2025</div>
                                    <CardTitle className="text-xl">ResumeGuru Reaches 1 Million Users</CardTitle>
                                    <CardDescription>
                                        Celebrating a major milestone in our mission to help job seekers worldwide.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                                        Read More <Newspaper className="w-4 h-4" />
                                    </a>
                                </CardContent>
                            </Card>

                            {/* News Item 2 */}
                            <Card>
                                <CardHeader>
                                    <div className="text-sm text-blue-600 font-medium mb-2">November 15, 2025</div>
                                    <CardTitle className="text-xl">Launching AI-Powered Cover Letter Builder</CardTitle>
                                    <CardDescription>
                                        New feature helps users generate personalized cover letters in seconds.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                                        Read More <Newspaper className="w-4 h-4" />
                                    </a>
                                </CardContent>
                            </Card>

                            {/* News Item 3 */}
                            <Card>
                                <CardHeader>
                                    <div className="text-sm text-blue-600 font-medium mb-2">October 30, 2025</div>
                                    <CardTitle className="text-xl">ResumeGuru Partners with Major Universities</CardTitle>
                                    <CardDescription>
                                        Providing students with free access to premium career tools.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a href="#" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                                        Read More <Newspaper className="w-4 h-4" />
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Media Contact Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Media Contact</h2>
                        <p className="text-lg text-slate-600 mb-8">
                            For press inquiries, interviews, or additional assets, please contact our media team.
                        </p>
                        <div className="bg-white p-8 rounded-xl border border-slate-200 inline-block text-left">
                            <p className="font-bold text-lg mb-2">Sarah Jenkins</p>
                            <p className="text-slate-600 mb-1">Head of Communications</p>
                            <a href="mailto:press@resumeguru.example" className="text-blue-600 hover:underline block mb-1">
                                press@resumeguru.example
                            </a>
                            <p className="text-slate-600">+1 (555) 123-4567</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
