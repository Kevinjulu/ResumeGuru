import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calendar, User, Tag, Mail } from "lucide-react";
import { Link } from "wouter";

export default function CareerBlog() {
    const featuredPost = {
        id: 1,
        title: "The Future of Work: AI and Your Career",
        excerpt: "How artificial intelligence is reshaping the job market and what you can do to stay ahead of the curve. Learn about the skills that will be in high demand.",
        author: "Sarah Johnson",
        date: "May 15, 2024",
        category: "Career Advice",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
    };

    const posts = [
        {
            id: 2,
            title: "10 Common Resume Mistakes to Avoid",
            excerpt: "Are you making these simple errors that could cost you the interview? Find out how to fix them.",
            author: "Mike Chen",
            date: "May 12, 2024",
            category: "Resume Tips",
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80",
        },
        {
            id: 3,
            title: "Mastering the Behavioral Interview",
            excerpt: "Learn the STAR method and how to answer 'Tell me about a time when...' questions with confidence.",
            author: "Emily Davis",
            date: "May 10, 2024",
            category: "Interview Prep",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        },
        {
            id: 4,
            title: "How to Negotiate Your Salary",
            excerpt: "Don't leave money on the table. Expert tips on how to research your worth and ask for more.",
            author: "Alex Thompson",
            date: "May 08, 2024",
            category: "Salary & Benefits",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
        },
        {
            id: 5,
            title: "Networking in the Digital Age",
            excerpt: "How to build meaningful professional connections online using LinkedIn and other platforms.",
            author: "Sarah Johnson",
            date: "May 05, 2024",
            category: "Networking",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
        },
        {
            id: 6,
            title: "Writing a Cover Letter That Stands Out",
            excerpt: "Stop sending generic cover letters. Learn how to write a personalized letter that gets read.",
            author: "Mike Chen",
            date: "May 01, 2024",
            category: "Cover Letters",
            image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80",
        },
    ];

    const categories = ["All", "Resume Tips", "Interview Prep", "Career Advice", "Salary & Benefits", "Networking"];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                The Career <span className="text-primary">Blog</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                                Expert advice, industry insights, and practical tips to help you navigate your career journey.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Post */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 text-white max-w-3xl">
                                    <Badge className="mb-4 bg-primary hover:bg-primary/90 text-white border-none">
                                        {featuredPost.category}
                                    </Badge>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm text-gray-300">
                                        <span className="flex items-center gap-2">
                                            <User className="w-4 h-4" /> {featuredPost.author}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> {featuredPost.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Categories & Posts */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-12 justify-center">
                            {categories.map((cat, i) => (
                                <Button
                                    key={i}
                                    variant={i === 0 ? "default" : "outline"}
                                    className="rounded-full"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>

                        {/* Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden group">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-900">
                                                    {post.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex-grow">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {post.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {post.author}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0">
                                            <Button variant="link" className="p-0 h-auto text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                                Read Article <ArrowRight className="ml-1 w-4 h-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Button variant="outline" size="lg" className="px-8">Load More Articles</Button>
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="py-20 bg-primary text-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <Mail className="w-12 h-12 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Get the latest career advice, resume tips, and job market insights delivered straight to your inbox.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12"
                            />
                            <Button variant="secondary" size="lg" className="h-12 px-8">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
