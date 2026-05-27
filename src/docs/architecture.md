# 369 Detail — Frontend Architecture

## Architecture Philosophy

The architecture of 369 Detail must prioritize:

- scalability
- maintainability
- reusable systems
- premium UX consistency
- performance
- developer clarity

The project should feel like a professional production-grade frontend application.

Every structural decision must support future expansion.

---

# Core Stack

## Frontend Technologies

Primary stack:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

Additional priorities:

- mobile-first architecture
- SEO optimization
- scalable component systems
- reusable animations
- modular sections

---

# Folder Structure

## Global Structure

```txt
src/
├── app/
├── animations/
├── components/
├── docs/
├── hooks/
├── lib/
├── public/
├── sections/
├── styles/
├── types/
└── utils/
```

The project must remain organized and scalable.

Avoid chaotic growth.

---

# App Router Structure

## `/app`

Contains:

- routes
- layouts
- metadata
- global providers
- page structure

Examples:

```txt
app/
├── layout.tsx
├── page.tsx
├── globals.css
```

Server Components should remain default whenever possible.

Client Components should only be used when interaction is necessary.

---

# Component Architecture

## `/components`

Contains reusable UI systems.

Structure:

```txt
components/
├── ui/
├── layout/
└── shared/
```

---

## `/components/ui`

Contains atomic UI elements.

Examples:

- buttons
- inputs
- badges
- chips
- loaders
- overlays

Rules:

- reusable
- variant-based
- accessible
- visually consistent

Avoid business logic inside UI atoms.

---

## `/components/layout`

Contains structural components.

Examples:

- navbar
- footer
- mobile navigation
- page wrappers

Responsibilities:

- spacing consistency
- navigation flow
- responsive structure

---

## `/components/shared`

Contains reusable complex components.

Examples:

- service cards
- before/after sliders
- testimonial cards
- animated sections
- CTA blocks

These components may contain:

- reusable animation logic
- reusable interaction systems
- layout composition

---

# Sections Architecture

## `/sections`

Contains full landing sections.

Examples:

- Hero
- Services
- Gallery
- Testimonials
- Contact

Each section should:

- feel visually distinct
- support responsiveness
- remain modular
- support future scalability

Sections should remain clean and isolated.

---

# Animation Architecture

## `/animations`

Contains reusable motion presets.

Examples:

- fade transitions
- stagger systems
- reveal animations
- cinematic motion presets

Animation logic should remain centralized.

Avoid duplicated animation code.

---

# Hooks Architecture

## `/hooks`

Contains reusable custom hooks.

Examples:

- scroll detection
- viewport logic
- media query hooks
- reduced motion detection

Hooks should isolate logic from UI.

---

# Utility Architecture

## `/utils`

Contains helper utilities.

Examples:

- class merging
- formatting
- animation helpers
- reusable calculations

Utilities should remain framework-agnostic whenever possible.

---

# Type System

## `/types`

Contains global TypeScript definitions.

Examples:

- service types
- animation types
- component interfaces
- reusable contracts

Avoid scattered inline types for reusable structures.

---

# Styling Architecture

## `/styles`

Contains:

- theme tokens
- CSS variables
- typography systems
- reusable visual foundations

Primary styling uses Tailwind CSS.

Global CSS should remain minimal.

---

# Media Organization

## `/public`

Assets should remain categorized.

Structure:

```txt
public/
├── icons/
├── images/
└── videos/
```

---

## Image Categories

```txt
images/
├── hero/
├── services/
├── gallery/
├── before-after/
└── branding/
```

The media structure must remain organized from the beginning.

---

# Naming Conventions

## File Naming

Use:

- kebab-case for files
- PascalCase for components
- camelCase for variables/functions

Examples:

```txt
before-after-slider.tsx
premium-button.tsx
```

---

# Import Strategy

## Import Rules

Prefer absolute imports.

Correct:

```tsx
import { Navbar } from "@/components/layout/navbar";
```

Avoid:

```tsx
import { Navbar } from "../../../components/layout/navbar";
```

---

# Scalability Standards

## Future Expansion

The architecture must support future additions:

- ecommerce
- booking systems
- admin dashboards
- customer accounts
- memberships
- service packages
- blog systems

The current landing page is only phase one.

---

# Performance Philosophy

## Optimization Priorities

The project must prioritize:

- minimal layout shifts
- optimized images
- reduced JavaScript bloat
- smooth animation performance
- mobile rendering quality

Avoid unnecessary dependencies.

---

# Development Standards

## Code Quality

The codebase should remain:

- readable
- modular
- self-documenting
- scalable
- reusable

Avoid:

- duplicated logic
- oversized files
- hardcoded values
- inconsistent styling

---

# Final Architecture Goal

The project should feel:

- premium
- scalable
- cinematic
- technically solid
- production-ready

The frontend architecture should support years of future growth without becoming chaotic.
