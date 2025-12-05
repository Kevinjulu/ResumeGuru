# Account Page - Visual Design Specifications

## Component Specifications

### 1. Profile Header Card
```
┌─────────────────────────────────────────────────────────────┐
│ ⚫ [Avatar]  User Name              [Edit Profile Button]   │
│            user@email.com                                   │
│            ✓ Email Verified                                 │
└─────────────────────────────────────────────────────────────┘
```

**Specifications**:
- Background: linear-gradient(to-right, from-orange-50 to-blue-50)
- Border: 1px solid orange-100
- Avatar Size: 80px
- Avatar Background: linear-gradient(135deg, from-orange-400 to-blue-500)
- Avatar Text: White, 2xl font, bold
- Name: 24px, bold, gray-900
- Email: 16px, regular, gray-600
- Badge: Green background, Check icon, "Email Verified"

### 2. Account Information Card
```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Account Information                                      │
├─────────────────────────────────────────────────────────────┤
│ FULL NAME                                              ›    │
│ [User Name]                                                 │
├─────────────────────────────────────────────────────────────┤
│ EMAIL ADDRESS                                          ›    │
│ [user@email.com]                                            │
├─────────────────────────────────────────────────────────────┤
│ MEMBER SINCE                                                │
│ December 4, 2024                                            │
└─────────────────────────────────────────────────────────────┘
```

**Specifications**:
- Background: White
- Border: 1px solid gray-200
- Border-radius: 8px
- Card Header Icon: 20px, primary orange
- Section Label: 12px, uppercase, gray-500, letter-spacing
- Content: 16px, bold, gray-900
- Dividers: 1px gray-100, pb-4 mb-4
- Chevron Button: 20px, gray-400, hover:gray-600

### 3. Tab Navigation
```
┌─────┬─────┬──────┬──────┐
│ 👤  │ 💳  │ 🔒   │ ⚙️   │
│ Pro │ Bil │ Sec  │ Set  │
├─────┴─────┴──────┴──────┤
```

**Desktop (≥768px)**:
- Grid: 4 columns, gap-3
- Button Width: 1/4
- Padding: p-4
- Display: Icon + Label

**Mobile (<768px)**:
- Grid: 2 columns, gap-3
- Button Width: 1/2
- Display: Icon only
- md:inline shows labels

**Active State**:
- Background: White
- Border: 2px solid primary (#EA723C)
- Shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)
- Color: text-primary

**Inactive State**:
- Background: White
- Border: 1px solid gray-200
- Color: text-gray-600
- Hover: border-gray-300

### 4. Current Plan Card (Billing)
```
┌──────────────────────────────────────────────┐
│ CURRENT PLAN                                 │
│ Free Plan                          [Upgrade] │
│ Unlimited access to 3 templates with         │
│ basic formatting                             │
└──────────────────────────────────────────────┘
```

**Specifications**:
- Background: linear-gradient(to-right, from-orange-50 to-transparent)
- Border: 2px solid primary (#EA723C)
- Border-radius: 8px
- Padding: p-8
- Label: 12px, uppercase, gray-500
- Plan Name: 30px, bold, gray-900
- Description: 16px, regular, gray-600
- Button: Gradient (orange-500 → orange-600), white text, 16px

### 5. Billing History Card (Empty State)
```
┌─────────────────────────────────────────────┐
│ 📄 Billing History                          │
├─────────────────────────────────────────────┤
│              ⓘ                              │
│        No billing history available         │
│  Your invoices will appear here once you    │
│        upgrade to a paid plan               │
└─────────────────────────────────────────────┘
```

**Specifications**:
- Background: White
- Border: 1px solid gray-200
- Icon: 48px, gray-400
- Primary Message: 16px, bold, gray-900
- Secondary Message: 14px, regular, gray-500
- Padding: py-12 (center content)

### 6. Password & Security Card
```
┌──────────────────────────────────────────────┐
│ 🔒 Password & Security                      │
├──────────────────────────────────────────────┤
│ Password                    [Change Password]│
│ Change your password regularly to keep your  │
│ account secure                               │
├──────────────────────────────────────────────┤
│ Two-Factor Authentication    [Enable 2FA]   │
│ Add an extra layer of security to your      │
│ account                                      │
└──────────────────────────────────────────────┘
```

**Specifications**:
- Background: White
- Border: 1px solid gray-200
- Title: 16px, bold, gray-900
- Description: 14px, regular, gray-600
- Button: Outline variant, border-gray-300
- Dividers: pb-4 mb-4, 1px gray-100

### 7. Active Sessions Card
```
┌──────────────────────────────────────────────┐
│ ⏰ Active Sessions                           │
├──────────────────────────────────────────────┤
│ ✓ Current Device - Last active just now    │
└──────────────────────────────────────────────┘
```

**Specifications**:
- Background: blue-50
- Border: 1px solid blue-200
- Border-radius: 8px
- Text Color: blue-900
- Padding: p-4
- Icon: Check (green)

### 8. Preferences Card
```
┌──────────────────────────────────────────────┐
│ ⚙️ Preferences                               │
├──────────────────────────────────────────────┤
│ Email Notifications                    [✓]  │
│ Receive updates about your resumes...        │
├──────────────────────────────────────────────┤
│ Marketing Emails                        [☐]  │
│ Get tips, features updates, and offers...    │
├──────────────────────────────────────────────┤
│ Download Your Data          [↓ Download]     │
│ Request a copy of all your data...           │
└──────────────────────────────────────────────┘
```

**Specifications**:
- Background: White
- Border: 1px solid gray-200
- Checkbox Size: w-5 h-5
- Checkbox Color: text-primary (checked), gray-300 (unchecked)
- Cursor: pointer
- Dividers: pb-4 mb-4

### 9. Danger Zone Card
```
┌──────────────────────────────────────────────┐
│ ⚠️ Danger Zone                               │
├──────────────────────────────────────────────┤
│ These actions cannot be undone. Please      │
│ proceed with caution.                        │
│                 [Delete Account]             │
└──────────────────────────────────────────────┘
```

**Specifications**:
- Background: red-50
- Border: 1px solid red-200
- Heading Color: red-900
- Icon Color: red
- Text Color: red-800
- Button: Outline red, red-300 border, red-600 text
- Padding: p-6
- Width: w-full

## Typography Scale

| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| Page H1 | 36px | bold | gray-900 | 1.2 |
| H2 | 18px | bold | gray-900 | 1.3 |
| H3 | 16px | bold | gray-900 | 1.4 |
| Body | 16px | regular | gray-900 | 1.6 |
| Small | 14px | regular | gray-600 | 1.5 |
| Label | 12px | medium | gray-500 | 1.4 |
| Label Upper | 12px | medium | gray-500 | 1.4 |

## Color System

### Primary Colors
- Primary: #EA723C (Orange)
- Primary Hover: #D25A24 (Darker Orange)
- Primary Light: #FFF4E6 (Orange-50)

### Neutral Colors
- White: #FFFFFF
- Gray-50: #F9FAFB
- Gray-100: #F3F4F6
- Gray-200: #E5E7EB
- Gray-300: #D1D5DB
- Gray-500: #6B7280
- Gray-600: #4B5563
- Gray-900: #111827

### Semantic Colors
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

### Background Gradients
- Page: linear-gradient(to-bottom-right, #FFF7ED, #FFFFFF, #F0F9FF)
- Header: linear-gradient(to-right, #FFF7ED, #F0F9FF)

## Spacing System

| Size | Value | Use Case |
|------|-------|----------|
| xs | 2px | Micro spacing |
| sm | 4px | Small gaps |
| md | 6px | Compact spacing |
| lg | 8px | Standard spacing |
| xl | 12px | Component padding |
| 2xl | 16px | Section spacing |
| 3xl | 20px | Large spacing |
| 4xl | 24px | Extra large spacing |
| 5xl | 32px | Section breaks |

## Border Radius
- Small: 4px (inputs)
- Medium: 8px (cards)
- Large: 12px (modals)
- Full: 50% (avatars, badges)

## Shadow System
- sm: 0 1px 2px rgba(0, 0, 0, 0.05)
- md: 0 4px 6px rgba(0, 0, 0, 0.1)
- lg: 0 10px 15px rgba(0, 0, 0, 0.1)
- xl: 0 20px 25px rgba(0, 0, 0, 0.1)

## Animation Specifications

### Framer Motion Variants

**Container Variants**:
```javascript
{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}
```

**Item Variants**:
```javascript
{
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}
```

**Duration**: 0.4-0.5 seconds
**Easing**: Spring (default)
**Delay**: 0.1s per child

## Responsive Breakpoints

### Tailwind Breakpoints
- **sm**: 640px
- **md**: 768px (Tab grid adjusts)
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Key Breakpoints for Account Page
- **Mobile**: < 768px (2-col tabs, icon-only)
- **Tablet**: 768px - 1024px (4-col tabs, labels show on md:)
- **Desktop**: > 1024px (Full layout)

## States & Interactions

### Button States
1. **Default**: Border gray-300, text gray-600
2. **Hover**: Border gray-400, bg-gray-50
3. **Active**: Border-2 primary, bg-white, shadow-md
4. **Disabled**: Opacity-50, cursor-not-allowed

### Form Input States
1. **Default**: Border gray-300, bg-white
2. **Focus**: Border primary, ring primary
3. **Error**: Border red-500, bg-red-50
4. **Disabled**: bg-gray-100, cursor-not-allowed

### Card Hover States
- Subtle shadow increase
- Border color slight change
- No transform for stability

## Accessibility Contrast Ratios

| Element | Ratio | Standard |
|---------|-------|----------|
| Text on White | 8.5:1 | WCAG AAA |
| Primary Button | 5.2:1 | WCAG AA |
| Secondary Text | 4.5:1 | WCAG AA |
| Disabled Text | 3.1:1 | Not AA |

## Performance Targets

- **Lighthouse Performance**: 95+
- **Lighthouse Accessibility**: 98+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Browser Support Matrix

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✓ Full |
| Firefox | Latest | ✓ Full |
| Safari | Latest | ✓ Full |
| Edge | Latest | ✓ Full |
| Mobile Safari | iOS 14+ | ✓ Full |
| Chrome Mobile | Latest | ✓ Full |

---

**Last Updated**: December 4, 2025
**Version**: 1.0
**Status**: Production Ready
