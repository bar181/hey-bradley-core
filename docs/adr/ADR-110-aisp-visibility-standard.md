# ADR-110 — AISP Visibility Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P85 / OC-AISP-AUDIT
- **Cross-refs (primary):** ADR-053 (INTENT_ATOM — first Crystal Atom), ADR-082 (Open Core RC — public release boundary), ADR-091 (Canonical Component Quality — token-derived spacing/colors)
- **Cross-refs (secondary):** ADR-099 (DECOMP_ATOM — multi-clause splitter), ADR-104 (Page-Aware Pipeline), ADR-108 (AISP Adoption Standard)

## Context

Post-RC. v1.0.0-RC1 ships with AISP visible in three user-facing surfaces today: collapsible AISP trace inside chat replies (P55), the Spec panel AISP tab, and the ConversationLog full-detail surface (P74). The owner brief is to encode the principle governing **the rest of the product surface** so future agent-led sprints don't accidentally over-expose AISP at the cost of UX, or under-expose it where dual-view would add precision for free.

P85 / Agent A1 audit (`plans/strategic-reviews/2026-05-01-aisp-integration-audit.md`) inventories every AISP touchpoint. ADR-110 is the standard the audit cites; A2 (Wave 2) is the surgical-edit pass that lands the first batch of dual-view candidates; A3 ships the developer onboarding card component. ADR-110 outlives the sprint as the citable governance for every future AISP-surfacing decision.

## Decision

ADR-110 names four standards governing AISP visibility from this seal forward.

### 1. UX trumps AISP visibility when forced

If the choice is between hiding AISP (clean UX) and showing it (denser / more confusing UX), **always choose UX**. AISP exists to reduce ambiguity in the agent pipeline; user-facing AISP exposure is a bonus, not a goal.

### 2. Dual-view default for value-add surfaces

When AISP would add precision **without** UX cost — short labels, optional collapsible chips, EXPERT-mode-only suffixes — surface human-primary + AISP-collapsible-secondary. The user reads the human text; the curious developer expands the chip.

### 3. Internal-only correct for low-value surfaces

Welcome hero, pricing copy, mid-flight transcripts, marketing pages — AISP stays internal. There is no upside to surfacing Crystal Atom shape on the landing hero; there is downside (visual noise, jargon, novice friction).

### 4. Developer onboarding card pattern

Agentics mode (developer-positioned) gets a **dismissable AISP explainer card** explaining the 5-component Crystal Atom (Σ = Intent · Assumptions · Selection · Content · Patch). The card stores its dismiss flag in `localStorage` and never re-shows. P85 / A3 ships the component (`src/components/onboarding/AISPDeveloperCard.tsx`); the card is unmounted this sprint and gets wired into the Agentics mode landing in P94 when that surface ships.

## Five dual-view candidates this sprint enables

The audit (A1) marked these as dual-view-candidate. A2 (Wave 2) lands the first three in source; the remaining two are deferred:

1. **Template matcher confidence chip** in chat reply — "Selected `<theme>` (confidence 0.87)" inline-collapsible
2. **DECOMP user-visible todo list** pre-execute — "I found 3 things to do: 1. … 2. … 3. …"
3. **EXPERT-mode error code suffix** — append AISP error code alongside the human error message; default UX hides it
4. **AISP developer card in Agentics mode** — component ships P85 / A3; mount in Agentics landing carry-forward to P94
5. **Blog post AISP code-block macro** — pattern for embedding AISP snippets in blog posts; deferred to P89

## Out of scope (Tier-2 / deferred)

- Comprehensive AISP error catalog UI (full taxonomy + filterable browse) — Tier-2 commercial dashboard
- Geek-personality demo flow with AISP prominence — P89 candidate
- Ruvector-pattern-driven AISP suggestions ("users who said X also produced Y atom") — Tier-2 learning runtime

## Acceptance gates per decision

1. **D1:** Every future AISP-surfacing PR cites ADR-110 §1 if it adds AISP to a user-facing surface. If the reviewer judges UX cost > AISP precision, the surface defaults to internal-only.
2. **D2:** Dual-view surfaces follow the human-primary + collapsible-secondary pattern. AISP-only labels (no human text) are rejected.
3. **D3:** Marketing pages, hero copy, pricing, mid-flight transcripts ship without AISP labels by default. AISP exposure on those surfaces requires explicit ADR override.
4. **D4:** The Agentics mode landing (when it ships in P94) renders `AISPDeveloperCard` exactly once per browser; dismiss is sticky.

## Consequences

**Positive:**
- The principle "UX trumps AISP visibility when forced" is now a citable standard, not a vibe. Future agents settle ambiguity by reading ADR-110 instead of debating.
- Dual-view as the default for value-add surfaces means AISP exposure scales with user appetite (collapsible chips), not at the cost of novice flow.
- Developer onboarding card is a one-time interrupt, not a permanent UI element. Sticky-dismiss respects user attention.

**Negative:**
- Five candidates surfaced this sprint, only three land in source (P85 / A2 Wave 2). Two deferrals (developer card mount, blog macro) accumulate as carry-forward. Mitigation: each carry-forward has a phase-of-origin pointer (P94, P89).
- "UX trumps AISP" is a judgment call; reviewers may disagree. Mitigation: ADR-110 §1 is the tie-breaker — when in doubt, hide AISP.

**Mitigations:**
- ADR-110 cross-refs ADR-053 (Crystal Atom shape), ADR-082 (RC scope), ADR-091 (component quality tokens) — three pillars governing what AISP looks like, where it ships, and how it integrates visually.
- A1 audit doc + A2 source edits + A3 developer card + A4 ADR + tests are the four-agent dispatch closing the principle into production.
