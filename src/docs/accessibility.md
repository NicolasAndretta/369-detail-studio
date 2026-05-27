# 369 Detail — Accessibility Standards

## Accessibility Philosophy

Accessibility is part of premium design.

A premium experience must be usable by everyone.

Accessibility should never feel like an afterthought.

The website must remain:

- readable
- navigable
- responsive
- understandable
- usable across devices

Good accessibility improves:

- usability
- professionalism
- SEO
- trust
- conversion quality

---

# Semantic HTML Standards

Use semantic HTML whenever possible.

Preferred tags:

```html
<header>
  <nav>
    <main>
      <section>
        <article>
          <footer>
            <button></button>
          </footer>
        </article>
      </section>
    </main>
  </nav>
</header>
```

Avoid excessive generic div structures.

The DOM should remain meaningful and organized.

---

# Button Accessibility

Buttons must always use:

```html
<button></button>
```

Avoid clickable divs.

Buttons must support:

- keyboard navigation
- focus states
- hover states
- disabled states
- screen readers

---

# Keyboard Navigation

Every important interactive element must be keyboard accessible.

Users should be able to navigate using:

- Tab
- Shift + Tab
- Enter
- Escape

Focus order must feel logical.

---

# Focus Visibility

All interactive elements must have visible focus styles.

Preferred focus style:

```css
focus-visible:ring
focus-visible:outline-none
```

Focus states should feel:

- elegant
- premium
- visible
- consistent

Avoid invisible focus states.

---

# Contrast Standards

Text contrast must remain highly readable.

Avoid:

- low contrast gray text
- neon text over bright backgrounds
- unreadable overlays

The dark interface must remain readable across all devices.

---

# Typography Accessibility

Typography must prioritize readability.

Use:

- sufficient line height
- responsive sizing
- clean spacing
- proper hierarchy

Avoid:

- tiny text
- compressed spacing
- oversized paragraphs

The reading experience should feel effortless.

---

# Mobile Accessibility

Mobile accessibility is critical.

Ensure:

- large touch targets
- readable buttons
- adequate spacing
- responsive scaling

Avoid tiny clickable elements.

---

# Screen Reader Standards

Interactive elements should support screen readers.

Use:

```html
aria-label aria-expanded aria-hidden role
```

when necessary.

Decorative images should use:

```html
alt=""
```

Important images should have descriptive alt text.

---

# Form Accessibility

Forms must remain simple and accessible.

Requirements:

- proper labels
- visible states
- validation feedback
- readable placeholders

Avoid confusing form structures.

---

# Motion Accessibility

Respect reduced motion preferences.

Implement:

```css
@media (prefers-reduced-motion: reduce);
```

Heavy animations should disable automatically when required.

Accessibility always overrides visual effects.

---

# Responsive Accessibility

The interface must remain usable across:

- mobile
- tablet
- desktop
- ultrawide screens

Avoid:

- horizontal scrolling
- overlapping content
- broken layouts

---

# SEO Relationship

Accessibility improves SEO quality.

Proper semantic structure helps:

- Google indexing
- readability
- crawler understanding
- metadata hierarchy

Accessibility and SEO should work together.

---

# Content Clarity

Text should remain:

- concise
- readable
- understandable
- well structured

Avoid:

- giant text blocks
- unclear hierarchy
- visual clutter

The user should always understand what to do next.

---

# Accessibility Testing

Before production:

- test keyboard navigation
- test mobile readability
- test focus visibility
- test responsive layouts
- test contrast ratios

Accessibility must be validated intentionally.

---

# Final Philosophy

Accessibility should feel invisible.

The user should never struggle to:

- navigate
- read
- interact
- understand
- convert

A premium experience is an accessible experience.
