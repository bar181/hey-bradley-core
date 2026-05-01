# P78 / OC-11 — Multi-Page MVP (Preflight)

> **Phase:** P78 · **Sprint:** OC-11 · **Date:** 2026-05-01
> **Predecessor:** P76 sealed at `32e3b74` (~898+ GREEN, 101 ADRs)
> **Companion:** P77 / OC-10 Performance + Accessibility (parallel)
> **Gap-closure ref:** ADR-085 §"50% scaffolded — wire end-to-end"; Gap 5 (closes only structural gap vs. Lovable/Framer)

## Reframe (recon truth)

ADR-085 says "50% shipped." Recon shows MORE than 50% live:
- `MasterConfig.pages: Page[]` — schema in `src/lib/schemas/masterConfig.ts:171` ✓
- `addPage(title)` + `removePage(pageId)` — already in `src/store/configStore.ts:80,547,610` ✓
- Missing: `renamePage`, `setActivePageId` in uiStore, page-selector UI, per-page spec export, page-aware INTENT scope (latter is Tier-2 stretch)

OC-11 closes the **UI + spec surface**; INTENT page-scope and page-nav auto-render are stretch goals (defer to P82 if time-pressed).

## 3 parallel agents · disjoint scopes

### A4 — Page selector UI (left panel + persistence)
**Owns:**
- `src/store/uiStore.ts` (EDIT — add `activePageId: string | null` + `setActivePageId(id)`; default to first page id when pages.length>=1)
- `src/store/configStore.ts` (EDIT — add `renamePage(pageId, title)` next to existing addPage/removePage; ensure persistence flows via existing autosave)
- `src/components/left-panel/PageSelector.tsx` (NEW — list pages, click to switch, "+ Add page" button, inline rename on double-click, delete affordance with confirm; testids: `page-tab-{id}`, `page-add-button`, `page-rename-input`, `page-delete-{id}`)
- `src/components/left-panel/LeftPanel.tsx` (EDIT — mount PageSelector ABOVE existing tabs/QuickAdd; render only when `pages?.length > 0` OR show single "+ Add page" CTA when absent)

**Constraints:** Backward-compat — `pages` absent → single implicit page (existing examples unchanged); pure CSS hover/focus; KISS

### A5 — Per-page AISP spec + export
**Owns:**
- `src/contexts/specification/shareSpecBundle.ts` (EDIT — when `config.pages?.length > 1`, emit one bundle per page in `bundle.pages: Record<pageId, {humanSpec, northstar, aisp}>`; preserve existing single-page output as default)
- `src/contexts/specification/staticHtmlExport.ts` (EDIT — when multi-page, emit a top page nav `<nav>` linking to anchor-IDs; one `<section>` per page)
- `src/components/right-panel/expert/SpecTab.tsx` OR closest spec-panel surface (EDIT — when multi-page, show a page-scope dropdown above spec body; default to active page from uiStore)

**Constraints:** Single-page mode unchanged; round-trip preserved; KISS

### A6 — ADR-103 + 15 tests + EOP
**Owns:**
- `docs/adr/ADR-103-multipage-mvp-wire.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-085 + ADR-081 + ADR-091)
- `tests/p78-multipage-mvp.spec.ts` (NEW; ≥15 cases — Playwright `test.describe` FS-read pattern; cover schema, store actions, PageSelector source, shareSpecBundle multi-page branch, staticHtmlExport nav emission, SpecTab page-scope, ADR shape, EOP triplet)
- `plans/implementation/phase-78/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md sync (ADRs → 103; tests +15; multi-page in capabilities)

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. Backward-compat — every existing single-page example must still render unchanged
4. Active-page state lives in `uiStore` (NOT `configStore`) — `configStore` owns config, `uiStore` owns view state
5. `pageSchema` already exists; do NOT re-define
6. NO shell commands inside agents
7. TypeScript-strict
8. KISS — defer page-nav auto-render at preview, page-scoped INTENT, mobile drawer to P82 OC-CLEANUP

## Acceptance gates (combined P77 + P78)
- Page selector renders ≥2 pages, switches active in <300ms, persists across reload (via existing autosave)
- Rename/add/delete each ≤3 clicks
- Multi-page export emits one spec per page; single-page mode unchanged
- ADR-103 Accepted; cites ADR-085
- ≥15 tests green
- tsc strict clean

## Carry-forwards (explicit defer)
- Page-aware INTENT_ATOM target resolution (cross-page commands like "edit page X hero") → P82 OC-CLEANUP
- Auto-rendered top page-nav bar in preview when pages>1 → P82 (currently emitted only in static export)
- Mobile drawer page selector → P82
