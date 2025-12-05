# ResumeGuru Design Guidelines

## Design Approach
**Reference-Based Approach**: This is a direct clone of ResumeGenius with rebranding. Follow the exact design patterns, layout structures, and user flows from the reference site while applying ResumeGuru branding and colors from the provided JSON.

## Core Design Principles
1. **Professional Trust**: Clean, polished interface that conveys credibility for career services
2. **Conversion-Focused**: Clear CTAs and guided flows to drive users into the resume builder
3. **Template Showcase**: Heavy emphasis on visual resume template previews
4. **Progressive Disclosure**: Step-by-step builder experience without overwhelming users

---

## Typography System

### Font Families
- **Headings**: Lexend, sans-serif
- **Body/UI**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif

### Type Scale
- **H1 (Hero)**: 56px, bold, tight line-height (1.1)
- **H2 (Sections)**: 42px, bold
- **H3 (Cards)**: 24px, semibold
- **Body**: 16px, regular (18px for important copy)
- **Small**: 14px for captions, meta info
- **CTA Buttons**: 16px, semibold

### Hierarchy Rules
- Hero headlines use largest size with bold weight
- Section titles centered with ample spacing above/below
- Body text maintains comfortable reading line-height (1.6)

---

## Layout & Spacing System

### Spacing Units
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20, 24, 32**
- Component padding: p-6 to p-8
- Section vertical spacing: py-20 to py-32
- Card spacing: gap-6 to gap-8
- Button padding: px-8 py-3

### Container Structure
- **Max-width containers**: max-w-7xl for main content
- **Full-width sections**: w-full with constrained inner content
- **Grid layouts**: 
  - Template gallery: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
  - Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Single column on mobile, expand on larger screens

---

## Component Library

### Navigation
- **Header**: Sticky top navigation, white background, subtle shadow
- Logo left, main nav center, CTA buttons right
- Mobile: Hamburger menu with slide-out drawer
- Height: 80px desktop, 64px mobile

### Buttons
**Primary CTA** (Orange):
- Background: #EA723C
- Text: White, semibold
- Border-radius: 8px
- Padding: px-8 py-3
- Shadow: subtle on hover
- Use for: "Build My Resume Now", "Get Started", main conversion actions

**Secondary** (White/Ghost):
- Background: White
- Text: #4A4A4A
- Border: 1px solid #E5E5E5
- Border-radius: 8px
- Use for: "Upload My Existing Resume", alternative actions

**Buttons on Images**: Apply backdrop-blur-sm and bg-white/10 for hero overlays

### Cards
**Template Cards**:
- White background
- Border: 1px solid #E5E5E5
- Border-radius: 12px
- Hover: subtle lift with shadow
- Image preview at top
- Template name below
- "Use This Template" button

**Feature Cards**:
- Clean white cards with icon at top
- Title + description
- Equal heights in grid
- Padding: p-8

### Forms
**Input Fields**:
- Border: 1px solid #CCCCCC
- Border-radius: 12px
- Padding: px-4 py-3
- Focus state: border changes to #EA723C
- Font-size: 16px

---

## Color Usage

### Primary Palette
- **Primary Orange**: #EA723C - CTAs, links, accents
- **Accent Blue**: #4B94EA - Secondary highlights, trust badges
- **Background**: #FFFFFF
- **Text Primary**: #1A1A1A for headings
- **Text Secondary**: #4A4A4A for body
- **Borders**: #E5E5E5 for subtle dividers

### Application
- Buttons: Orange primary, white secondary
- Links: Orange with underline on hover
- Section backgrounds: Alternate white and very light gray (#F9FAFB)
- Template thumbnails: Full color with shadows

---

## Page Structures

### Homepage
1. **Hero Section** (100vh min):
   - Large headline: "The Best Resume Builder Online"
   - Subheading with value prop
   - Two CTAs: "Build My Resume Now" (primary) + "Upload My Existing Resume" (secondary)
   - Hero image: Professional illustration of resume builder interface (right side)
   - Trust indicators: Expert avatars + Trustpilot rating (4.5 stars)

2. **Template Gallery Section**:
   - Headline: "Choose your favorite free resume template"
   - 4-column grid of template cards
   - 10+ templates visible with hover effects
   - Each card: Template preview image + name + "Use This Template" button

3. **AI Features Section**:
   - Demo of AI resume generator
   - Before/after examples
   - Form fields showing AI input/output

4. **How It Works** (3 Steps):
   - Step 1: Generate content with builder/AI
   - Step 2: Select template with preview
   - Step 3: Download in multiple formats
   - Visual progression with numbered steps

5. **Resume Examples Section**:
   - Industry categories in grid
   - Sample resume previews
   - Link to full examples library

6. **Social Proof**:
   - Testimonials carousel
   - Media logos (New York Post, MSNBC, Fox, Fortune, etc.)
   - Expert team section with headshots

7. **Footer**:
   - Multi-column: Products, Resources, Company, Support
   - Newsletter signup
   - Social links
   - Copyright and legal links

### Resume Builder Pages
**Multi-step Flow**:
- Progress indicator at top
- Current section highlighted
- Left sidebar: Resume preview (live updates)
- Main area: Form for current section
- Navigation: Back + Continue buttons
- Sections: Contact → Summary → Experience → Education → Skills → Certifications

**Template Selection**:
- Grid view of all templates
- Filter by style (Professional, Modern, Creative, Simple)
- Color picker for customization
- Live preview updates

### Template Gallery Page
- Hero section with search/filter
- Grid of all templates (4 columns)
- Category filters
- Template details on click

### Pricing Page
- 3-column pricing tiers
- Free, Pro, Premium plans
- Feature comparison table
- FAQ accordion below

---

## Images

### Hero Section
Large, professional illustration showing:
- Resume being built section-by-section
- Modern, clean UI mockup
- Bright, optimistic color palette matching brand
- Placed on right side of hero (60% width)

### Template Previews
- High-quality screenshots of each template
- Consistent aspect ratio (8.5:11 portrait)
- Include sample professional content
- Use consistent naming visible in preview

### Feature Sections
- Screenshot mockups of builder interface
- Before/after resume examples
- Download format icons
- Step-by-step process illustrations

### Resume Examples
- Industry-specific resume samples
- Professional headshots for testimonials
- Media outlet logos

---

## Animations
**Minimal and purposeful**:
- Fade-in on scroll for sections
- Smooth transitions on template/color switching in builder
- Hover lift on cards (translateY -2px)
- Button hover: slight scale
- No heavy animations - keep professional

---

## Key UX Patterns
- Always show live resume preview during building
- Sticky save/download buttons in builder
- Auto-save progress
- Clear section completion indicators
- Breadcrumb navigation in multi-step flows
- Modal confirmations for destructive actions
- Loading states for AI generation
- Success confirmations for downloads