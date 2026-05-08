# P66 / Polish Sprint — Before-State Snapshot (A0)

> **Date:** 2026-04-30 · **Status:** READ-ONLY AUDIT — pre-Wave-1 gate
> **Predecessor:** P66 / OC-MKTG sealed at `62af4a4` (Marketing Site Polish)
> **Cumulative GREEN:** 481/481 PURE-UNIT tests
> **Method:** Codebase recon (FS + grep) — no runtime screenshots; descriptions of code state and what a first-time user would see

---

## Major surfaces — current state

### 1. Welcome.tsx (`src/pages/Welcome.tsx`, 255 LOC)
**Current:** Just polished at OC-MKTG (`62af4a4`). Hero has reframed CTAs ("Try the open source version" + "Explore AISP"); social proof bar with HEADLINE_STATS; blog preview section with 3 cards; "Building in public" prose still has stale hardcoded numbers.
**Polish gap:** Hardcoded stale stats in "Building in public" section (lines 107-119) — flagged in OC-MKTG audit as backlog.
**Score (rough): 7/10** — best-polished surface; recently shipped.

### 2. Onboarding.tsx (`src/pages/Onboarding.tsx`, 397+ LOC)
**Current:** Personality-picker first-run step (Sprint J P50) + project-picker tab + LLM banner. **3-card ModeSelectorCard exists but is NOT integrated** — the component sits standalone at `src/components/onboarding/ModeSelectorCard.tsx` waiting for owner UX review per the docstring.
**Polish gap:** First-time user does NOT see the 3-mode framing the marketing site promises. Mismatch between Welcome's "3 modes" pitch and Onboarding's "personality + project" reality.
**Score: 5/10** — functional, but disconnected from the platform framing.

### 3. ChatInput.tsx (`src/components/shell/ChatInput.tsx`, 967 LOC)
**Current:** Carries personality message, AISP surface, latency badge, cost pill. Massive single-file component (3rd largest in src/components after Onboarding).
**Polish gap:** 967 LOC in one file = orientation cost for future agents; likely has internal organization issues. Personality surfacing is internal (active-personality chip) but no quick toggle in the chat surface itself — toggle lives in the settings drawer.
**Score: 6/10** — works, but heavy + personality access friction.

### 4. ListenTab.tsx (`src/components/left-panel/ListenTab.tsx`)
**Current:** Listen orb + transcript + review/clarification cards. Pipeline is Web Speech STT → AISP → patches.
**Polish gap:** No standalone "demo" mode; user has to be in builder + provide BYOK to experience listen flow. Marketing-site visitors can't see what listen mode looks like.
**Score: 6/10** — pipeline works but discovery requires commitment.

### 5. PersonalityPicker.tsx (`src/components/settings/PersonalityPicker.tsx`)
**Current:** 5-card grid in settings drawer. Live preview per personality. ARIA radiogroup, arrow-key nav.
**Polish gap:** **Buried in settings drawer.** Per Sprint J A4, the active-personality chip is shown beside the simulated pill in chat — but the toggle to CHANGE personality is 2 clicks deep (settings drawer → personality picker). For a first-time user, this is unfindable.
**Score: 6/10** — component itself is good; placement is wrong.

### 6. Mobile (`src/components/shell/MobileLayout.tsx`, 151 LOC + `MobileMenu.tsx`, 166 LOC)
**Current:** `md:hidden` wrapper renders only <768px. 3-tab nav (Sprint J P53). Builder hidden on mobile per north-star X8 narrowing.
**Polish gap:** No first-run mobile card ("Tap Listen or Chat to start"). Mobile users hit the same desktop onboarding. Owner-flagged in OC-5 mobile UX-spec input as launch-blocker.
**Score: 6.5/10** — Sprint J fixed the worst (added hamburger + mobile-safe sizing); UX coherence still pending OC-5.

### 7. Builder + section editors (left + right panels)
**Current:** Tri-pane on desktop (Builder.tsx). Right-panel SIMPLE/EXPERT toggle. Section editors per type. Sections rendered via the canonical Hero/Feature/Testimonial components from Wave 2.
**Polish gap:** No collapse-by-default for inactive sections (per user brief). QuickAdd picker shows section types but no preview thumbnails. Delete confirmation is per-section-type ad-hoc.
**Score: 6.5/10** — strong foundation, edges rough.

### 8. Template browser (`src/components/shell/TemplateBrowsePicker.tsx`, 99 LOC)
**Current:** Lists 26 templates. No filter UI. No preview thumbnails (just text titles).
**Polish gap:** With 26 templates, scrolling without filters is friction. Owner brief asks for persona / industry / complexity filter.
**Score: 5/10** — works for 17 templates, strains at 26+.

### 9. AISP trace pane (`src/components/shell/AISPPipelineTracePane.tsx`)
**Current:** Auto-expanded on first reply per session (P60.5 quick win). Shows 5-atom trace.
**Polish gap:** EXPERT-only; SIMPLE mode users never see it. "Geek mode raw AISP in reply bubble" (per user brief) requires personality-aware bubble rendering.
**Score: 7.5/10** — best-in-class for what it does; access expansion is the gap.

### 10. Marketing sub-pages (OpenCore, AISP, Research, About, HowIBuiltThis, Docs, BYOK)
**Current per OC-MKTG audit:** OpenCore 442 LOC; AISP 264 LOC; Research 308 LOC. None polished since pre-OC-MKTG. Stale stats in some pages. CTAs inconsistent with the new Welcome framing.
**Polish gap:** Inconsistency creates trust drift — Welcome says "Try the open source version", OpenCore says "Open core repo on GitHub", AISP says "Read the spec".
**Score: 5/10** — informational but not polished.

### 11. Demos (none exist)
**Current:** No `src/demos/` folder. Welcome has no interactive demo; visitors who don't want to install/launch the builder have nothing to see.
**Polish gap:** Highest-leverage polish gap — every successful site (Lovable, Framer, etc.) has a no-install demo on the marketing page.
**Score: N/A** — surface doesn't exist.

---

## Summary table — surface scores (estimated, before Wave 1)

| Surface | Score | Notes |
|---|---:|---|
| Welcome.tsx (marketing) | 7/10 | Just polished at OC-MKTG |
| AISP trace pane | 7.5/10 | Auto-expand at P60.5; great when seen |
| Mobile | 6.5/10 | Hamburger + 3-tab; no first-run card |
| Builder + section editors | 6.5/10 | No collapse-by-default, no preview thumbs |
| Listen tab | 6/10 | Pipeline works, demo discovery weak |
| Chat input | 6/10 | 967 LOC monolith; personality access buried |
| PersonalityPicker | 6/10 | Good component, wrong placement |
| Marketing sub-pages | 5/10 | Untouched since pre-OC-MKTG |
| Onboarding | 5/10 | Disconnected from 3-mode framing |
| Template browser | 5/10 | No filters, no preview thumbs |
| Demos | N/A | Don't exist |

**Library average: ~6.0/10**, matching the brutal-honest competitive analysis.

---

## Implicit dependencies — who blocks who

- A1 (Listen Demo) + A2 (Chat Demo) are independent of each other but both require fixture-only AgentProxy paths (already exist in `@/contexts/intelligence/llm/`)
- A3 (Mobile) is independent of A1/A2 but depends on A4 mode-selector landing in onboarding for the "first-run mobile card" framing to be coherent
- A4 (Onboarding) depends on integrating the existing ModeSelectorCard component into Onboarding.tsx — that's the integration owner deferred at OC-2 seal
- A5 (Template + Builder) is independent
- A6 (LLM Persona) requires moving the personality picker out of the settings drawer; touches ChatInput + ListenTab; coordinates with A4 (where the picker should live in the onboarding flow)
- A7 (review/ADR/EOP) waits for A1-A6

**Disjoint-files audit:** A1/A2 own `src/demos/` (NEW directory). A3 owns mobile-shell files. A4 owns Onboarding.tsx + ModeSelectorCard integration. A5 owns template-browser + builder section editors. A6 touches ChatInput + ListenTab + PersonalityPicker placement. A7 owns ADR + plans + tests + EOP.

There IS overlap risk on A4 + A6 (both touch onboarding-flow + personality picker). Recommend serializing those two OR explicitly carving the boundary (A4 owns onboarding flow / mode selector; A6 owns picker placement in chat/listen surfaces). Documented in checklist.

---

## Out-of-scope for this polish sprint

Per user brief and prior phase decisions:
- New ADRs beyond ADR-092 (Polish Sprint Architecture) — A7 owns
- Mobile UX redesign per OC-5 (waits for owner UX-spec; ADR-090 reserved)
- Multi-page MVP (OC-11 territory; ADR-085)
- AW-1..AW-10 (post-OC-18)
- Any backend / server work (Tier-2)
