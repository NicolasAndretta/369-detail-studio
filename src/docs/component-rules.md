# 369 Detail — Component Architecture Rules

## Component Philosophy

All components inside 369 Detail must feel:

- premium
- reusable
- scalable
- cinematic
- performance-oriented

The UI should never feel generated or generic.

Every component must feel intentionally crafted.

---

# Architecture Structure

The project follows a modular architecture.

## Folder Responsibilities

### `/components/ui`

Contains reusable atomic UI elements.

Examples:

- Button
- Input
- Badge
- Modal
- Chip
- Tag
- Loader

These components should:

- be highly reusable
- remain visually consistent
- support variants
- support accessibility
- avoid business logic

---

### `/components/layout`

Contains structural layout components.

Examples:

- Navbar
- Footer
- MobileMenu
- PageContainer

These components manage:

- navigation
- responsive layout
- spacing consistency
- structural hierarchy

---

### `/components/shared`

Contains reusable medium/high complexity components.

Examples:

- ServiceCard
- BeforeAfterSlider
- CTASection
- TestimonialCard
- SectionHeading
- AnimatedReveal
- SocialProofStrip

These components may contain:

- animation logic
- composition patterns
- reusable layouts
- reusable interaction systems

---

### `/sections`

Contains full landing page sections.

Examples:

- Hero
- Services
- Gallery
- Testimonials
- Contact

Each section should:

- have a clear responsibility
- remain visually distinct
- support responsive behavior
- support animation orchestration

---

# Component Rules

## Single Responsibility Principle

A component should do one thing exceptionally well.

Avoid:

- oversized files
- mixed responsibilities
- deeply nested logic

If a component exceeds ~200 lines:

- extract child components
- move logic into hooks
- isolate animations

---

# Naming Conventions

## Components

Use PascalCase.

Examples:

```tsx
HeroSection.tsx;
PremiumButton.tsx;
BeforeAfterCard.tsx;
```

````

---

## Hooks

Use camelCase with `use` prefix.

Examples:

```tsx
useScrollPosition.ts
useNavbarVisibility.ts
useReducedMotion.ts
````

---

## Utility Files

Use concise lowercase naming.

Examples:

```tsx
cn.ts;
format - price.ts;
motion - presets.ts;
```

---

# Component Styling Rules

## Tailwind Standards

Class order should remain consistent:

1. Layout
2. Positioning
3. Spacing
4. Typography
5. Colors
6. Borders
7. Effects
8. Animations
9. Responsive modifiers

---

## Avoid Visual Chaos

Do NOT:

- stack excessive shadows
- use random gradients
- overuse blur effects
- use neon everywhere
- mix too many accent colors

The interface should feel:

- disciplined
- elegant
- controlled
- cinematic

---

# Animation Rules

Animations must feel premium.

Allowed:

- subtle fades
- reveal transitions
- parallax movement
- cinematic scaling
- staggered entrances

Avoid:

- bouncing UI
- playful spring animations
- excessive motion
- distracting loops

---

# Reusability Standards

Components must support:

- `className`
- variants
- responsive behavior
- accessibility
- future scalability

Prefer reusable composition over duplicated code.

---

# Accessibility Standards

Every interactive component must support:

- keyboard navigation
- visible focus states
- semantic HTML
- aria labels where necessary

Buttons must always remain accessible.

Avoid clickable divs.

---

# Mobile-First Philosophy

All components must be designed mobile-first.

Priorities:

- thumb-friendly interactions
- proper spacing
- readable typography
- optimized rendering
- responsive layouts

The mobile experience is the primary experience.

---

# Visual Consistency Rules

Every component must follow the design system.

Never introduce:

- random colors
- inconsistent border radius
- mismatched typography
- inconsistent spacing systems

The UI should feel unified across the entire experience.

---

# Performance Standards

Avoid unnecessary:

- rerenders
- heavy animations
- oversized images
- layout shifts

Prefer:

- optimized assets
- lazy loading
- transform animations
- reusable motion presets

---

# Future Scalability

The architecture must support future expansion:

- ecommerce
- booking systems
- dashboards
- authentication
- memberships
- admin panels

Avoid hardcoded structures that block future growth.

---

# Final Philosophy

The website should feel like a premium automotive brand experience.

Not a template.

Not a generic landing page.

Every component should communicate:

- confidence
- precision
- luxury
- obsessive detailing culture
- cinematic presentation

```

```
