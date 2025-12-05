/**
 * Loader Component Usage Guide
 * 
 * This file demonstrates all available loader variants for the ResumeGuru application.
 * The loaders are designed to match the brand colors: Orange (#EA723C) and Blue (#3B82F6)
 */

import React from "react";
import { Loader, FullPageLoader, InlineLoader } from "@/components/common/Loader";

/**
 * BASIC USAGE
 */

// 1. Standard loader with default settings
export function Example1() {
  return <Loader />;
}

// 2. Loader with custom text
export function Example2() {
  return <Loader text="Processing your resume..." />;
}

// 3. Loader without text
export function Example3() {
  return <Loader showText={false} />;
}

/**
 * SIZE VARIANTS
 */

// Small loader - useful for inline usage, buttons, badges
export function SmallLoader() {
  return <Loader size="sm" text="Loading" />;
}

// Medium loader (default)
export function MediumLoader() {
  return <Loader size="md" text="Loading" />;
}

// Large loader - for page loading states
export function LargeLoader() {
  return <Loader size="lg" text="Loading" />;
}

/**
 * FULL PAGE LOADER
 * 
 * Use this when the entire page needs to load (like authentication, main data fetch)
 * It includes:
 * - Semi-transparent white background
 * - Backdrop blur
 * - Centered content
 * - Z-index 50 (won't be covered by most elements)
 */

export function FullPageExample() {
  return <FullPageLoader text="Loading your dashboard..." />;
}

/**
 * INLINE LOADER
 * 
 * Use this for smaller spaces like:
 * - Button loading states
 * - Form submission
 * - Card loading states
 * - Inline content loading
 */

export function InlineLoaderExample() {
  return (
    <button disabled>
      <InlineLoader /> Submit Form
    </button>
  );
}

/**
 * BUTTON WITH LOADER
 * 
 * Example of using the inline loader in a button
 */

export function ButtonWithLoader() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Do something async
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
    >
      {isLoading && <InlineLoader />}
      {isLoading ? "Processing..." : "Click Me"}
    </button>
  );
}

/**
 * CARD LOADING STATE
 * 
 * Use when a card's content is loading
 */

export function CardLoadingState() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="p-6 border rounded-lg">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader size="md" text="Loading resume details..." />
        </div>
      ) : (
        <div>Card content here</div>
      )}
    </div>
  );
}

/**
 * CSS CUSTOMIZATION GUIDE
 * 
 * The loader CSS includes multiple variables you can override:
 * 
 * Custom sizing:
 * .loader-md {
 *   width: 64px;
 *   height: 64px;
 * }
 * 
 * Custom colors:
 * .loader-bar {
 *   background: linear-gradient(
 *     90deg,
 *     #YOUR_COLOR_1 0%,
 *     #YOUR_COLOR_2 100%
 *   );
 * }
 * 
 * Custom animation speed:
 * .loader-bar {
 *   animation: barSlide 2s ease-in-out infinite; // Change 2s to your desired duration
 * }
 */

/**
 * ACCESSIBILITY NOTES
 * 
 * The loaders include:
 * - Clear visual feedback through animation
 * - Optional text labels for context
 * - Sufficient color contrast
 * - Smooth animations (60fps)
 * 
 * ARIA attributes are recommended when using these loaders:
 * 
 * <div role="status" aria-live="polite" aria-label="Loading">
 *   <Loader text="Loading..." />
 * </div>
 */

/**
 * PERFORMANCE TIPS
 * 
 * 1. Use CSS animations (which are GPU-accelerated)
 * 2. Minimize re-renders by memoizing loader components
 * 3. Avoid loading many loaders simultaneously
 * 4. Use the InlineLoader for buttons (smaller DOM footprint)
 * 5. Consider using Suspense boundaries with React for cleaner code
 */
