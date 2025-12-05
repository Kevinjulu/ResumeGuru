import { Loader, FullPageLoader, InlineLoader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

/**
 * Loader Showcase Component
 * 
 * A comprehensive demonstration of all loader variants and their use cases.
 * This can be rendered at /loader-showcase for testing and visual validation.
 */

export function LoaderShowcase() {
  const [showFullPage, setShowFullPage] = useState(false);

  if (showFullPage) {
    return (
      <div>
        <FullPageLoader text="Full Page Loader Demo" />
        <button
          onClick={() => setShowFullPage(false)}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Close Demo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Loader Component Showcase</h1>
          <p className="text-xl text-gray-600">
            Modern loading indicators for ResumeGuru - Brand aligned with orange &amp; blue
          </p>
        </div>

        {/* Size Variants */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Small Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <Loader size="sm" text="Small" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medium Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <Loader size="md" text="Medium" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Large Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <Loader size="lg" text="Large" />
            </CardContent>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Loading State Example */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Page Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Use this when fetching page data or initializing components.
                </p>
                <div className="flex items-center justify-center min-h-[150px] bg-gray-50 rounded-lg">
                  <Loader size="md" text="Loading resumes..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Button Loading State */}
          <Card>
            <CardHeader>
              <CardTitle>Button Loading State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Use inline loader when a button is processing.
                </p>
                <div className="flex gap-3">
                  <Button disabled className="gap-2">
                    <InlineLoader /> Submitting...
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Page Overlay */}
          <Card>
            <CardHeader>
              <CardTitle>Full Page Overlay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Covers entire viewport with semi-transparent background.
                </p>
                <Button onClick={() => setShowFullPage(true)} className="w-full">
                  Show Full Page Loader
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Without Text */}
          <Card>
            <CardHeader>
              <CardTitle>Loader Without Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  For compact layouts where text would take too much space.
                </p>
                <div className="flex items-center justify-center min-h-[150px] gap-4">
                  <Loader size="sm" showText={false} />
                  <Loader size="md" showText={false} />
                  <Loader size="lg" showText={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Text Examples */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Custom Loading Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center min-h-[120px] bg-gray-50 rounded-lg">
                <Loader text="Processing resume..." />
              </div>
              <div className="flex items-center justify-center min-h-[120px] bg-gray-50 rounded-lg">
                <Loader text="Generating cover letter..." />
              </div>
              <div className="flex items-center justify-center min-h-[120px] bg-gray-50 rounded-lg">
                <Loader text="Uploading document..." />
              </div>
              <div className="flex items-center justify-center min-h-[120px] bg-gray-50 rounded-lg">
                <Loader text="Building your account..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Brand Color Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Primary Colors Used</h3>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <div className="w-24 h-24 rounded-lg bg-[#EA723C]"></div>
                    <p className="text-sm font-mono text-gray-600">#EA723C</p>
                    <p className="text-xs text-gray-500">ResumeGuru Orange</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-24 rounded-lg bg-[#3B82F6]"></div>
                    <p className="text-sm font-mono text-gray-600">#3B82F6</p>
                    <p className="text-xs text-gray-500">ResumeGuru Blue</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-[#EA723C] to-[#3B82F6]"></div>
                    <p className="text-sm font-mono text-gray-600">Gradient</p>
                    <p className="text-xs text-gray-500">Orange → Blue</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Animation Speed</h3>
                <p className="text-sm text-gray-600 mb-3">
                  The loaders use smooth 2-3 second animations that loop continuously:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Small loaders: ~1.4s per cycle</li>
                  <li>• Medium loaders: ~2s per cycle (default)</li>
                  <li>• Large loaders: ~3s per cycle</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Integration Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Import the component</h3>
                <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                  {`import { Loader, FullPageLoader, InlineLoader } from "@/components/common/Loader";`}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Use in your component</h3>
                <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                  {`// Page loading
if (isLoading) return <Loader size="lg" text="Loading..." />;

// Button loading
<Button disabled><InlineLoader /> Submitting...</Button>

// Full page overlay
<FullPageLoader text="Processing..." />`}
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. CSS is automatically imported</h3>
                <p className="text-sm text-gray-600">
                  The loader component automatically imports the CSS from <code className="bg-gray-100 px-2 py-1 rounded">src/styles/loader.css</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="mb-2">
            Modern loader component for ResumeGuru
          </p>
          <p className="text-sm">
            Supports all modern browsers • Accessible • GPU accelerated
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoaderShowcase;
