import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume Templates with Tier Information (30 Total - 10 per tier)
export const resumeTemplates = [
    // ===== BASIC/FREE TIER (10 Templates) =====
    {
        id: "classic",
        name: "Classic",
        style: "professional",
        description: "Traditional two-column layout with navy sidebar",
        tier: "basic",
        thumbnail: "/classic_resume_template_1764893091386.png"
    },
    {
        id: "clean",
        name: "Clean",
        style: "professional",
        description: "Full-color sidebar with contact info and summary",
        tier: "basic",
        thumbnail: "/clean-resume-template-orange-hub.avif"
    },
    {
        id: "minimalist",
        name: "Minimalist",
        style: "simple",
        description: "Basic layout with unique skill bars",
        tier: "basic",
        thumbnail: "/minimalist-resume-template-blue-hub.webp"
    },
    {
        id: "chicago",
        name: "Chicago",
        style: "professional",
        description: "Basic design for formal industries",
        tier: "basic",
        thumbnail: "/chicago-resume-template-blue-hub.webp"
    },
    {
        id: "professional",
        name: "Professional",
        style: "professional",
        description: "Clean one-column format with clear sections",
        tier: "basic",
        thumbnail: "/professional_resume_template_1764893108505.png"
    },
    {
        id: "simple",
        name: "Simple",
        style: "simple",
        description: "No-frills ATS-optimized design",
        tier: "basic",
        thumbnail: "/simple_resume_template_1764893124089.png"
    },
    {
        id: "traditional",
        name: "Traditional",
        style: "professional",
        description: "Conservative business style for formal sectors",
        tier: "basic",
        thumbnail: "/traditional_resume_template_1764893142221.png"
    },
    {
        id: "essential",
        name: "Essential",
        style: "simple",
        description: "Minimalist modern approach with subtle accents",
        tier: "basic",
        thumbnail: "/essential_resume_template_1764893157213.png"
    },
    {
        id: "standard",
        name: "Standard",
        style: "professional",
        description: "Reliable professional format for any industry",
        tier: "basic",
        thumbnail: "/standard_resume_template_1764893186942.png"
    },
    {
        id: "basic-plus",
        name: "Basic Plus",
        style: "simple",
        description: "Enhanced basic with subtle modern touches",
        tier: "basic",
        thumbnail: "/basic_plus_resume_template_1764893202944.png"
    },

    // ===== PRO TIER (10 Templates) =====
    {
        id: "modern",
        name: "Modern",
        style: "modern",
        description: "Simple header with round headshot spot",
        tier: "pro",
        thumbnail: "/modern-resume-template-red-hub.avif"
    },
    {
        id: "corporate",
        name: "Corporate",
        style: "professional",
        description: "Bold full-color header with minimalist sidebar",
        tier: "pro",
        thumbnail: "/corporate-resume-template-red-hub.avif"
    },
    {
        id: "elegant",
        name: "Elegant",
        style: "creative",
        description: "Center-aligned with simple headshot at top",
        tier: "pro",
        thumbnail: "/elegant-resume-template-green-hub.avif"
    },
    {
        id: "2025",
        name: "2025",
        style: "modern",
        description: "Modern dark blue design for contemporary professionals",
        tier: "pro",
        thumbnail: "/2025-resume-builder-template-dark-blue.avif"
    },
    {
        id: "taj-mahal",
        name: "Taj Mahal",
        style: "professional",
        description: "Large sidebar for contact, summary, and education",
        tier: "pro",
        thumbnail: "/taj-mahal-resume-template-blue-hub.avif"
    },
    {
        id: "creative",
        name: "Creative",
        style: "creative",
        description: "Artistic design with unique sections for creative fields",
        tier: "pro",
        thumbnail: "/clean-resume-template-orange-hub.avif" // placeholder
    },
    {
        id: "bold",
        name: "Bold",
        style: "modern",
        description: "High-contrast modern design that stands out",
        tier: "pro",
        thumbnail: "/corporate-resume-template-red-hub.avif" // placeholder
    },
    {
        id: "vibrant",
        name: "Vibrant",
        style: "creative",
        description: "Colorful professional layout with energy",
        tier: "pro",
        thumbnail: "/elegant-resume-template-green-hub.avif" // placeholder
    },
    {
        id: "contemporary",
        name: "Contemporary",
        style: "modern",
        description: "Fresh modern approach for tech professionals",
        tier: "pro",
        thumbnail: "/2025-resume-builder-template-dark-blue.avif" // placeholder
    },
    {
        id: "dynamic",
        name: "Dynamic",
        style: "creative",
        description: "Energetic design with movement and flow",
        tier: "pro",
        thumbnail: "/modern-resume-template-red-hub.avif" // placeholder
    },

    // ===== PREMIUM TIER (10 Templates) =====
    {
        id: "advanced",
        name: "Advanced",
        style: "creative",
        description: "Modern bubbles for contact info and skills with headshot",
        tier: "premium",
        isPremium: true,
        thumbnail: "/advanced-resume-template-navy-orange-hub.avif"
    },
    {
        id: "majestic",
        name: "Majestic",
        style: "professional",
        description: "Elegant design with sophisticated layout",
        tier: "premium",
        isPremium: true,
        thumbnail: "/majestic-resume-template-green.avif"
    },
    {
        id: "executive",
        name: "Executive",
        style: "professional",
        description: "High-end professional design for C-suite positions",
        tier: "premium",
        isPremium: true,
        thumbnail: "/taj-mahal-resume-template-blue-hub.avif" // placeholder
    },
    {
        id: "prestige",
        name: "Prestige",
        style: "professional",
        description: "Luxury design with gold accents for senior roles",
        tier: "premium",
        isPremium: true,
        thumbnail: "/majestic-resume-template-green.avif" // placeholder
    },
    {
        id: "elite",
        name: "Elite",
        style: "professional",
        description: "Premium layout for senior leadership positions",
        tier: "premium",
        isPremium: true,
        thumbnail: "/advanced-resume-template-navy-orange-hub.avif" // placeholder
    },
    {
        id: "distinguished",
        name: "Distinguished",
        style: "professional",
        description: "Sophisticated multi-column executive format",
        tier: "premium",
        isPremium: true,
        thumbnail: "/corporate-resume-template-red-hub.avif" // placeholder
    },
    {
        id: "paramount",
        name: "Paramount",
        style: "professional",
        description: "Top-tier executive format with refined aesthetics",
        tier: "premium",
        isPremium: true,
        thumbnail: "/elegant-resume-template-green-hub.avif" // placeholder
    },
    {
        id: "supreme",
        name: "Supreme",
        style: "professional",
        description: "Ultimate professional design for top executives",
        tier: "premium",
        isPremium: true,
        thumbnail: "/2025-resume-builder-template-dark-blue.avif" // placeholder
    },
    {
        id: "premier",
        name: "Premier",
        style: "professional",
        description: "First-class layout with executive polish",
        tier: "premium",
        isPremium: true,
        thumbnail: "/taj-mahal-resume-template-blue-hub.avif" // placeholder
    },
    {
        id: "pinnacle",
        name: "Pinnacle",
        style: "professional",
        description: "Peak professional presentation for industry leaders",
        tier: "premium",
        isPremium: true,
        thumbnail: "/majestic-resume-template-green.avif" // placeholder
    },
] as const;

export type TemplateId = typeof resumeTemplates[number]["id"];
export type TemplateTier = "basic" | "pro" | "premium";

// CV Templates
export const cvTemplates = [
    { id: "classic", name: "Classic", style: "professional", description: "Traditional CV layout with clear sections" },
    { id: "modern-cv", name: "Modern", style: "modern", description: "Contemporary layout with strong headings" },
    { id: "creative-cv", name: "Creative", style: "creative", description: "Two-column layout with emphasis on skills", premium: true },
    { id: "minimal-cv", name: "Minimal", style: "simple", description: "Lightweight design focused on content" },
] as const;

export type CvTemplateId = typeof cvTemplates[number]["id"];

// Template Colors
export const templateColors = [
    { id: "orange", name: "Orange", hex: "#EA723C" },
    { id: "blue", name: "Blue", hex: "#4B94EA" },
    { id: "green", name: "Green", hex: "#2D9D78" },
    { id: "red", name: "Red", hex: "#E74C3C" },
    { id: "purple", name: "Purple", hex: "#9B59B6" },
    { id: "navy", name: "Navy", hex: "#2C3E50" },
    { id: "teal", name: "Teal", hex: "#1ABC9C" },
    { id: "dark-blue", name: "Dark Blue", hex: "#286270" },
] as const;

export type ColorId = typeof templateColors[number]["id"];
