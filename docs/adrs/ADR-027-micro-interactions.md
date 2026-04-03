# ADR-027: Micro-Interaction Standards

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Hey Bradley's current UI lacks consistent interactive feedback. Buttons have no hover or active states. Cards sit flat with no hover lift. Tab switches are hard cuts with no transition. Focus states are browser defaults. The result feels like a developer prototype rather than the Stripe/Linear/Vercel quality bar the project targets (see ADR-025).

Micro-interactions are the single highest-leverage polish improvement. They communicate interactivity, provide tactile feedback, and signal craftsmanship -- all without changing layout or functionality.

## Decision

All interactive elements in Hey Bradley must implement the following micro-interaction standards.

### Buttons

All buttons must have four visual states:

| State | CSS Classes |
|-------|-------------|
| Resting | Base styles (bg, text, rounded, font-semibold) |
| Hover | `hover:scale-[1.02] hover:brightness-110` |
| Active (pressed) | `active:scale-[0.98] active:brightness-95` |
| Focus | `focus-visible:ring-2 focus-visible:ring-[accentPrimary] focus-visible:ring-offset-2` |

Transition: `transition-transform duration-150 ease-out`

### Cards

All card elements (pricing cards, feature cards, team cards, menu items, quote cards) must have:

| State | CSS Classes |
|-------|-------------|
| Resting | `shadow-md border border-white/10` |
| Hover | `hover:shadow-xl hover:-translate-y-1 hover:border-white/20` |
| Active | `active:translate-y-0 active:shadow-md` |

Transition: `transition-all duration-200 ease-out`

### Tab Switches

Tab panel transitions must use opacity crossfade, not hard cuts:

- Outgoing panel: `opacity-0 translate-y-1` over 150ms
- Incoming panel: `opacity-100 translate-y-0` over 200ms
- Use CSS transitions or Framer Motion `AnimatePresence`

### Color Mode Transition

When toggling between light and dark mode, all color properties must transition smoothly:

- Apply `transition-colors duration-300 ease-in-out` to section wrappers
- Palette swaps must not cause a visual flash

### Scroll Reveal

Content sections entering the viewport should animate in:

- Initial state: `opacity-0 translate-y-6`
- Revealed state: `opacity-100 translate-y-0`
- Duration: 700ms with `ease-out`
- Stagger: 80ms delay per sibling element
- Trigger: IntersectionObserver with threshold 0.15
- Animate once only (unobserve after trigger)

### Focus Rings

All focusable elements must have a visible focus ring:

- Use `focus-visible` (not `focus`) to avoid showing rings on mouse click
- Ring color: theme accent primary
- Ring width: 2px
- Ring offset: 2px with background-aware offset color

### Timing Guidelines

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover/active | 150ms | ease-out |
| Card hover lift | 200ms | ease-out |
| Tab crossfade | 200ms | ease-out |
| Color mode transition | 300ms | ease-in-out |
| Scroll reveal | 700ms | ease-out |
| Scroll stagger per item | +80ms | -- |

## Consequences

- All existing section renderers must be audited and updated to include hover, active, and focus states.
- A shared utility class set (or Tailwind plugin) should be created to avoid duplicating interaction classes across components.
- Scroll reveal requires an IntersectionObserver hook (`useScrollReveal`) to be implemented and used in section wrappers.
- Tab crossfade requires managing enter/exit states, which adds minor complexity to tab components.
- Performance impact is negligible -- all interactions use CSS transforms and opacity, which are GPU-composited and do not trigger layout reflows.
- Testing must verify that interactions work on touch devices (hover states should not "stick" on mobile).
- Accessibility: focus-visible rings ensure keyboard navigation remains discoverable without cluttering mouse-driven use.
