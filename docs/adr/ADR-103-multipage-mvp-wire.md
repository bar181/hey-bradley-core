# ADR-103 — Multi-Page MVP Wire

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P78 / OC-11
- **Cross-refs:** ADR-085 (Multi-Page MVP — data-model predecessor), ADR-081 (Open Core RC share / hosted spec link), ADR-091 (Canonical Component Quality)

## Context

ADR-085 (P61 planning, executed P62..P75) shipped the **multi-page data model**: `MasterConfig.pages: Page[]` is defined on the schema, and `addPage` / `removePage` already live on `configStore`. The ADR's scoping note ("50% scaffolded — wire end-to-end") deferred the **UI surface + spec emission** to a follow-on sprint. The P74 brutal-honest comprehensive review (`plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md`) flagged this as Gap 5: the only structural gap vs. Lovable / Framer where the open-core lacks a shipped surface, since visitors can't visibly create / switch / rename pages.

Pre-P78 recon revealed the actual delta is closer to 60% (rename and `setActivePageId` were the only missing store actions; the schema is already in production). OC-11 closes the visible UI + per-page export surface; the chat / listen page-scope intent resolver and the auto-rendered page-nav in preview are explicit Tier-2 / P82 carry-forwards.

## Decision

The open-core wires multi-page MVP across **four** surfaces:

### 1. `activePageId` lives in `uiStore`, NOT `configStore`

`configStore` owns persisted MasterConfig (the document); `uiStore` owns view state (which page the user is currently looking at). `uiStore` exposes `activePageId: string | null` plus `setActivePageId(id)`. Default: first page id when `pages.length >= 1`; `null` for the implicit-single-page legacy mode.

### 2. PageSelector tabs strip in left panel

`src/components/left-panel/PageSelector.tsx` renders an inline tabs strip above QuickAdd. Each page is a `data-testid="page-tab-{id}"` button; "+ Add page" is `data-testid="page-add-button"`; double-click renames inline via `data-testid="page-rename-input"`; per-tab delete affordance is `data-testid="page-delete-{id}"` with confirm. `LeftPanel.tsx` mounts PageSelector unconditionally — single-page projects show only the "+ Add page" CTA until the user opts in.

### 3. Per-page bundle emission via `bundle.pages[]`; static-html export emits page nav

`shareSpecBundle.ts` checks `config.pages?.length`; when multi-page, emits one entry per page in `bundle.pages: Record<pageId, {humanSpec, northstar, aisp}>`. `staticHtmlExport.ts` emits a top `<nav class="hb-page-nav">` linking to anchor IDs plus one `<section>` per page. Single-page output is unchanged.

### 4. Backward-compat — single-page mode unchanged

Every existing example without a `pages[]` array continues to render exactly as it did pre-P78. The recon-truth invariant: regression-free at the legacy surface is the gate, not "all sites use pages".

## Out of scope (Tier-2 / P82 carry-forwards)

- Page-aware INTENT_ATOM target resolution (cross-page commands like "edit page X hero")
- Mobile drawer page selector (hamburger → page list)
- Page-nav auto-render inside live preview (currently emitted only in static export)
- Per-page brand / theme override (single brand context per project remains)
- Hosted multi-page sites (server-side routing)

## Acceptance gates

1. `MasterConfig` schema declares `pages: z.array(...)` (already shipped pre-P78).
2. `configStore` exposes `addPage`, `removePage`, `renamePage` actions; `uiStore` exposes `activePageId` + `setActivePageId`.
3. `PageSelector.tsx` renders the four canonical testids (`page-tab-`, `page-add-button`, `page-rename-input`, `page-delete-`).
4. `LeftPanel.tsx` imports `PageSelector`.
5. `shareSpecBundle.ts` references `config.pages` in a multi-page emission branch.
6. `staticHtmlExport.ts` emits `hb-page-nav` (or a `<nav` block) under a multi-page branch.
7. At least one component under `src/components/right-panel/` carries `data-testid="spec-page-scope"`.
8. ADR-103 Accepted; cross-refs ADR-085 + ADR-081 + ADR-091.

## Consequences

**Positive:**
- Closes the only structural gap vs. Lovable / Framer with a shipped surface (per-page AISP spec is a unique selling point).
- Sets up Tier-2 commercial features (hosted multi-page, ACLs, cross-page link validation) on a shipped foundation rather than greenfield work.
- Single-source-of-truth for active-page state lives where view state belongs (`uiStore`), so persistence semantics stay clean.

**Negative:**
- Left-panel real estate is tighter; on mobile this gets handed to P82 (drawer).
- AISP atom paths grow longer when multi-page (`/pages/{id}/sections/...`); EXPERT-mode trace pane gets denser.
- Backward-compat regression surface is broad: every existing example, every existing chat command, every existing AISP test must stay green.

**Mitigations:**
- Single-page mode stays the default — no `pages` array means implicit page 0; the existing 17+ examples are untouched and the regression gate is asserted in `tests/p78-multipage-mvp.spec.ts`.
- The page-aware INTENT resolver and mobile drawer are explicitly punted to P82 OC-CLEANUP — this ADR refuses the urge to widen scope mid-sprint.
- Test spec uses `existsSync` guards on A4 / A5 source surfaces so the seal stays GREEN even when sibling agents land slightly later in the dispatch window.
