# ADR-025: Visual-First Section Design

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Current sections look like developer prototypes — unstyled cards, no images, inconsistent spacing. The quality bar for Hey Bradley targets Squarespace and Framer, not Bootstrap starter templates. Users judge the platform in seconds; every section must look polished out of the box without any customization.

## Decision

Establish visual-first design standards that all section renderers must meet:

### Theme Palette Integration

- All sections must use the theme's **6-slot color palette** system for backgrounds, text, borders, and accents.
- No hardcoded colors in renderers — every color value must reference a palette slot.

### Default Placeholder Images

- All card variants that support images must include **Unsplash placeholder images by default**.
- Placeholders are contextually appropriate (e.g., business photos for pricing, team photos for quotes).
- Users see a fully styled section immediately, not empty boxes.

### Image and Media Controls

- An **image selector** is available in the SIMPLE editor for every image-bearing variant.
- A **video URL input** with inline preview is provided for video-capable variants.
- The `gallery` section type supports both image and video items.

### Responsive Behavior

- All multi-column layouts **collapse to 1 column on mobile** (below 640px).
- Tablet breakpoint (640px-1024px) reduces columns by one tier (4 becomes 3, 3 becomes 2).
- Spacing, font sizes, and padding scale proportionally across breakpoints.

### Design Quality Target

- Visual quality benchmark: **Tailwind UI marketing sections**.
- Consistent vertical rhythm, generous whitespace, typographic hierarchy.
- Hover states, transitions, and micro-interactions on interactive elements.

## Consequences

- Every renderer must support image props and integrate with an `ImagePicker` component.
- A shared `ImagePicker` component must be built or adopted for the SIMPLE editor.
- Responsive grid utilities must be standardized across all multi-column renderers.
- Default theme JSONs must include placeholder image URLs for all image-bearing variants.
- Build size may increase due to placeholder image references; lazy loading is required.
- QA must verify every variant at mobile, tablet, and desktop breakpoints.
