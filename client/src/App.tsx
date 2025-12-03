import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
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

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

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
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<div>Loading...</div>}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default App;
