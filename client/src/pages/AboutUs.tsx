import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, Target, Heart } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative py-20 bg-slate-50 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Empowering Careers, <span className="text-primary">One Resume at a Time</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                            We're on a mission to help job seekers land their dream jobs with professional, AI-powered resume building tools.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                                <p className="text-slate-600">
                                    To democratize access to professional career tools and help everyone present their best self to potential employers.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Who We Are</h3>
                                <p className="text-slate-600">
                                    A passionate team of developers, designers, and career experts working together to build the future of job searching.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                                    <Heart className="w-6 h-6 text-pink-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Values</h3>
                                <p className="text-slate-600">
                                    We believe in transparency, user privacy, and putting the success of our users above everything else.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                            <p className="text-lg text-slate-600 mb-6">
                                ResumeGuru started with a simple idea: writing a resume shouldn't be a struggle. We saw talented people missing out on opportunities simply because their resumes didn't reflect their true potential.
                            </p>
                            <p className="text-lg text-slate-600">
                                Today, we've helped thousands of job seekers create professional resumes in minutes, not hours. We're constantly innovating with AI and new designs to stay ahead of industry trends.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Build Your Future?</h2>
                        <p className="text-xl text-slate-600 mb-10">
                            Join thousands of successful job seekers who have used ResumeGuru to land their next role.
                        </p>
                        <Link href="/templates">
                            <Button size="lg" className="h-12 px-8 text-lg">
                                Build Your Resume <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
