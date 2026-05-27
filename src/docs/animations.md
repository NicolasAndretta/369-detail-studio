# 369 Detail — Animation Guidelines

## Animation Philosophy

Animations inside 369 Detail must feel:

- cinematic
- premium
- smooth
- refined
- immersive
- intentional

Motion should enhance the luxury experience.

Animations are used to:

- guide attention
- reinforce hierarchy
- create immersion
- increase perceived quality
- improve storytelling

The interface should never feel static.

But motion should also never feel distracting.

---

# Core Motion Identity

The motion language should feel inspired by:

- luxury automotive commercials
- cinematic camera movement
- premium UI systems
- modern vehicle showcases
- industrial premium environments

Animations should feel:

- elegant
- smooth
- controlled
- heavy
- confident

Avoid:

- playful animations
- exaggerated bounce
- cartoon motion
- aggressive elastic effects
- flashy transitions
- chaotic movement

---

# Preferred Motion Style

The preferred motion style is:

- smooth fade reveals
- subtle parallax
- cinematic scaling
- soft opacity transitions
- directional movement
- staggered entrances

The motion should feel "expensive."

---

# Transition Standards

Preferred transition timing:

```css
duration-300
duration-500
duration-700
```

Preferred easing:

```css
ease-out
cubic-bezier(0.16, 1, 0.3, 1)
```

Avoid:

```css
linear
ease-in-out
```

unless absolutely necessary.

---

# Performance Rules

Always animate:

- opacity
- transform
- translate
- scale
- rotate

Avoid animating:

- width
- height
- margin
- padding
- top
- left

These properties cause layout reflows and reduce performance.

---

# Framer Motion Standards

Framer Motion should be used carefully.

Use motion primarily for:

- section reveals
- hero transitions
- image transitions
- staggered lists
- hover interactions
- CTA emphasis

Avoid excessive motion wrappers.

Keep motion architecture clean.

---

# Section Reveal Philosophy

Sections should reveal progressively while scrolling.

Preferred reveal style:

- fade in
- slight upward movement
- subtle delay
- smooth opacity transition

Example feeling:

"cinematic content entering frame."

---

# Staggered Animations

Lists and grids should use staggered timing.

Examples:

- services
- testimonials
- gallery items
- feature cards

The stagger effect should feel:

- elegant
- sequential
- subtle

Never exaggerated.

---

# Hover Interaction Standards

Hover interactions should feel premium.

Allowed hover effects:

- slight scale
- border glow
- soft brightness increase
- subtle elevation
- image zoom
- gradient movement

Avoid:

- aggressive scaling
- spinning effects
- bouncing
- flashing colors

---

# Image Motion

Images should feel cinematic.

Preferred effects:

- slow zoom
- parallax movement
- soft reveal masks
- cinematic crop movement
- opacity layering

The website should feel visually alive.

---

# Hero Section Motion

The hero area is one of the most important motion zones.

It should include:

- layered reveals
- cinematic text entrances
- ambient movement
- subtle depth
- premium CTA interactions

The hero must create immediate emotional impact.

---

# Scroll Behavior

Scrolling should feel smooth and controlled.

Avoid:

- abrupt snapping
- chaotic motion
- excessive sticky effects

Parallax should remain subtle.

Never damage readability.

---

# Mobile Animation Rules

Mobile performance is priority.

On mobile:

- reduce heavy effects
- simplify motion layers
- avoid performance-heavy blur animation
- preserve smooth scrolling

Animations must remain fluid even on weaker devices.

---

# Reduced Motion Accessibility

Always respect reduced motion preferences.

Implement:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
    scroll-behavior: auto !important;
  }
}
```

Accessibility is mandatory.

---

# Animation Timing Hierarchy

Use different motion timing depending on importance.

Examples:

Fast interactions:

- buttons
- hover states
- navbar transitions

Medium timing:

- cards
- section reveals
- images

Slower cinematic timing:

- hero transitions
- large banners
- immersive visuals

This creates rhythm and visual hierarchy.

---

# Motion Consistency

The same motion language must exist across the entire website.

Avoid:

- random transition styles
- inconsistent easing
- mismatched animation speeds
- chaotic movement systems

Motion should feel unified and intentional.

---

# Final Philosophy

Animations should make the experience feel:

- premium
- cinematic
- immersive
- modern
- luxurious
- emotionally impactful

The user should subconsciously feel:

"This brand cares about every detail."
