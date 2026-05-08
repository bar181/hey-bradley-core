# Accessibility Review - Hey Bradley

**Date:** 2026-04-02
**Reviewer:** Code Review Agent
**Scope:** Welcome.tsx, ListenTab.tsx, TopBar.tsx, LeftPanel.tsx, SectionsSection.tsx
**Standard:** WCAG 2.1 AA

---

## Summary

The application has significant accessibility gaps that would be flagged in an academic review. The TopBar is the strongest component (good aria-labels, focus-visible rings). The Welcome page and ListenTab are the weakest, with multiple BLOCKER-level issues around animation, screen reader support, and keyboard access.

**Issue counts:** 5 BLOCKER, 7 HIGH, 8 MEDIUM, 4 LOW

---

## BLOCKER Issues

### B-1. No `prefers-reduced-motion` support anywhere in the codebase

**Files:** All five files; global CSS
**WCAG:** 2.3.3 Animation from Interactions (AAA), 2.3.1 Three Flashes (A)

The app uses Framer Motion extensively (Welcome.tsx) and CSS keyframe animations (ListenTab.tsx `orb-pulse`) with no respect for the `prefers-reduced-motion` media query. The pulsing orb animation is continuous and cannot be paused.

**Impact:** Users with vestibular disorders or motion sensitivity cannot use the app safely. The orb pulse animation runs indefinitely.

**Fix:**
- Wrap Framer Motion in a hook that reads `prefers-reduced-motion` and sets `transition: { duration: 0 }` globally.
- Add `@media (prefers-reduced-motion: reduce)` to disable `orb-pulse` keyframes.
- Provide a visible "Pause animations" toggle.

---

### B-2. No ARIA landmark roles on any page

**Files:** Welcome.tsx, LeftPanel.tsx, TopBar.tsx
**WCAG:** 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)

There are zero `<main>`, `<nav>`, `<aside>`, `role="banner"`, `role="navigation"`, or `role="complementary"` landmarks in the entire reviewed codebase. The TopBar uses a `<header>` element but provides no `<nav>` wrapping for the toolbar buttons. The left panel has no `<aside>` or `role="complementary"`.

**Impact:** Screen reader users have no way to navigate by page region. They must tab through every element sequentially.

**Fix:**
- TopBar: wrap control groups in `<nav aria-label="Toolbar">`.
- LeftPanel: use `<aside aria-label="Configuration panel">`.
- Welcome.tsx: wrap in `<main>`.
- Builder layout: add `<main>` around the preview iframe area.

---

### B-3. No skip navigation link

**Files:** Global layout / TopBar.tsx
**WCAG:** 2.4.1 Bypass Blocks (A)

There is no skip-to-content link anywhere. Keyboard users must tab through every TopBar button and the entire left panel before reaching the main content area.

**Impact:** Keyboard-only users face excessive tabbing on every page load.

**Fix:** Add a visually-hidden skip link as the first focusable element: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`.

---

### B-4. No `aria-live` regions for dynamic content

**Files:** Welcome.tsx (chat messages), ListenTab.tsx (simulation text, burst countdown)
**WCAG:** 4.1.3 Status Messages (AA)

Chat messages in Welcome.tsx are injected character-by-character with no `aria-live` region. Screen readers will not announce new messages. The ListenTab simulation overlay text and burst countdown timer are also silent.

**Impact:** The entire Welcome page demo and Listen tab simulation are invisible to screen reader users.

**Fix:**
- Wrap the chat message container with `aria-live="polite"` and only announce complete messages (not each character).
- Add `aria-live="assertive"` or `role="status"` to the burst countdown display.
- Add `aria-live="polite"` to the simulation overlay text container.

---

### B-5. Welcome page showcase indicator dots have no accessible names

**File:** Welcome.tsx, lines 691-709
**WCAG:** 4.1.2 Name, Role, Value (A)

The showcase navigation dots are `<button>` elements with no text content, no `aria-label`, and no `aria-current`. They are rendered as tiny circles with only visual differentiation (width change when active).

```tsx
<button
  onClick={() => setCurrentShowcaseIndex(-1)}
  className={`w-2.5 h-2.5 rounded-full ...`}
/>
```

**Impact:** Screen readers announce these as "button" with no context. Users cannot tell which slide they are on or navigate intentionally.

**Fix:**
- Add `aria-label={`Go to showcase ${idx + 1}: ${showcase.title}`}`.
- Add `aria-current={idx === currentShowcaseIndex}` to the active dot.
- Consider wrapping dots in a `<nav aria-label="Showcase navigation">`.

---

## HIGH Issues

### H-1. Buttons inside Links create invalid HTML nesting

**File:** Welcome.tsx (lines 299-308, 348-357, 389-398, etc.)
**WCAG:** 4.1.1 Parsing (A)

Every CTA in Welcome.tsx uses `<Link><button>...</button></Link>`, which produces `<a><button></button></a>`. This is invalid HTML. Interactive elements nested inside other interactive elements create unpredictable behavior for assistive technology.

**Fix:** Use either `<Link className="btn-styles">` (styled as a button) or `<button onClick={() => navigate(path)}>`. Do not nest them.

---

### H-2. Tab bar in LeftPanel has no `role="tablist"` / `role="tab"` / `role="tabpanel"` semantics

**File:** LeftPanel.tsx, lines 34-50
**WCAG:** 4.1.2 Name, Role, Value (A)

The Builder/Chat/Listen tabs look and behave like tabs but are implemented as plain `<button>` elements with no ARIA tab pattern. There is no `aria-selected`, no `aria-controls`, and no `role="tabpanel"` on the content areas.

**Fix:**
- Container: `role="tablist"` with `aria-label="Panel mode"`.
- Each tab button: `role="tab"`, `aria-selected={activeTab === value}`, `aria-controls={`panel-${value}`}`.
- Each content panel: `role="tabpanel"`, `id={`panel-${value}`}`, `aria-labelledby={`tab-${value}`}`.

---

### H-3. Section action buttons hidden from keyboard users via `opacity-0`

**File:** SectionsSection.tsx, lines 202-224
**WCAG:** 2.1.1 Keyboard (A), 2.4.7 Focus Visible (AA)

Move up, move down, duplicate, and delete buttons use `opacity-0 group-hover:opacity-100`. While some have `focus-visible:opacity-100` (duplicate, delete), the move up/down buttons do not. Even with `focus-visible:opacity-100`, a keyboard user must blindly tab into an invisible button before it appears.

**Fix:**
- Add `focus-within:opacity-100` to the parent container so all action buttons become visible when any child is focused.
- Alternatively, keep buttons always visible at reduced opacity (`opacity-40`) instead of `opacity-0`.

---

### H-4. Custom toggle switch in ListenTab has no proper role

**File:** ListenTab.tsx, lines 239-244
**WCAG:** 4.1.2 Name, Role, Value (A)

The "Random drift" toggle is a `<button>` styled as a switch but has no `role="switch"` or `aria-checked` attribute. It has `aria-label="Toggle random mode"` which is good, but screen readers will not convey on/off state.

**Fix:** Add `role="switch"` and `aria-checked={randomMode}`.

---

### H-5. Range inputs in ListenTab lack visible labels

**File:** ListenTab.tsx (SliderRow component, line 287-303)
**WCAG:** 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A)

Each slider has `aria-label` (good), but the visible text label is either the `leftHint` or the `label` prop shown as a tiny `text-white/40` span. The label text is not programmatically associated with the input via `<label>` or `id`/`htmlFor`.

**Fix:** Use `<label htmlFor={id}>` wrapping or `htmlFor` association instead of relying solely on `aria-label`.

---

### H-6. Dropdown menus (TopBar hamburger, SectionsSection add menu) lack proper ARIA menu patterns

**Files:** TopBar.tsx lines 153-205, SectionsSection.tsx lines 277-303
**WCAG:** 4.1.2 Name, Role, Value (A)

The hamburger dropdown and "Add Section" popup have no `role="menu"`, `role="menuitem"`, or arrow-key navigation. The hamburger button has `aria-expanded` (good) but the dropdown itself lacks `role="menu"`. Neither menu traps focus or supports Escape to close.

**Fix:**
- Add `role="menu"` to dropdown containers and `role="menuitem"` to items.
- Implement arrow-key navigation within the menu.
- Close on Escape key press.
- Trap focus within the open menu.

---

### H-7. Welcome page chat input is a non-functional trap

**File:** Welcome.tsx, lines 646-654
**WCAG:** 2.1.2 No Keyboard Trap (A)

The disabled text input with placeholder "Type your message..." is focusable but non-functional. Keyboard users will tab into it, see it is disabled, but there is no indication of why. The "Get Started" button below is also disabled until the animation completes, but there is no `aria-disabled` messaging or screen reader explanation.

**Fix:**
- Add `aria-describedby` pointing to a visually-hidden span: "Watch the demo complete, then click Get Started."
- Or remove the input from tab order with `tabIndex={-1}` since it is decorative.

---

## MEDIUM Issues

### M-1. Color contrast: crimson text on dark backgrounds

**Files:** ListenTab.tsx (`text-[#C1283E]` on `bg-[#1a1a1a]`), Welcome.tsx (`text-[#A51C30]` on `bg-[#1e1e1e]`)
**WCAG:** 1.4.3 Contrast Minimum (AA)

- `#C1283E` on `#1a1a1a` = approximately 3.8:1 (fails AA for normal text, needs 4.5:1).
- `#A51C30` on `#1e1e1e` = approximately 3.2:1 (fails AA).
- `text-white/40` (rgba 255,255,255,0.4 = effective ~#666 on dark) used for labels in ListenTab = approximately 3.4:1 (fails AA).

**Fix:** Lighten crimson to at least `#E03050` or use it only for large text (24px+). Change `text-white/40` to `text-white/60` minimum.

---

### M-2. Color contrast: light mode concerns

**Files:** LeftPanel.tsx, SectionsSection.tsx (via `hb-accent/25` borders, `hb-text-muted`)
**WCAG:** 1.4.3 Contrast Minimum (AA)

The `border-hb-accent/25` class creates very faint crimson borders. If `hb-accent` is `#A51C30`, then 25% opacity on a cream/white background produces an almost invisible border that non-sighted users rely on for boundary understanding. `text-hb-text-muted` values need verification against light backgrounds.

**Fix:** Audit all CSS custom properties for both dark and light mode contrast ratios. Ensure borders used as visual boundaries have at least 3:1 contrast (1.4.11 Non-text Contrast).

---

### M-3. No focus management on tab switches in LeftPanel

**File:** LeftPanel.tsx
**WCAG:** 2.4.3 Focus Order (A)

When switching between Builder/Chat/Listen tabs, focus stays on the tab button. The newly revealed content panel does not receive focus. For complex panels like Listen (which has interactive controls), users must tab forward many times to reach the content.

**Fix:** After tab switch, programmatically move focus to the first interactive element in the new panel, or to the panel container with `tabIndex={-1}`.

---

### M-4. No focus management on route changes

**Files:** Welcome.tsx (Link navigation to /builder, /new-project)
**WCAG:** 2.4.3 Focus Order (A)

Using React Router `<Link>` does not automatically manage focus on route change. When navigating from Welcome to Builder, focus may remain at the top of the DOM or in an unpredictable location.

**Fix:** Implement a `ScrollToTop` + focus-management component in the router that moves focus to `<main>` on route change.

---

### M-5. Images missing meaningful alt text

**File:** Welcome.tsx, line 319-322
**WCAG:** 1.1.1 Non-text Content (A)

The background-image showcase uses `alt=""` for its hero image. While empty alt is correct for decorative images, the image visually establishes the mood/theme of "Listen Mode" and arguably conveys meaning. The Bradley Ross portrait image correctly has `alt="Bradley Ross"`.

**Fix:** Evaluate whether the hero background image should have descriptive alt text like "Immersive digital landscape representing Listen Mode."

---

### M-6. The `<style>` tag injected in ListenTab is not scoped

**File:** ListenTab.tsx, lines 277-282
**WCAG:** Not directly a WCAG issue, but a robustness concern.

The `@keyframes orb-pulse` is injected as a raw `<style>` element inside the component. If multiple instances mount, it duplicates. More importantly, it prevents the `prefers-reduced-motion` fix from being applied via standard CSS tooling.

**Fix:** Move the keyframe to a CSS module or the global stylesheet where `prefers-reduced-motion` can be properly applied.

---

### M-7. No visible focus indicators on Welcome page buttons

**File:** Welcome.tsx (all `<button>` and `<Link>` elements)
**WCAG:** 2.4.7 Focus Visible (AA)

Unlike TopBar (which has `focus-visible:ring-2`), none of the Welcome page buttons have focus-visible styles. The CTA buttons, restart button, and showcase dots have no keyboard focus indicator.

**Fix:** Add `focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2` to all interactive elements.

---

### M-8. SectionsSection `role="button"` rows lack accessible names

**File:** SectionsSection.tsx, lines 151-262
**WCAG:** 4.1.2 Name, Role, Value (A)

Each section row uses `role="button"` and `tabIndex={0}` (good), but has no `aria-label`. The accessible name is derived from the text content inside, which includes the section name, ID, and icon. This creates a cluttered announcement like "Star Hero hero-1 Eye ChevronUp ChevronDown Copy Trash2".

**Fix:** Add `aria-label={`Select ${sectionName} section`}` and mark action buttons with `aria-hidden` on their icon-only labels, or restructure so the row is a container and the "select" action is a separate focusable element.

---

## LOW Issues

### L-1. Mobile hamburger menu items lack aria-labels

**File:** TopBar.tsx, lines 156-169 (Undo/Redo in mobile menu)
**WCAG:** 4.1.2 Name, Role, Value (A)

The mobile menu Undo/Redo buttons have visible text ("Undo", "Redo") but no `aria-label`. Since they contain text + icon, this is functional but could be clearer for screen readers by hiding the icon from the accessibility tree with `aria-hidden="true"` on the Lucide component.

**Fix:** Add `aria-hidden="true"` to icon components inside labeled buttons across all menus.

---

### L-2. Decorative icons in SectionsSection add-menu lack aria-hidden

**File:** SectionsSection.tsx, lines 288-290
**WCAG:** 1.1.1 Non-text Content (A)

Lucide icons in the add-section dropdown menu are decorative (text labels exist) but lack `aria-hidden="true"`, so screen readers may announce the SVG content or element.

**Fix:** Add `aria-hidden="true"` to all decorative `<Icon>` components.

---

### L-3. The Sparkles icon in Welcome page badge lacks aria-hidden

**File:** Welcome.tsx, lines 265-266
**WCAG:** 1.1.1 Non-text Content (A)

`<Sparkles className="w-4 h-4" />` is decorative but not hidden from assistive technology.

**Fix:** Add `aria-hidden="true"`.

---

### L-4. Hardcoded color values reduce theme flexibility for high-contrast mode

**Files:** Welcome.tsx, ListenTab.tsx
**WCAG:** 1.4.11 Non-text Contrast (AA)

Both files use numerous hardcoded hex colors (`bg-[#0b0f1a]`, `bg-[#1a1a1a]`, `text-[#A51C30]`) rather than CSS custom properties. This prevents users from applying Windows High Contrast Mode or custom user stylesheets effectively.

**Fix:** Migrate hardcoded colors to CSS custom properties (as TopBar and LeftPanel already use `hb-*` tokens). Use `forced-colors: active` media query for high-contrast overrides.

---

## Recommended Priority Order

1. **B-1** (prefers-reduced-motion) -- Quick win, global impact
2. **B-2** (landmark roles) -- Quick win, global impact
3. **B-3** (skip navigation) -- Quick win, single component
4. **B-4** (aria-live regions) -- Medium effort, critical for screen readers
5. **B-5** (showcase dot labels) -- Quick win
6. **H-1** (button-in-link nesting) -- Medium effort, invalid HTML
7. **H-2** (tab semantics) -- Medium effort
8. **H-3** (hidden action buttons) -- Quick win
9. **M-1** (color contrast) -- Quick win, affects visual accessibility

---

## Testing Checklist

- [ ] Run axe-core or Lighthouse accessibility audit
- [ ] Test with VoiceOver (macOS) / NVDA (Windows)
- [ ] Test keyboard-only navigation end-to-end
- [ ] Verify color contrast with WebAIM Contrast Checker
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Test with Windows High Contrast Mode
- [ ] Validate HTML (no nested interactive elements)
