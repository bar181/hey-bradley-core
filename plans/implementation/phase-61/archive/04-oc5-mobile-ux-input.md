# P61 — OC-5 Mobile UX Spec Input (DESIGN-FIRST FLAG)

> **Date:** 2026-04-30
> **Sprint:** OC-5 — Mobile UX Overhaul (P1 launch-blocking, 2-3 days)
> **Risk:** flagged HIGH by 3rd-party reviewer (`01-third-party-feedback-2026-04-30.md`)

---

## Why this file exists

OC-5 is the riskiest sprint in the launch plan. The gap between what
shipped in Sprint J P53 (3-tab nav + hamburger; ADR-076) and what the
owner described (single mode + listen toggle, always-visible chat,
preview + minimal-advanced, easy content updates) is **a redesign,
not a polish pass**. Dispatching agents without a UX spec will produce
partial work that doesn't match owner intent.

**Hard rule for OC-5:** an owner-approved UX spec lands BEFORE any
component touches. The spec is owner work; this file is the briefing
that drives it.

---

## What needs to be in the OC-5 UX spec

A short doc (≤ 1 page, ideally with sketches) answering five questions:

### 1. Mobile mode model

Today: 3 tabs (Builder / Chat / Listen). Builder hidden on mobile.
Owner intent: ONE mode (chat) with a listen toggle. Preview always
visible.

Spec must define:
- Where the listen toggle lives (FAB? header icon? in-input mic?)
- Where preview lives relative to chat (split-screen? toggle?
  snap-to-bottom-strip?)
- How the user updates content without seeing the Builder pane
  (chat command suggestions? long-press on preview to reveal
  inline-edit affordance?)

### 2. First-run experience on mobile

Today: tri-pane on first load. Owner intent: a single welcoming card
that routes the user (template gallery → fastest start; chat-first →
exploration; voice → hands-free demo).

Spec must define:
- The initial card content + 3-button layout (matches OC-2 onboarding)
- Whether template-pick and personality-pick are sequential or merged
  on mobile

### 3. Always-visible advanced surface (minimal)

Owner: "minimal advanced features with really easy way to update
content."

Spec must define:
- Which advanced controls survive (theme switcher? page selector for
  OC-11?)
- Where they live (header drawer? bottom-sheet?)
- Tap target sizes (a11y baseline; 44×44 min)

### 4. Listen-toggle behavior

Spec must define:
- What happens when listen is on: does typing still work? Does the
  mic record continuously, push-to-talk, or wake-word?
- How the user knows listen is active (pulse animation? color shift
  on input border? voice-feedback chime?)
- How transcripts route to the chat thread vs. directly to AISP

### 5. Marketing-site mobile audit (parallel to builder redesign)

OC-5 also covers the 4 marketing pages. Spec must enumerate per-page:

- About: mobile hero copy + CTA placement
- Open Core: license + GitHub link visibility on mobile
- How I Built This: scrollable phase log; collapse on mobile?
- Docs: TOC behavior on mobile (drawer? sticky header?)

Each page must hit Lighthouse mobile ≥ 90.

---

## Recommended workflow before OC-5 dispatch

1. **Owner writes the UX spec** — text-only is fine; sketches optional.
   Lives at `docs/ux/oc5-mobile-spec.md`. Estimated: 1-2 hours of owner
   time.

2. **Spec review** — owner pairs with one Explore-agent for a 30-min
   read-through; agent flags ambiguities, missing edge cases.

3. **ADR-087 drafted from the spec** — captures the architectural
   decision (mode model, FAB placement, breakpoint behavior). Status:
   Proposed → Accepted at OC-5 seal.

4. **OC-5 sprint preflight** — turns the UX spec into a 4-6 agent
   wave plan with disjoint scopes (e.g., A1 = chat + listen toggle
   merge; A2 = preview-strip; A3 = onboarding card; A4 = marketing
   audit; A5 = cleanup of ADR-076 Sprint-J leftovers).

5. **Dispatch** — only after preflight is reviewed.

Total UX-spec → preflight: ~½ day owner work + ~½ day agent review.
Cheap insurance against a 2-3 day sprint that misses owner intent.

---

## What NOT to do

- **Do NOT** dispatch agents to "improve mobile UX" without the spec.
  That's the failure mode that produces a Sprint-J-style 3-tab nav
  when the owner wanted single-mode.
- **Do NOT** treat OC-5 as a polish pass on the existing 3-tab nav.
  The owner's framing is a redesign; treat it as such.
- **Do NOT** skip the marketing-site audit; OC-5's scope explicitly
  pairs builder mobile + marketing mobile. They share design tokens.

---

## Acceptance gates (already in `02-launch-plan.md`)

- Mobile shows one mode (chat) with listen-toggle + preview-strip
- No tri-pane below `md` breakpoint
- All 4 marketing pages pass mobile-Lighthouse ≥ 90
- UX-spec doc exists at `docs/ux/oc5-mobile-spec.md` and is referenced
  by ADR-087
- Sprint J ADR-076 (3-tab nav) explicitly superseded in ADR-087
