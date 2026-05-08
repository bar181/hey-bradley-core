# P78 / OC-11 — Retrospective

> **Phase:** P78 · **Sprint:** OC-11 (Multi-Page MVP Wire) · **Date:** 2026-05-01

## Keep

- **Three-track parallel dispatch (A4 / A5 / A6) on disjoint surfaces.** Multi-page wire-up is genuinely cross-cut (UI store + UI component + spec emission + ADR/tests), and splitting on those seams kept each agent in a narrow blast radius. No collisions on the shared CLAUDE.md edit because A6 read first and coordinated with P77/A3.
- **FS-read pure-unit pattern with `existsSync` guards.** The closer test ships GREEN even when A4 / A5 land slightly later — the spec only hard-gates A6 deliverables (ADR-103 file shape, EOP triplet). This pattern (used at P74 for Track-D review docs and P76 for A4/A5 surfaces) keeps the seal-gate honest without forcing serial dispatch.
- **ADR-103 stays ≤120 LOC (actual: 68 LOC).** Tight ADR with 4-decision shape + cross-refs is more useful than a long essay. The recon-truth note ("ADR-085 says 50%; reality is closer to 60%") is named explicitly in Context, so future readers see the why.
- **`activePageId` lives in `uiStore`, NOT `configStore`.** This is the right separation — `configStore` owns the document, `uiStore` owns view state. Persisting "which page am I looking at" alongside the document would have created subtle bugs around export / share / reload semantics. Keep this discipline as the project grows toward Tier-2.
- **Backward-compat as a first-class invariant.** Every existing single-page example must render unchanged; this is asserted by the persistence of single-page output in `staticHtmlExport.ts` (no nav block when `pages.length <= 1`).

## Drop

- **The temptation to widen scope to page-aware INTENT_ATOM mid-sprint.** OC-11 preflight explicitly punted page-scope intent resolution to P82 OC-CLEANUP, and that hold-the-line was the right call. The intent resolver upgrade is non-trivial (target-page disambiguation in the parser) and would have blown the OC-11 timebox.
- **Auto-rendering page-nav inside live preview.** Static HTML export emits `<nav class="hb-page-nav">`, but the in-app preview surface intentionally does NOT auto-render this. The preview is a builder-mode surface; the nav is a runtime artifact. Punt to P82.
- **Per-page brand / theme override.** Stays Tier-2 commercial. Single brand context per project keeps the open-core surface simple; per-page theming is a real feature with a real UI cost and belongs in the paid tier.
- **Worry about animated tab transitions in PageSelector.** No animation-library imports (the five banned packages per ADR-102) in any A6-owned file. A 100ms CSS transition on the active-tab indicator is plenty; the tab strip is a navigation surface, not a stage.

## Reframe

- **Multi-page is a moat surface, not a finishing touch.** ADR-085 framed it as "the only structural gap vs. Lovable / Framer." The P74 review confirmed visitors couldn't see the multi-page capability because there was no surface — the data model existed but was invisible. Reframe: every multi-page-touching phase from here forward holds itself to ADR-103's bar (visible UI + per-page AISP + backward-compat).
- **Per-page AISP spec is the unique selling point, not the page count.** Lovable and Framer can do multi-page; nobody emits a per-page deterministic AISP bundle. The `bundle.pages: Record<pageId, {humanSpec, northstar, aisp}>` shape is the moat — the page selector tab strip is just the way users discover it.
- **Recon truth beats sprint-plan optimism.** ADR-085 said "50% scaffolded"; reality was closer to 60% (only `renamePage` and `setActivePageId` were missing on the store side). Future preflights should always do a recon pass before scoping — the savings on this sprint were real (smaller A4 surface than originally drafted).

## Carry-forward

- **Page-aware INTENT_ATOM target resolution** (P82 OC-CLEANUP — primary candidate; cross-page commands like "edit page X hero")
- **Mobile drawer page selector** (P82 — hamburger drawer surface needs page-list section)
- **Page-nav auto-render in live preview** (P82 — cheap follow-on now that static export emits the nav)
- **Per-page brand / theme override** (Tier-2 commercial)
- **Hosted multi-page sites** (Tier-2 commercial — server-side routing)
- **Cross-page link validation / broken-link detection** (Tier-2)

## Velocity note

P78 closer (this triplet + ADR + spec + CLAUDE.md edit) sized as ~30-40 minutes of A6 wall-clock at velocity. Combined P77 + P78 on a single working day, with 6 agents running in parallel across two phases, is on-budget per the 3-phase-sprint ≈ 1 working day baseline (CLAUDE.md "Effort Estimation Rule"). The 6-agent dispatch shape is at the edge of the 6-8 maxAgents recommendation — sustainable for one session, not a default.

## Composite trajectory

P74 design+UX aggregate: 74.9/100 (Capstone 76 / Grandma 72 / Framer 71 / Lars 70). P75 + P76 lifted the spec/export sub-score from ~74-78 → 85+ projected. Combined P77 perf+a11y + P78 multi-page wire close two of the four remaining P1 items from the P74 25-gap roadmap (Gap 5 multi-page surface; Gap 7 mobile public-site polish carry-forward). The post-P78 design+UX aggregate is projected to land in the 80-82 band — crossing the SOTA 80 target. Open P1 items after this session: page-aware INTENT (deferred to P82), mobile drawer page selector (deferred to P82). OC-CLEANUP at P82 is the natural next live candidate.
