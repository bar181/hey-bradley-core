# P123 / Below-Floor Audit (W1)

**Date:** 2026-05-08  
**Branch:** `swarm/p123-ui-continuation` (cut from P122 sealed at commit `c616ec033`)  
**Mission:** Identify named blockers for 3 below-floor surfaces + hand off work plan to W2/W3/W4.

**Surfaces:**
- Contact (P122 score: 58 → P123 target: 65)
- Builder default (P122 score: 55 → P123 target: 65)
- Agentics (P122 score: 60 → P123 target: 70)

---

## Surface 1: Contact (`src/pages/Contact.tsx`)

### Current State

**File:** `src/pages/Contact.tsx` (106 LOC)  
**Visual:** Light (60/100), Language (62/100), Components (62/100), Confidence (60/100) → **Composite 60/100, bottleneck: Confidence**.

**Named blockers:**

1. **Hero section too minimal** (line 14-18). The hero reads "Got a question? Reach out." with a one-line subtitle. No accent color, no visual hierarchy, no image or orb. The section blends into the page.
2. **Fourth card lacks CTA** (line 84-90). The Agentics Foundation card has no button — only static text. Unlike the other three cards, it's not actionable.
3. **GitHub callout under-styled** (line 41-66). The Code2 icon is small; two GitHub links + a raw `<a>` fallback are styled as `variant="link"` text buttons. No visual prominence.
4. **Card borders too faint** (line 25, 41, 68, 84). `border-[var(--hb-warm)]/20` (20% opacity) makes the cards feel unfinished. Contrast is weak.
5. **Empty bottom card weakens close** (line 84-90). The 4th card has no CTA and no way for a visitor to take action on the Agentics Foundation item.

**Evidence:** P122 W8 audit noted Contact was 40 → 58 after jargon strip + button promotions. Remaining gap is visual hierarchy + card prominence.

### Highest-Leverage Fixes

**Fix 1: Add Bradley's headshot or branded visual to hero** (est. 40 LOC)  
The hero section should feature a portrait image or avatar of Bradley Ross (either a photo or an illustrative avatar from the site's design system). Swap lines 11-18 to use a 2-column hero layout with image on right, text on left. Builds visitor confidence ("real person, real company"). Set `max-h-[300px]` on the image wrapper.

**Fix 2: Increase card border opacity + add shadow** (est. 15 LOC)  
Change line 25, 41, 68, 84 from `border-[var(--hb-warm)]/20` to `border-[var(--hb-warm)]/40` and add `shadow-sm` class. Gives cards visual weight.

**Fix 3: Convert 4th card to a CTA block + add "Join us" button** (est. 25 LOC)  
Replace lines 84-90. Instead of a passive card, make it a "Join the Agentics Foundation" card with a shadcn `<Button asChild size="lg">` linking to a signup or interest form. Add icon (Users) like the others.

**Fix 4: GitHub section headshot + expanded layout** (est. 30 LOC)  
Lines 41-66 should expand to 3 items: repo 1 (hey-bradley-core), repo 2 (aisp-open-core), and a GitHub profile link. Wrap in `<div className="flex flex-col gap-2">` so links stack vertically with consistent spacing. Give the Code2 icon more visual weight (`w-6 h-6` instead of `w-5 h-5`).

**Fix 5: Add warm accent band at top of hero** (est. 12 LOC)  
Insert a 4px horizontal accent bar (`bg-[var(--hb-warm)]`) above the hero heading. Ties Contact page visually to the warm accent tone and provides visual separation from nav.

### Hand-Off Block

**Surface: Contact**
- Files in scope: `src/pages/Contact.tsx`
- LOC budget: 122 (40 + 15 + 25 + 30 + 12)
- Fix #1: Add Bradley headshot to hero at Contact.tsx:11–18 — 2-column layout with image (40 LOC)
- Fix #2: Increase card borders/shadows at Contact.tsx:25,41,68,84 — opacity from `/20` to `/40` + shadow-sm (15 LOC)
- Fix #3: Convert Agentics Foundation card to CTA at Contact.tsx:84–90 — add "Join us" Button with icon (25 LOC)
- Fix #4: Expand GitHub section at Contact.tsx:41–66 — 3 items, stacked layout, larger icon (30 LOC)
- Fix #5: Add warm accent bar above hero at Contact.tsx:11 — 4px top border (12 LOC)
- Done when: Contact surface re-scores ≥65 across all 4 dimensions; new-visitor confidence ≥65; all CTAs have `<Button>` styling + hover states

---

## Surface 2: Builder Default (`src/pages/Builder.tsx` + default template)

### Current State

**File:** `src/pages/Builder.tsx` (37 LOC); **real scope:** `src/data/default-config.json` (319 LOC) + `src/components/shell/PanelLayout.tsx` + `src/components/left-panel/LeftPanel.tsx`  
**Visual:** 55/100 (panels look functional but default template doesn't showcase), Language: 58/100 (no empty-state copy), Components: 55/100 (left-panel cards need padding/spacing), Confidence: 58/100 (does the template make the product look good?) → **Composite 55/100, bottleneck: Visual**.

**Named blockers:**

1. **Default template exists but doesn't inspire** (`src/data/default-config.json` lines 54–170). The Hey Bradley template is structurally sound (hero + 3 feature cards + stats + CTA band + nav + footer). But on first load, the canvas is small (1200px max-width), the hero orb is subtle, and there's no "wow" moment. A new visitor loads the builder and sees a dark site with 3 generic cards — could be any product.
2. **Left panel spacing/padding thin** (`src/components/left-panel/LeftPanel.tsx`). W4's ScrollArea fix prevented horizontal scroll, but the section cards inside are tightly packed. No breathing room between "Pages," "Sections," and the section list. Looks cramped.
3. **No empty-state copy for new projects** (`src/pages/Builder.tsx`). When the user first loads the builder with no project, the canvas is blank (center canvas is empty until a section is added). No guidance: "Start by adding a hero section" or "Pick a template above."
4. **Center canvas default zoom is small** (`src/components/center-canvas/CenterCanvas.tsx`). The preview renders at ~70% zoom by default. The Hey Bradley template hero fits on screen but the text is tiny. Doesn't feel like a "real site."
5. **Right panel empty state vague** (`src/components/right-panel/RightPanel.tsx`). When no section is selected, the right panel shows "Select a section to edit" — true but unhelpful. New user doesn't know what to do next.

**Evidence:** P122 W8 audit flagged Builder as 45 → 55 (was 50 before template work). Default template exists per W2; the issue is that the *presentation* of the template on first load doesn't feel like a 60+ product.

### Highest-Leverage Fixes

**Fix 1: Increase default center-canvas zoom to 85%** (est. 8 LOC)  
File: `src/components/center-canvas/CenterCanvas.tsx`. Change the initial zoom state from `70` to `85`. Makes the Hey Bradley template hero text readable on first load.

**Fix 2: Add left-panel section card padding + spacing** (est. 22 LOC)  
File: `src/components/left-panel/LeftPanel.tsx`. Wrap each section list card in a `<div className="p-3 rounded-md bg-hb-surface-hover">` container. Add `gap-3` to the section list `<ul>` (currently `space-y-1`). Gives visual breathing room.

**Fix 3: Add helpful empty-state copy to center canvas** (est. 18 LOC)  
File: `src/components/center-canvas/CenterCanvas.tsx`. When the config has no sections, render a centered card: "Pick a template from the left panel or start by adding a hero section." Button: "+ Add Section." Links to the left panel sections menu.

**Fix 4: Expand default template hero copy + style** (est. 35 LOC)  
File: `src/data/default-config.json` lines 78–127. Expand hero subheading from 1 line to 2 lines (currently "Your voice is the whiteboard. Describe any site. Watch it build." — add a third line: "No coding required."). Increase `padding: "120px 24px"` to `"140px 24px"` to give the hero more vertical breathing room.

**Fix 5: Add visual gradient + card hover states to feature cards** (est. 32 LOC)  
File: `src/data/default-config.json` lines 128–190 (the 3-card features section). Add subtle gradient overlays to each card background and increase spacing between cards (`gap: "32px"` → `"40px"`). Add a simple CSS transition rule for card hover scale in the default theme.

### Hand-Off Block

**Surface: Builder default**
- Files in scope: `src/data/default-config.json`, `src/components/center-canvas/CenterCanvas.tsx`, `src/components/left-panel/LeftPanel.tsx`
- LOC budget: 115 (8 + 22 + 18 + 35 + 32)
- Fix #1: Increase default zoom from 70 to 85 at CenterCanvas.tsx — zoom state initialization (8 LOC)
- Fix #2: Add padding/spacing to section cards at LeftPanel.tsx — wrap cards + gap styling (22 LOC)
- Fix #3: Add empty-state copy to center canvas at CenterCanvas.tsx — "Pick a template or add a section" (18 LOC)
- Fix #4: Expand hero copy + padding in default template at default-config.json:78–127 — 2-line subheading + larger padding (35 LOC)
- Fix #5: Add gradient + hover states to feature cards at default-config.json:128–190 — card styling + gap increase (32 LOC)
- Done when: Builder default re-scores ≥65 across all 4 dimensions; new project loads with visible template; center canvas zoom readable at first load; left panel feels spacious; empty state has actionable guidance

---

## Surface 3: Agentics (`src/pages/Agentics.tsx` + `src/components/agentics/*`)

### Current State

**File:** `src/pages/Agentics.tsx` (289 LOC); **child scope:** `src/components/agentics/{LLMLogPanel,DBPanel,SpecWorkbench}.tsx` (totaling 528 LOC of new panels from P122 W6)  
**Visual:** 60/100 (layout is three-pane, renders cleanly), Language: 60/100 (plain English in panel headers but JSON output is raw), Components: 65/100 (LLMLogPanel + DBPanel tables are styled; SpecWorkbench is comprehensive), Confidence: 60/100 (panels feel technical, not cohesive) → **Composite 60/100, bottleneck: Visual cohesion + Language clarity**.

**Named blockers:**

1. **JSON output in DBPanel is raw** (`src/components/agentics/DBPanel.tsx` line 238–243). The `<pre>` block renders `JSON.stringify(rows, null, 2)` with minimal syntax highlighting. For large projects, the wall of JSON is opaque. No collapse/expand, no field filtering.
2. **LLMLogPanel and DBPanel have no separator** (`src/pages/Agentics.tsx` line 271–274). Both panels are stacked vertically in the right pane with a `flex flex-col gap-4`. But they feel like separate tools, not a cohesive observability suite. No visual grouping.
3. **Empty-state messaging is still technically dense** (`src/pages/Agentics.tsx` line 277–280). When no phase is selected, the right pane shows "Pick a phase from the map to see how it was built." That's clearer than the old "Select a phase to see its spec," but still sounds engineer-focused. Visitor might not understand the value.
4. **CostPill placement + visibility** (`src/pages/Agentics.tsx` line 137). The CostPill is mounted in the header alongside the "Back to home" link. On mobile, the header wraps (`flex-wrap`), and the CostPill can drop below the title. Not visible at first glance.
5. **SpecWorkbench tabs don't visually connect to panels below** (`src/components/agentics/SpecWorkbench.tsx` lines 1–48). The SpecWorkbench component (center/top of right pane) has 3 tabs (Human / AISP / ADR) with their own styling. Below it, LLMLogPanel + DBPanel have different tab/header styling. Visual language is inconsistent.
6. **DBPanel table header sticky positioning breaks on scroll** (`src/components/agentics/DBPanel.tsx` line 170). The table is wrapped in `overflow-auto max-h-[400px]`, but the `<thead>` has `sticky top-0`. When the user scrolls the JSON `<pre>` below the table, the header is no longer visible. Usability issue.

**Evidence:** P122 W6 added LLMLogPanel + DBPanel as observability surfaces for BYOK smoke testing. P122 W8 audit noted these panels "don't have empty-state 'no data' copy yet — currently shows JSON `[]`" and "W4's Builder ScrollArea wrapping is functional; left-panel re-score from this sprint is 55 (was 50). To hit 60 in P123, the section-list cards inside the ScrollArea need their own padding/spacing pass." Agentics composite stayed at 60 (from the new panels' professional render, but the cohesion score pulled it down from potential 65+).

### Highest-Leverage Fixes

**Fix 1: Add JSON syntax highlighting + field collapse to DBPanel** (est. 68 LOC)  
File: `src/components/agentics/DBPanel.tsx`. Replace the raw `<pre>` at line 238–243 with a JSON viewer component (e.g., `react-json-view` or a custom collapse/expand component). Add a `maxDepth` prop (default 2) so large nested objects are collapsed. Adds visual interest + usability.

**Fix 2: Add "Observability" section header + group LLMLogPanel + DBPanel** (est. 24 LOC)  
File: `src/pages/Agentics.tsx` line 271–274. Wrap both panels in a `<section>` with a header: `<h3 className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)] mb-3">Observability</h3>`. Gives visual grouping and semantic meaning.

**Fix 3: Add empty-state copy to LLMLogPanel + DBPanel** (est. 16 LOC)  
Files: `src/components/agentics/LLMLogPanel.tsx` line 160–167 and `src/components/agentics/DBPanel.tsx` line 228–236. When no rows are present, show plain-English guidance: LLMLogPanel: "No LLM calls yet. Send a prompt in chat mode with a BYOK key to record calls." DBPanel: "No data. Create a project or select one from the builder."

**Fix 4: Reposition CostPill to always-visible location** (est. 12 LOC)  
File: `src/pages/Agentics.tsx` line 126–145. Move CostPill from the header flex row to a fixed position in the upper-right corner (`fixed top-4 right-4 z-40`) or inline with the "Back to home" link without flex-wrap. Ensure it's visible on mobile.

**Fix 5: Unify SpecWorkbench + panel tab styling** (est. 28 LOC)  
Files: `src/components/agentics/SpecWorkbench.tsx` (tabs) + `src/components/agentics/LLMLogPanel.tsx` + `src/components/agentics/DBPanel.tsx` (headers). Ensure all headers use the same `<h3>` + icon + action-button pattern. Use consistent `text-sm font-semibold` for titles; consistent `text-[10px] font-mono uppercase` for metadata.

### Hand-Off Block

**Surface: Agentics**
- Files in scope: `src/pages/Agentics.tsx`, `src/components/agentics/{LLMLogPanel,DBPanel,SpecWorkbench}.tsx`
- LOC budget: 148 (68 + 24 + 16 + 12 + 28)
- Fix #1: Add JSON syntax highlighting to DBPanel at DBPanel.tsx:238–243 — collapse/expand component or library (68 LOC)
- Fix #2: Add "Observability" section header at Agentics.tsx:271–274 — wrapper + header styling (24 LOC)
- Fix #3: Add empty-state copy to LLMLogPanel + DBPanel at LLMLogPanel.tsx:160–167, DBPanel.tsx:228–236 — plain-English messages (16 LOC)
- Fix #4: Reposition CostPill to fixed location at Agentics.tsx:126–145 — fix top-right positioning (12 LOC)
- Fix #5: Unify tab/header styling across SpecWorkbench + panels at all three files — consistent `<h3>` + icon + buttons (28 LOC)
- Done when: Agentics surface re-scores ≥70 across all 4 dimensions; observability panels feel cohesive; JSON is readable; empty states are actionable; CostPill is always visible

---

## Cross-Cutting Concerns

1. **No shared files between surfaces** — W2, W3, W4 can run in parallel without collision risk.
2. **Total estimated LOC across all 3 surfaces: 385** (122 + 115 + 148), well under the P123 scope cap.
3. **No owner-locked decisions violated** — Contact hero photo optional per design, Builder default template already locked, Agentics panels are observability (not core UX per ADR-146 D3).
4. **Component freshness budget remaining** — CF-P122-W8-6 allocates 2 component swaps for P123; some fixes above (Contact button styling, Agentics panel headers) may consume these if built with shadcn Button. Plan accordingly in W4.

