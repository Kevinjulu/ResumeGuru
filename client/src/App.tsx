import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
const TemplatesResumes = React.lazy(() => import("@/pages/TemplatesResumes"));
const TemplatesResumesPdf = React.lazy(() => import("@/pages/TemplatesResumesPdf"));
const TemplatesResumesWord = React.lazy(() => import("@/pages/TemplatesResumesWord"));
const ExamplesResumes = React.lazy(() => import("@/pages/ExamplesResumes"));
const GuidesResumeFormat = React.lazy(() => import("@/pages/GuidesResumeFormat"));
const GuidesResumeWriting = React.lazy(() => import("@/pages/GuidesResumeWriting"));
const TemplatesCoverLetters = React.lazy(() => import("@/pages/TemplatesCoverLetters"));
const TemplatesCoverLettersWord = React.lazy(() => import("@/pages/TemplatesCoverLettersWord"));
const ExamplesCoverLetters = React.lazy(() => import("@/pages/ExamplesCoverLetters"));
const GuidesCoverLetter = React.lazy(() => import("@/pages/GuidesCoverLetter"));
const TemplatesAtsFriendly = React.lazy(() => import("@/pages/TemplatesAtsFriendly"));
const TemplatesCategories = React.lazy(() => import("@/pages/TemplatesCategories"));
const ExamplesIndustry = React.lazy(() => import("@/pages/ExamplesIndustry"));
const BlogResumeHelp = React.lazy(() => import("@/pages/BlogResumeHelp"));
const BlogCoverLetterHelp = React.lazy(() => import("@/pages/BlogCoverLetterHelp"));
const BlogJobSearch = React.lazy(() => import("@/pages/BlogJobSearch"));
const BlogSpecializedGuides = React.lazy(() => import("@/pages/BlogSpecializedGuides"));
const SupportFaq = React.lazy(() => import("@/pages/SupportFaq"));
const SupportContact = React.lazy(() => import("@/pages/SupportContact"));
const SupportBilling = React.lazy(() => import("@/pages/SupportBilling"));
const HelpCenter = React.lazy(() => import("@/pages/HelpCenter"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
const AboutUs = React.lazy(() => import("@/pages/AboutUs"));
const Careers = React.lazy(() => import("@/pages/Careers"));
const Press = React.lazy(() => import("@/pages/Press"));
const CareerBlog = React.lazy(() => import("@/pages/CareerBlog"));

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
      <Route path="/templates/resumes" component={TemplatesResumes} />
      <Route path="/templates/resumes/pdf" component={TemplatesResumesPdf} />
      <Route path="/templates/resumes/word" component={TemplatesResumesWord} />
      <Route path="/examples/resumes" component={ExamplesResumes} />
      <Route path="/guides/resume-format" component={GuidesResumeFormat} />
      <Route path="/guides/resume-writing" component={GuidesResumeWriting} />
      <Route path="/templates/cover-letters" component={TemplatesCoverLetters} />
      <Route path="/templates/cover-letters/word" component={TemplatesCoverLettersWord} />
      <Route path="/examples/cover-letters" component={ExamplesCoverLetters} />
      <Route path="/guides/cover-letter" component={GuidesCoverLetter} />
      <Route path="/templates/ats-friendly" component={TemplatesAtsFriendly} />
      <Route path="/templates/categories" component={TemplatesCategories} />
      <Route path="/examples/industry" component={ExamplesIndustry} />
      <Route path="/blog" component={CareerBlog} />
      <Route path="/blog/resume-help" component={BlogResumeHelp} />
      <Route path="/blog/cover-letter-help" component={BlogCoverLetterHelp} />
      <Route path="/blog/job-search" component={BlogJobSearch} />
      <Route path="/blog/specialized-guides" component={BlogSpecializedGuides} />
      <Route path="/support/faq" component={SupportFaq} />
      <Route path="/faq" component={SupportFaq} />
      <Route path="/support/contact" component={SupportContact} />
      <Route path="/contact" component={SupportContact} />
      <Route path="/support/billing" component={SupportBilling} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/about" component={AboutUs} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Suspense fallback={<div>Loading...</div>}>
        <Router />
      </Suspense>
    </TooltipProvider>
  );
}

export default App;
