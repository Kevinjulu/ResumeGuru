import "@/styles/loader.css";

interface LoaderProps {
  /**
   * Size variant of the loader
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Loading text to display
   * @default "Loading"
   */
  text?: string;
  /**
   * Whether to show the loading text
   * @default true
   */
  showText?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Modern, branded loader component that fits the ResumeGuru design
 * Features animated gradient bars and smooth transitions
 */
export function Loader({
  size = "md",
  text = "Loading",
  showText = true,
  className = "",
}: LoaderProps) {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`loader loader-${size}`}>
        <div className="loader-content">
          <div className="loader-bar"></div>
        </div>
      </div>
      {showText && <p className={`loader-text loader-text-${size}`}>{text}</p>}
    </div>
  );
}

/**
 * Full-page loading overlay
 */
export function FullPageLoader({ text = "Loading" }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-6">
        <Loader size="lg" text={text} showText={true} />
      </div>
    </div>
  );
}

/**
 * Inline loader for smaller spaces (buttons, cards, etc)
 */
export function InlineLoader() {
  return <Loader size="sm" showText={false} />;
}
