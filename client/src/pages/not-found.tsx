import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, FileText, Compass, Search, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl w-full"
        >
          <Card className="p-8 md:p-12 text-center shadow-2xl border-2">
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl"></div>
                <h1 className="relative text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  404
                </h1>
              </div>
            </motion.div>

            {/* Error Icon */}
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                <Compass className="w-10 h-10 text-primary" />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Oops! The page you're looking for seems to have wandered off.
                Let's get you back on track.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link href="/">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/25" data-testid="button-go-home">
                  <Home className="w-5 h-5" />
                  Go Home
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-build-resume">
                  <FileText className="w-5 h-5" />
                  Build Resume
                </Button>
              </Link>
            </motion.div>

            {/* Additional Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4">Or explore these popular pages:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/templates">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    <Search className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    <FileText className="w-4 h-4 mr-2" />
                    Resources
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
