import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useSession } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";

const Home = React.lazy(() => import("@/pages/Home"));
const Templates = React.lazy(() => import("@/pages/Templates"));
const Pricing = React.lazy(() => import("@/pages/Pricing"));
const Resources = React.lazy(() => import("@/pages/Resources"));
const Builder = React.lazy(() => import("@/pages/Builder"));
const NotFound = React.lazy(() => import("@/pages/not-found"));
const LoginPage = React.lazy(() => import("@/pages/Login"));
const RegisterPage = React.lazy(() => import("@/pages/Register"));
const ForgotPasswordPage = React.lazy(() => import("@/pages/ForgotPassword"));
const ResetPasswordPage = React.lazy(() => import("@/pages/ResetPassword"));
const CVs = React.lazy(() => import("@/pages/CVs"));
const Account = React.lazy(() => import("@/pages/Account"));
const MyResumes = React.lazy(() => import("@/pages/MyResumes")); // Lazy load MyResumes
const CoverLetterBuilder = React.lazy(() => import("@/pages/CoverLetterBuilder")); // Lazy load CoverLetterBuilder
const MyCoverLetters = React.lazy(() => import("@/pages/MyCoverLetters")); // Lazy load MyCoverLetters
const CoverLetterTemplates = React.lazy(() => import("@/pages/CoverLetterTemplates"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));

const convexUrl = (import.meta.env.VITE_CONVEX_URL as string | undefined) || undefined;
let convex: ReturnType<typeof ConvexReactClient> | null = null;
if (convexUrl) {
  try {
    convex = new ConvexReactClient(convexUrl as string);
  } catch (e) {
    // Don't throw during module initialization — handle at render time
    console.warn("ConvexReactClient initialization failed:", e);
    convex = null;
  }
} else {
  // Informative warning for missing config during development
  // overlay plugin shows this message; keep a console warning instead
  // so the app does not crash when convex isn't configured.
  // The presence of this env var is required for Convex features.
  console.warn("VITE_CONVEX_URL is not set — Convex client unavailable.");
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/templates" component={Templates} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/resources" component={Resources} />
      <Route path="/builder" component={Builder} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password/:token" component={ResetPasswordPage} />
      <Route path="/cvs" component={CVs} />
      <Route path="/account" component={Account} />
      <Route path="/my-resumes" component={MyResumes} /> // Add route for MyResumes
      <Route path="/cover-letter-builder" component={CoverLetterBuilder} /> // Add route for CoverLetterBuilder
      <Route path="/my-cover-letters" component={MyCoverLetters} /> // Add route for MyCoverLetters
      <Route path="/cover-letter-templates" component={CoverLetterTemplates} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  function AuthMaintenance() {
    const { isSignedIn, getToken } = useAuth();
    const { session } = useSession();

    React.useEffect(() => {
      if (!isSignedIn) return;

      let cancelled = false;
      const refresh = async () => {
        try {
          await getToken({ template: "convex" });
        } catch (e: any) {
          const msg = String(e?.message || "");
          if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("jwt")) {
            try {
              await session?.reload();
              await getToken({ template: "convex" });
            } catch (_) {
              /* swallow */
            }
          }
        }
      };

      // Initial refresh, then periodic preemptive refresh
      refresh();
      const id = setInterval(refresh, 4 * 60 * 1000);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }, [isSignedIn, getToken, session]);

    return null;
  }

  // If Convex client isn't available, render app without provider
  if (!convex) {
    return (
      <TooltipProvider>
        <Toaster />
        <div style={{ padding: 16 }}>
          <strong style={{ color: "#b45309" }}>
            Convex client not configured — some features are disabled.
          </strong>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Router />
        </Suspense>
        <AuthMaintenance />
      </TooltipProvider>
    );
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <Router />
        </Suspense>
        <AuthMaintenance />
      </TooltipProvider>
    </ConvexProviderWithClerk>
  );
}

export default App;
