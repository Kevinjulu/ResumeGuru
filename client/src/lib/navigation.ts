import { FileText, Briefcase, GraduationCap, BookOpen, DollarSign, ListRestart, MailOpen } from "lucide-react";

export type NavSubItem = {
  label: string;
  href: string;
  icon?: any;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  icon?: any;
  items?: NavSubItem[];
};

export const navItems: NavItem[] = [
  {
    label: "Resumes",
    items: [
      { label: "Resume Builder", href: "/builder", icon: FileText, description: "Build your resume step by step" },
      { label: "Resume Templates", href: "/templates/resumes", icon: BookOpen, description: "All resume templates" },
      { label: "PDF Resume Templates", href: "/templates/resumes/pdf", icon: FileText, description: "Downloadable PDF templates" },
      { label: "Word Resume Templates", href: "/templates/resumes/word", icon: FileText, description: "MS Word resume templates" },
      { label: "Resume Examples by Job Title", href: "/examples/resumes", icon: GraduationCap, description: "Role-specific resume examples" },
      { label: "Resume Format Guides", href: "/guides/resume-format", icon: BookOpen, description: "Formatting & layout guides" },
      { label: "Resume Writing Tips", href: "/guides/resume-writing", icon: Briefcase, description: "Writing advice and best practices" },
    ],
  },
  {
    label: "Cover Letters",
    items: [
      { label: "Cover Letter Builder", href: "/cover-letter-builder", icon: Briefcase, description: "Create matching cover letters" },
      { label: "Cover Letter Templates", href: "/templates/cover-letters", icon: BookOpen, description: "Cover letter templates" },
      { label: "Word Cover Letter Templates", href: "/templates/cover-letters/word", icon: FileText, description: "MS Word cover letter templates" },
      { label: "Cover Letter Examples", href: "/examples/cover-letters", icon: GraduationCap, description: "Cover letter examples" },
      { label: "Writing Guides & Tips", href: "/guides/cover-letter", icon: BookOpen, description: "Cover letter writing tips" },
    ],
  },
  {
    label: "Templates",
    items: [
      { label: "Resume Templates (all formats)", href: "/templates", icon: BookOpen, description: "All resume & cover letter templates" },
      { label: "Cover Letter Templates", href: "/templates/cover-letters", icon: BookOpen, description: "Cover letter templates" },
      { label: "ATS-Friendly Templates", href: "/templates/ats-friendly", icon: ListRestart, description: "Optimized for applicant tracking systems" },
      { label: "Modern / Creative / Simple", href: "/templates/categories", icon: BookOpen, description: "Browse by style" },
    ],
  },
  {
    label: "Examples",
    items: [
      { label: "Resume Examples", href: "/examples/resumes", icon: GraduationCap, description: "Examples by role and industry" },
      { label: "Cover Letter Examples", href: "/examples/cover-letters", icon: GraduationCap, description: "Cover letter examples" },
      { label: "Industry & Role Specific", href: "/examples/industry", icon: Briefcase, description: "Examples organized by industry" },
    ],
  },
  {
    label: "Blog / Career Advice",
    items: [
      { label: "Resume Help Articles", href: "/blog/resume-help", icon: BookOpen, description: "Career and resume articles" },
      { label: "Cover Letter Help Articles", href: "/blog/cover-letter-help", icon: BookOpen, description: "Cover letter advice" },
      { label: "Job Search Tips", href: "/blog/job-search", icon: BookOpen, description: "Job hunt strategies" },
      { label: "Specialized Guides", href: "/blog/specialized-guides", icon: GraduationCap, description: "Guides for specific roles" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "FAQ", href: "/support/faq", icon: ListRestart, description: "Frequently asked questions" },
      { label: "Contact Support", href: "/support/contact", icon: MailOpen, description: "Get in touch with our team" },
      { label: "Billing & Subscription Help", href: "/support/billing", icon: DollarSign, description: "Manage billing and subscriptions" },
    ],
  },
  { label: "My Resumes", href: "/my-resumes", icon: ListRestart },
  { label: "My Cover Letters", href: "/my-cover-letters", icon: MailOpen },
  { label: "Pricing", href: "/pricing" },
];
