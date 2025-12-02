import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center p-8">
          <CardContent className="space-y-6 pt-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">404</span>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <p className="text-gray-600">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button className="gap-2" data-testid="button-go-home">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="outline" className="gap-2" data-testid="button-build-resume">
                  <FileText className="w-4 h-4" />
                  Build Resume
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
