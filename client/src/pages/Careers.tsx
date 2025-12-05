import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Zap, Smile, Coffee } from "lucide-react";

export default function Careers() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge className="mb-6 bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-1.5 text-sm">We're Hiring</Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Join the ResumeGuru Team
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                            Help us build the future of career development. We're looking for passionate individuals to join our remote-first team.
                        </p>
                        <Button size="lg" className="h-12 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100">
                            View Open Positions
                        </Button>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Work With Us?</h2>
                            <p className="text-lg text-slate-600">We take care of our team so they can take care of our users.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center p-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Fast-Paced</h3>
                                <p className="text-slate-600 text-sm">Work on challenging problems and ship code daily.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Smile className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Work-Life Balance</h3>
                                <p className="text-slate-600 text-sm">Flexible hours and unlimited PTO policy.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Career Growth</h3>
                                <p className="text-slate-600 text-sm">Mentorship and learning budget for every employee.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Coffee className="w-7 h-7 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Remote First</h3>
                                <p className="text-slate-600 text-sm">Work from anywhere in the world.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions Section */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Open Positions</h2>

                        <div className="space-y-4">
                            {/* Job Card 1 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Senior Full Stack Engineer</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                        <span>Engineering</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                        <span>•</span>
                                        <span>Full-time</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>

                            {/* Job Card 2 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Product Designer</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                        <span>Design</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                        <span>•</span>
                                        <span>Full-time</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>

                            {/* Job Card 3 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Customer Success Manager</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                        <span>Support</span>
                                        <span>•</span>
                                        <span>Remote</span>
                                        <span>•</span>
                                        <span>Full-time</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-slate-600">
                                Don't see a role that fits? <a href="mailto:careers@resumeguru.example" className="text-blue-600 font-medium hover:underline">Email us</a> your resume.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
