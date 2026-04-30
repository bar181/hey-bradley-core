# ADR-085 — Multi-Page MVP for Open-Core (OC-11)

**Status:** Accepted
**Date:** 2026-04-30
**Phase:** P61 (planning) → P62..P75 OC-11 execution
**Supersedes:** none (extends ADR-035 Phase 13 multi-page data model)
**Cross-refs:** ADR-035, ADR-053, ADR-057, ADR-060, ADR-064, ADR-079, ADR-081, ADR-084

## Context

ADR-035 (Phase 13) shipped the multi-page **data model**: `MasterConfig`
optionally carries a `pages: Page[]` array; each page has its own `sections[]`.
50% of the architecture is in production today (storage, schema, blog
section type as the proof). The remaining 50% — UI page selector,
page-aware AISP spec generation, chat/listen page targeting — is
the open-core launch-blocker per `plans/implementation/phase-61/02-launch-plan.md`.

Single-page-only is HB's weakest point in the competitive analysis
(`tests/p60-competitive-analysis.md`); multi-page is the differentiator
no competitor offers with per-page AISP specs.

## Decision

Ship multi-page MVP as part of OC-11 with the following scope:

1. **Page selector UI** — left-panel tabs (or dropdown on mobile) listing
   pages by title; active-page state in `uiStore` (`activePageId: string`)
2. **Add / remove / reorder pages** — minimal CRUD; defaults to single
   page when array is absent (backward compat with all 17 existing
   examples)
3. **Per-page AISP spec generation** — extend `shareSpecBundle.ts` to
   emit one bundle per page; SELECTION_ATOM templateId resolves
   page-scoped; PATCH_ATOM paths prefix with `/pages/{n}/sections/...`
4. **Page-aware chat/listen** — INTENT_ATOM target resolution honors
   active page; "edit page X hero" command resolves cross-page; default
   target = active page
5. **Page nav rendering** — preview auto-generates a top nav bar from
   page titles when `pages.length > 1`; hidden when single page

## Out of scope (Tier-2 commercial)

- Page-level access control / private pages
- Hosted multi-page sites (server-side routing)
- Cross-page link validation / broken-link detection
- Page templates (e.g., "Pricing page template" distinct from "Site template")
- Per-page brand override (single brand context per project stays)

## Bounded-context impact (DDD)

No new bounded context needed. Changes contained within existing contexts:

- `configuration` — `MasterConfig.pages[]` already defined; UI mutations
  add page CRUD methods to configStore
- `specification` — `shareSpecBundle` extends to per-page emission
- `intelligence` — INTENT_ATOM target resolver adds page-scope param
- `ui-shell` — page selector component + active-page state

No new aggregate; Page is a child entity of MasterConfig (same root).

## Acceptance gates

- 2-page minimum demoable with chat + listen targeting either page
- Per-page AISP bundle exports with distinct file names
- All 17 existing single-page examples continue to render unchanged
  (backward-compat regression: `tests/p61-multi-page-mvp.spec.ts`)
- Page-add / reorder / remove via UI under 3 clicks each
- Mobile page selector reachable from hamburger menu

## Consequences

**Positive:**
- Closes the only structural gap vs. Lovable / Framer
  (single-page-only)
- Per-page AISP spec is a unique selling point; no competitor approaches
- Sets up Tier-2 commercial features (hosted multi-page, ACLs) on a
  shipped foundation rather than greenfield work

**Negative:**
- AISP atom paths grow longer (`/pages/0/sections/2/...`); EXPERT-mode
  trace pane gets denser
- Mobile UI (OC-5) adds page selector to already-narrow real estate
- Backward-compat regression surface: every existing example, every
  existing chat command, every existing AISP test

**Mitigations:**
- Single-page mode stays the default (no pages array → implicit page 0)
- Mobile page selector uses hamburger drawer (off the always-visible UI)
- OC-11 sprint preflight enumerates regression-test inventory before
  any code change
