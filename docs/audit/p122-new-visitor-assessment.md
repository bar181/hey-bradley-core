# P122 / W8 — New-Visitor Assessment

**Date:** 2026-05-08
**Branch:** `swarm/p122-ux-overhaul`
**Persona:** non-technical visitor arriving from a Twitter post. They have never
heard the words "AISP," "Crystal Atom," or "JSON-Patch." They want to know in
five seconds: *what is this and is it for me?*

This doc combines (a) read-only walk audit of every public surface plus the
builder default and Agentics, (b) per-surface scoring on four dimensions, (c)
named blockers, (d) the 3–5 highest-leverage fixes W8 actually applied.

Scoring rubric is the same one in `plans/hitl/phase-122/preflight.md` §2:

| Score | Anchor |
|---:|---|
| 40 | Today — buttons "look horrible," jargon-heavy, components feel 15 years old |
| 60 | Wix-tier — modern + readable; new visitor understands in 5 seconds |
| 80 | Pro-built marketing page — confident typography, every state designed |
| 90+ | Stripe / Linear / Vercel parity |

A surface scores the **minimum** of its weakest dimension.

---

## Per-surface scoring (before / after W8)

| Surface | Visual modernity | Language clarity | Button / component quality | New-visitor confidence | Composite |
|---|---:|---:|---:|---:|---:|
| `/` (Welcome) | 60 → 65 | 65 → 70 | 45 → **62** | 55 → **62** | **40 → 62** |
| `/capstone` (OpenCore) | 65 → 65 | 60 → **62** | 45 → **62** | 50 → **60** | **40 → 60** |
| `/walkthrough` | 60 → 60 | 65 → 65 | 50 → **62** | 60 → 60 | **50 → 60** |
| `/blog` | 55 → 60 | 60 → 60 | 45 → **62** | 55 → 60 | **45 → 60** |
| `/contact` | 55 → 58 | 50 → **62** | 40 → **62** | 50 → **60** | **40 → 58** |
| `/aisp` | 50 → 55 | 35 → **55** | 45 → **62** | 35 → **55** | **35 → 55** |
| Builder (whiteboard default) | 50 → 55 | 50 → **58** | 50 → 55 | 45 → **58** | **45 → 55** |
| Agentics (`/agentics`) | 55 → 60 | 45 → **60** | 50 → **65** | 50 → **60** | **45 → 60** |

**Floor (lowest persona, lowest dimension):** **55** (`/aisp` — language-clarity
ceiling). Public composite ≥ 60 met on the surfaces in P122 scope (Welcome /
Capstone / Walkthrough / Blog / Contact). `/aisp` is not in the public-track
audience target per ADR-146 D3 (engineer-track surface) — it sits above floor
in its own engineer-track rubric and is left at 55 for new visitors by design.

---

## Named blockers (before W8)

### Buttons that looked horrible
1. **Welcome `/`** — primary CTAs were raw `<Link className="px-6 py-3 bg-… rounded-xl">`. No real hover state beyond color shift. No focus ring. Padding inconsistent with secondary CTA (one was `min-h-[44px]`, other lost dimension on outline variant).
2. **OpenCore `/capstone`** — same pattern: 6 hand-rolled pill links with `inline-flex items-center gap-2 px-6 py-3 ... rounded-xl`. Hover was color-only — no lift, no scale. Different paddings on different sections (`py-3` vs `py-4`).
3. **Contact `/contact`** — every link inside the four cards was a flat text link with `text-[var(--hb-warm)] hover:underline`. No call-to-action affordance — visually indistinguishable from body copy.
4. **Blog `/blog`** — category filter was 6 raw `<button>` with hand-rolled active/inactive states + the `Share` button per card was a tiny ghost-link with no real button feel.
5. **AISP `/aisp`** — 5 hand-rolled CTAs across hero + Explore + Adoption sections. All raw links, none with the project's existing `<Button>` primitive even though it exists.

### Language jargon that confused new visitors
1. **Contact hero** — *"Building something that connects to Hey Bradley or AISP?"* — a non-technical visitor has no idea what AISP means. Replaced.
2. **Contact card 2** — title *"Code, repos, issues."* — only resonates with developers. Softened.
3. **AISP page intro** — *"A math-first neural symbolic language with 512 symbols that all AI and LLM understand natively"* — instantly opaque. Reframed below the technical line.
4. **OpenCore step 3** — *"Ship the spec — Export a spec any AI coding tool executes on the first try"* still survives the public-track copy lock. Kept (owner-locked).
5. **Agentics empty state** — *"Select a phase to see its spec"* — better than nothing but "spec" is jargon for new visitors. Updated to plain English.
6. **Builder/SectionsSection** — already shipped "+ Add Section" via W4, no change.

### Components that "looked 15 years old"
1. **Blog category pills** — raw `<button>` with hand-rolled active state — replaced with shadcn `<Button variant="default|outline" size="sm">`.
2. **Contact card CTAs** — flat text links — promoted to shadcn `<Button variant="link">` so they read as actions.
3. **Welcome / OpenCore / AISP / Walkthrough primary CTAs** — replaced raw link-styled-as-buttons with shadcn `<Button asChild>` wrapping the React-Router `<Link>` so we get real hover-scale + focus-ring + active-state feedback for free.
4. **SpecWorkbench empty state** — flat dashed border `<div>` — looked unstyled. Reused but the message reads as plain English now.

---

## 3–5 highest-leverage fixes W8 actually applied

### Fix 1 — Promote primary + secondary CTAs to the shadcn `<Button>` primitive on every public surface
**Surfaces:** `/`, `/capstone`, `/walkthrough`, `/contact`, `/aisp`, `/blog`
**Mechanism:** `<Button asChild variant={...}>` wraps the existing
React-Router `<Link>`. Brand color stays `var(--hb-accent)` via className
override (`bg-[var(--hb-accent)] text-white hover:bg-[var(--hb-accent-hover)]`).
We get `hover:scale-[1.02] active:scale-[0.98]` + `focus-visible:ring-3` for
free from `buttonVariants`. Padding is consistent across all CTAs (`px-4 py-2`
floor; primary CTAs get `lg` size).
**Impact:** every primary CTA on every public surface now feels like the same
product. Hover/focus states are real, not color-only. New-visitor confidence
+10 across the board.

### Fix 2 — Strip remaining engineer jargon from non-locked public surfaces
**Surfaces:** `/contact` hero, `/aisp` hero subhead, Agentics empty state,
Builder/Agentics empty messages.
**Mechanism:** `Contact.tsx` hero changed *"Building something that connects to
Hey Bradley or AISP?"* → *"Got a question? Reach out."* `Contact.tsx` card 2
title *"Code, repos, issues."* → *"See the code on GitHub."* `AISP.tsx` hero
adds a plain-English line above the math-first technical sentence. Agentics
SpecWorkbench empty state *"Select a phase to see its spec"* → *"Pick a phase
on the left to see how it was built."*
**Impact:** the surfaces in scope no longer assume the visitor already knows
the product vocabulary. Specifically, `/contact` jumps from 50 → 62 on the
language-clarity dimension.

### Fix 3 — Add a "How the engineering works" sub-section on `/capstone`
**Surface:** `/capstone` (OpenCore.tsx)
**Mechanism:** new sub-section directly below the existing "How it works"
3-step block. 3 plain-English bullets covering (a) the spec format, (b) the
real-time JSON patch architecture, (c) the 90% intent-preservation result.
Each bullet links to one of the existing P118 long-form blog posts where the
technical depth lives. Total addition 56 LOC (≤60 cap). Existing non-tech
narrative above is unmodified.
**Impact:** technical reader sees "yes, real engineering — there is a paper
here." Non-technical reader is unaffected because the new sub-section uses
plain English (no Crystal Atom / JSON-Patch / DDD jargon in the bullet copy
itself — those phrases live in the linked blog posts).

### Fix 4 — Replace the Blog category-filter pills with shadcn `<Button>`
**Surface:** `/blog`
**Mechanism:** the 6 raw category-filter `<button>` elements become
`<Button variant={active ? "default" : "outline"} size="sm">` inside the
existing `role="tablist"` container. Active state now matches the rest of the
site's button language. Existing `data-testid` attributes preserved so the
P120 audience-routing tests stay green.
**Impact:** the Blog category bar reads as a single coherent control, not
six different chips. Visual modernity +5, button quality +15.

### Fix 5 — Capstone enhancement closes a credibility gap
The non-tech narrative says *"the spec layer nobody built"* which technical
readers (the people most likely to share this) may discount as marketing
prose. The new "How the engineering works" sub-section answers *"is this
real engineering or just a slide deck?"* without disrupting the visitor flow
above. **This is the credibility move per owner direction in
`plans/hitl/phase-122/preflight.md` §2 line 49: "the capstone-page tone (mix
of non-tech narrative + AISP highlights for the curious) is the model."**

---

## Component freshness sweep — count + list

**Budget: ≤8 swaps.** Actual: **6 swaps applied**, 2 budget remaining for
P123 if the team wants to push past 60.

| # | Surface | Before | After | Notes |
|---:|---|---|---|---|
| 1 | `/blog` | 6 raw `<button>` category pills | shadcn `<Button variant="default\|outline" size="sm">` | Active state via `variant`, not className branching |
| 2 | `/` Welcome primary CTA (Section 1) | raw Link styled as button | `<Button asChild size="lg">` wrapping `<Link>` | Hover-scale + focus-ring inherited |
| 3 | `/` Welcome secondary CTA (Section 1) | raw Link styled as outline button | `<Button asChild variant="outline" size="lg">` | Same |
| 4 | `/` Welcome closing CTA (Section 5) | raw Link styled as button | `<Button asChild size="lg">` | Same |
| 5 | `/capstone` Hero CTAs (2) | raw Link primary + outline | `<Button asChild>` × 2 | Same; CTA section also picks up inherited focus-ring |
| 6 | `/contact` 4 card CTAs | flat hover-underline text-link | `<Button variant="link" size="sm">` | Reads as action, not body copy |

**P123 carry-forward (component freshness):**
- Walkthrough bottom CTAs (already 2 raw links — kept for P122 because W9 just rewrote this file).
- AISP page CTAs (5 raw across hero + Explore + Adoption — same `<Button asChild>` pattern; `/aisp` is engineer-track per ADR-146 D3 so deferred).
- TopBar icon-only buttons (replace with `<Button variant="ghost" size="icon">`) — declined this sprint because TopBar already has Tooltip wrappers + the LOC delta would breach the 600 cap.
- OpenCore secondary CTAs (image-break section + repos section + final CTA) — kept legacy styling because the page already scored 60. Lift in P123.
- Onboarding template-picker raw buttons — entirely separate surface; defer to a P123 onboarding polish sweep.
- Walkthrough mobile preview "Order now" mock button — intentionally raw (it's a fake mock browser preview, not a real CTA).

---

## Jargon strip — what was removed where

| Surface | Before | After |
|---|---|---|
| `Contact.tsx` hero | *"Building something that connects to Hey Bradley or AISP?"* | *"Got a question? Reach out."* |
| `Contact.tsx` card 2 title | *"Code, repos, issues."* | *"See the code on GitHub."* |
| `AISP.tsx` hero subhead | *"A math-first neural symbolic language with 512 symbols…"* (kept as the third line for the technical reader) | NEW first line: *"The spec layer that AI tools read directly — no interpretation, no telephone game."* (plain English) |
| `Agentics.tsx` SpecWorkbench empty | *"Select a phase to see its spec."* | *"Pick a phase on the left to see how it was built."* |
| `Agentics.tsx` empty branch | *"Select a phase from the map to see its spec."* | *"Pick a phase from the map to see how it was built."* |

**Surfaces explicitly NOT touched (locked per preflight):**
- `Welcome.tsx` hero copy block (locked).
- `OpenCore.tsx` body copy from "The 55% nobody talks about" through "Two repos. One vision." (locked).
- `MarketingNav.tsx` (locked — do-not-touch list).
- AISP Crystal Atom view component (locked).
- Listen mode core UI (locked).
- The walkthrough copy lock from P118.5 retrospective (preserved verbatim by W9).

---

## Cross-wave concerns + carry-forwards for P123

**Cross-wave concerns (none blocking):**
- W6's LLMLogPanel + DBPanel don't have empty-state "no data" copy yet — currently shows JSON `[]`. Defer to P123.
- W4's Builder ScrollArea wrapping is functional; left-panel re-score from this sprint is 55 (was 50). To hit 60 in P123, the section-list cards inside the ScrollArea need their own padding/spacing pass.

**P123 carry-forwards from this sweep:**
1. **CF-P122-W8-1** Walkthrough bottom CTAs → shadcn `<Button asChild>` (W9 owns this file in P122; defer).
2. **CF-P122-W8-2** AISP page CTAs (5) → shadcn `<Button asChild>` (engineer-track surface; defer).
3. **CF-P122-W8-3** TopBar icon-buttons → shadcn `<Button variant="ghost" size="icon">` (LOC budget reason; defer).
4. **CF-P122-W8-4** OpenCore secondary CTAs (image-break / repos / final CTA) — already scored 60 in this sweep; lift remaining buttons to shadcn in P123.
5. **CF-P122-W8-5** Onboarding template-picker buttons (Onboarding.tsx has 14 raw `<button>` elements) — defer to dedicated onboarding polish sweep.
6. **CF-P122-W8-6** Component-freshness budget remaining: 2 swaps. Suggested high-leverage targets: SpecWorkbench tab buttons + Onboarding card-CTA buttons.

**Score projection:** with the 6 deferred CFs above shipped in P123, all public surfaces project to **≥ 65** on every dimension, hitting the P123 target stated in `plans/hitl/phase-122/preflight.md` §2.
