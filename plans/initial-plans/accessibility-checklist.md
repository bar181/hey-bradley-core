# Hey Bradley — WCAG 2.2 AA Accessibility Checklist

**Standard:** WCAG 2.2 Level AA
**Scope:** Builder shell + Reality Canvas preview
**Related Spec:** `plans/initial-plans/07.accessibility-button.md` (Phase 4 accessibility dialog)

---

## How to Use This Checklist

- **Severity**: P0 = must fix before launch, P1 = fix in current phase, P2 = fix in future phase
- **Status**: PASS / FAIL / PARTIAL / N/A
- Each item includes the WCAG success criterion, test method, and severity

---

## 1. Perceivable

Content must be presentable in ways all users can perceive.

### 1.1 Text Alternatives

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 1.1.1 | All `<img>` elements have meaningful `alt` attributes | 1.1.1 Non-text Content | P0 | Inspect all `<img>` tags. Decorative images should have `alt=""` and `role="presentation"`. Informative images need descriptive alt text. |
| 1.1.2 | Icon-only buttons have accessible names (`aria-label`, `title`, or visually hidden text) | 1.1.1 Non-text Content | P0 | Tab to each icon button. Screen reader should announce purpose (e.g., "Undo", not "button"). |
| 1.1.3 | SVGs used as icons have `aria-hidden="true"` when parent has accessible name | 1.1.1 Non-text Content | P1 | Inspect SVGs. Decorative SVGs inside labeled buttons should be `aria-hidden="true"`. Standalone informative SVGs need `role="img"` + `aria-label`. |
| 1.1.4 | Video/audio content has text alternatives or captions | 1.2.1 Audio/Video Only | P1 | Check any embedded media for captions or transcripts. |

### 1.2 Color Contrast

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 1.2.1 | Normal text (< 18px, or < 14px bold) has >= 4.5:1 contrast ratio against background | 1.4.3 Contrast (Minimum) | P0 | Use browser DevTools color picker, axe-core, or Playwright script. Check across all themes. |
| 1.2.2 | Large text (>= 18px, or >= 14px bold) has >= 3:1 contrast ratio against background | 1.4.3 Contrast (Minimum) | P0 | Same tools. Focus on headings, CTA buttons, hero text. |
| 1.2.3 | UI components (buttons, inputs, focus rings) have >= 3:1 contrast against adjacent colors | 1.4.11 Non-text Contrast | P0 | Check button borders, input borders, toggle states, active tab indicators. |
| 1.2.4 | Color is not the only means of conveying information | 1.4.1 Use of Color | P1 | Check active tab indicators, selected states, error states. Must have shape/text/icon in addition to color. |
| 1.2.5 | Placeholder text has >= 4.5:1 contrast (or is not relied upon for instruction) | 1.4.3 Contrast (Minimum) | P1 | Inspect input placeholders. If placeholder is the only label, it must meet contrast. |

### 1.3 Text Resize and Reflow

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 1.3.1 | All text is >= 12px computed size | 1.4.4 Resize Text | P1 | Audit all computed font sizes. No text should render below 12px. |
| 1.3.2 | Text can be resized to 200% without loss of content or functionality | 1.4.4 Resize Text | P1 | Zoom browser to 200%. Verify no text is clipped, overlapping, or hidden. |
| 1.3.3 | Content reflows at 320px viewport width without horizontal scrolling | 1.4.10 Reflow | P2 | Resize viewport to 320px width. No horizontal scroll for text content. |
| 1.3.4 | Line height is at least 1.5x font size for body text | 1.4.12 Text Spacing | P2 | Inspect paragraph and body text computed line-height. |

### 1.4 Adaptable Content

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 1.4.1 | Information and relationships conveyed through presentation are programmatically determinable | 1.3.1 Info and Relationships | P1 | Headings use semantic h1-h6. Lists use ul/ol. Tables use th. Groups use fieldset/legend. |
| 1.4.2 | Meaningful sequence of content is programmatically determinable | 1.3.2 Meaningful Sequence | P1 | Read page with CSS disabled. Content order should still make sense. |
| 1.4.3 | Instructions do not rely solely on sensory characteristics (shape, size, position) | 1.3.3 Sensory Characteristics | P2 | Review any instructional text. "Click the red button" is bad; "Click Submit" is good. |

---

## 2. Operable

UI components and navigation must be operable by all users.

### 2.1 Keyboard Accessible

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 2.1.1 | All interactive elements are reachable via Tab key | 2.1.1 Keyboard | P0 | Tab through entire interface. Every button, link, input, toggle should receive focus. |
| 2.1.2 | All interactive elements can be activated with Enter or Space | 2.1.1 Keyboard | P0 | Focus each control and press Enter/Space. Buttons, links, toggles must respond. |
| 2.1.3 | No keyboard trap — user can always Tab away from any component | 2.1.2 No Keyboard Trap | P0 | Tab through the entire page. Verify focus never gets stuck. Exception: modal dialogs should trap focus but release on ESC. |
| 2.1.4 | Custom keyboard shortcuts do not conflict with browser/AT shortcuts | 2.1.4 Character Key Shortcuts | P2 | Review any single-character keyboard shortcuts. Must be remappable or disableable. |

### 2.2 Focus Management

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 2.2.1 | Visible focus indicator on all interactive elements | 2.4.7 Focus Visible | P0 | Tab through interface. Every focused element must show a visible ring, outline, or highlight. Minimum 2px, >= 3:1 contrast. |
| 2.2.2 | Focus order follows a logical, meaningful sequence | 2.4.3 Focus Order | P0 | Tab through the page. Focus should move left-to-right, top-to-bottom, matching visual layout. |
| 2.2.3 | Focus is managed correctly when content changes (modals, drawers, accordions) | 2.4.3 Focus Order | P1 | Open/close dialogs, expand accordions. Focus should move to new content and return to trigger on close. |
| 2.2.4 | Focus indicator has minimum area of 2px perimeter or equivalent | 2.4.13 Focus Appearance | P1 | Inspect focus outline. Should be >= 2px solid outline with >= 3:1 contrast against both the component and its background. |

### 2.3 Timing and Motion

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 2.3.1 | No content flashes more than 3 times per second | 2.3.1 Three Flashes | P0 | Visual review of all animations. No strobing or rapid flash effects. |
| 2.3.2 | Animation can be disabled (respects `prefers-reduced-motion`) | 2.3.3 Animation from Interactions | P1 | Set OS to reduced motion. Verify all CSS transitions, scroll effects, and hover animations stop. |
| 2.3.3 | No time limits on user actions, or limits are adjustable | 2.2.1 Timing Adjustable | P2 | Check for session timeouts, auto-advancing content, or timed interactions. |

### 2.4 Navigation

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 2.4.1 | Skip navigation link is provided | 2.4.1 Bypass Blocks | P1 | Load page, press Tab once. A "Skip to main content" link should appear and function. |
| 2.4.2 | Page has a descriptive `<title>` | 2.4.2 Page Titled | P1 | Check `document.title`. Should describe the page purpose. |
| 2.4.3 | Heading hierarchy is logical (h1 > h2 > h3, no skipped levels) | 2.4.6 Headings and Labels | P1 | Inspect all heading elements. One h1 per page, no jumps from h1 to h3. |
| 2.4.4 | Link/button text is descriptive (not "click here" or "read more") | 2.4.4 Link Purpose | P1 | Review all link and button text. Purpose must be clear from text alone or from immediate context. |
| 2.4.5 | Touch targets are at least 24x24 CSS pixels | 2.5.8 Target Size (Minimum) | P1 | Inspect computed dimensions of all buttons, links, and interactive elements. |

---

## 3. Understandable

Content and UI must be understandable.

### 3.1 Readable

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 3.1.1 | Page language is declared (`<html lang="en">`) | 3.1.1 Language of Page | P0 | Inspect `<html>` element for `lang` attribute. |
| 3.1.2 | Text is readable — no excessively dense paragraphs, appropriate font choices | 3.1.5 Reading Level | P2 | Visual review. Body text should be 16px+ with adequate line spacing. |

### 3.2 Predictable

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 3.2.1 | Focusing on an element does not cause unexpected changes | 3.2.1 On Focus | P0 | Tab to every control. No content should change, no navigation should occur just from receiving focus. |
| 3.2.2 | Changing a control value does not cause unexpected context changes | 3.2.2 On Input | P1 | Interact with dropdowns, toggles, inputs. Changes should be predictable and not navigate away. |
| 3.2.3 | Navigation is consistent across the interface | 3.2.3 Consistent Navigation | P2 | Compare navigation patterns across different views/tabs. |

### 3.3 Input Assistance

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 3.3.1 | Form inputs have visible labels (not just placeholders) | 3.3.2 Labels or Instructions | P0 | Inspect all inputs. Each must have a `<label>` or `aria-label`. Placeholder alone is insufficient. |
| 3.3.2 | Error messages are descriptive and identify the field | 3.3.1 Error Identification | P1 | Trigger validation errors. Messages should name the field and describe the problem. |
| 3.3.3 | Required fields are indicated before form submission | 3.3.2 Labels or Instructions | P1 | Check required fields for visual indicator and `aria-required="true"`. |

---

## 4. Robust

Content must be robust enough for assistive technologies.

### 4.1 Compatible

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 4.1.1 | HTML is valid — no duplicate IDs, proper nesting | 4.1.1 Parsing | P1 | Run HTML validator. Check for duplicate `id` attributes, unclosed tags. |
| 4.1.2 | All interactive elements have accessible name, role, and value | 4.1.2 Name, Role, Value | P0 | Use screen reader or axe-core. Every button, link, input, toggle must announce its name and purpose. |
| 4.1.3 | Status messages are announced to screen readers without receiving focus | 4.1.3 Status Messages | P2 | Check for `role="status"`, `role="alert"`, or `aria-live` regions for toast notifications, loading states, etc. |

### 4.2 ARIA Usage

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 4.2.1 | ARIA roles are used correctly (no `role="button"` on `<div>` without keyboard support) | 4.1.2 Name, Role, Value | P0 | Inspect elements with `role` attributes. `role="button"` must have keyboard handlers. `role="tab"` must be in `role="tablist"`. |
| 4.2.2 | `aria-expanded`, `aria-selected`, `aria-pressed` reflect actual state | 4.1.2 Name, Role, Value | P1 | Toggle controls and inspect ARIA attributes. States must update dynamically. |
| 4.2.3 | `aria-hidden="true"` is not applied to focusable elements or their ancestors | 4.1.2 Name, Role, Value | P0 | Search for `aria-hidden="true"` near interactive elements. Hidden content must not be tabbable. |

### 4.3 Landmark Regions

| # | Check | WCAG | Severity | How to Test |
|---|-------|------|----------|-------------|
| 4.3.1 | Page has `<main>` landmark | 1.3.1 Info and Relationships | P1 | Inspect DOM for `<main>` or `role="main"`. Exactly one per page. |
| 4.3.2 | Navigation regions use `<nav>` or `role="navigation"` | 1.3.1 Info and Relationships | P1 | Check tab bars, section lists for nav landmark. |
| 4.3.3 | All page content is within a landmark region | 1.3.1 Info and Relationships | P2 | Use axe-core or Accessibility Tree inspector. No orphan content outside landmarks. |

---

## Phase Mapping

| Phase | Scope |
|-------|-------|
| **Phase 2** | Fix P0 contrast issues, add skip link, fix input labels, add missing ARIA labels |
| **Phase 3** | Fix P1 items — heading hierarchy, reduced motion, ARIA states |
| **Phase 4** | Master Settings & Accessibility Dialog (07.accessibility-button.md) — text scale, contrast modes, reduce motion toggle |
| **Phase 5+** | P2 items — reflow, text spacing, status messages |
