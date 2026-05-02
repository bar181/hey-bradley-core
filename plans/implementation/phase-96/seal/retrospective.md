# P96 / AW-EXPORT-CLAUDE-CODE — Retrospective

- **Phase:** P96 · **Sprint:** AW-EXPORT-CLAUDE-CODE · **Date:** 2026-05-01

## Keep

- **Spec-factory framing made export the headline UX surface.** The P95 planning sprint (Q2 reframe from ZIP → markdown bundle) treated the export as the canonical Hey Bradley OUTPUT — not a side-channel. ADR-122 D3 codifies this: workbench is a spec factory; bundle is what the user takes elsewhere. This framing made every subsequent decision sharper (markdown over ZIP; file markers over directory writes; clipboard + bundle as TWO CTAs with TWO purposes, not one CTA with two modes).
- **Markdown-with-file-markers pattern.** ADR-122 D2's `# === FILE: <path> ===` marker keeps the bundle as a single text artifact (universally readable, git-versionable, LLM-ingestible) while preserving logical multi-file structure for any consumer that wants to split. The pattern mirrors ADR-108's polyglot-adoption convention (TS + Python reference impls bundled as plain text). Trivially split with one `awk`/`python` line; LLMs ingest the marker pattern natively.
- **Two CTAs, two purposes.** Clipboard (ADR-121 D2) for AISP-only quick copy. Markdown bundle (ADR-122) for full phase export. Crisp boundary; no UI overlap. The button surface is small + auditable.
- **Pure / store-agnostic emitter contract.** `buildClaudeCodeBundle(phase, projectSlug?)` accepts `PhaseCard` + optional slug; returns `ExportClaudeCodeBundle`. No store imports, no fs/archive deps, no React. Mirrors the P95 / ADR-121 D3 store-agnostic pattern. Testable in isolation; mountable from any surface.
- **EOP at `seal/` subfolder.** Mirrors P95 pattern. Avoids any future filename collision with planning sprint design docs that follow the `00..04-{topic}.md` convention. Future phases that run a planning sprint should follow this pattern by default.
- **existsSync soft-pass guards on A1/A2 surfaces; hard-gate on A3 deliverables.** Mirrors the P92-P95 pattern. Lets timing slips on sibling agents surface as deferred (not red); keeps closer accountability sharp on the closer's own deliverables.

## Drop

- **Nothing.** The P95 planning sprint pre-resolved the ZIP-vs-markdown question, so P96 dispatched without scope ambiguity. The 30-min upfront cost on the P95 planning arc paid dividends across TWO sprints (P95 + P96). This is the multiplicative effect predicted by the P95 retrospective.

## Reframe

- **"Export" was originally framed as a downstream feature.** Reframe: export is the headline UX surface — Hey Bradley ships specs, and the bundle IS the spec materialized. Once this lands as framing, the rest of the design follows: markdown over ZIP (no binary boundary); file markers over directory writes (no File System Access API dep); two CTAs over one (clipboard for partial / bundle for full); spec-factory boundary explicit (ADR-122 D3) so downstream consumers (Claude Code, Cursor, any LLM agent) get spec freedom + implementation autonomy.
- **"Stub" is not a dirty word, part 2.** P95 shipped SpecWorkbench rendering pre-computed sample data; P96 ships export pipeline against that same sample data. No live `classifyAgents()` invocation in either sprint. The atoms are stable contracts (P92-P94 atom-design phase complete); P95-P96 are surfaces against those stable contracts. When AgentProxy runtime activates, the wire-up is additive — no redesign required. Defer-then-implement is structurally cheaper than implement-then-redesign.

## Carry-forward (Tier-2 commercial / post-RC)

- **File System Access API** for true multi-file directory writes — Tier-2 commercial. Browser support remains gappy at open-core RC scope.
- **Per-file copy buttons** in SpecWorkbench tabs — Tier-2 (clipboard + bundle already cover the high-leverage cases).
- **Bundle versioning + diff view** — Tier-2 commercial (compare two bundles for the same phase across edits).
- **JSZip / archiver dep** — REJECTED per ADR-122 D1 (KISS holds; markdown bundle is zero-dep).
- **Live `classifyAgents()` invocation** per atom expansion — waits on AgentProxy runtime activation (P97+).
- **P97 TDD scaffold** — next in the AW arc.
- **P98 KISS+Review gate** — next in the AW arc.
- **P99-P100 seal panel** — closes the AW arc.

## Velocity note

- Preflight estimate: 30-45 min wall-clock for P96.
- Actual: comparable. Planning sprint upstream (P95 / 5 design docs) had already resolved Q2; A1/A2/A3 dispatched without re-design overhead. Closer (A3) shipped ADR-122 + 16 tests + EOP triplet + CLAUDE.md sync in a single wave alongside A1/A2's source-side work.
- **Net:** velocity hit was exactly as estimated. Planning-sprint-first continues to pay dividends across consecutive phases — P95 paid for both P95 + P96.

## P95 → P96 → P97 arc

P95 sealed SpecWorkbench (first AGENT_ATOM consumer; read-only review surface). P96 ships Export Claude Code (materialization to dispatch-ready markdown bundle). P97 will ship the TDD scaffold (downstream consumer's first-use experience: bundle → tests → code). The arc is design → surface → pipeline → consumer-experience, with each phase confirming the prior phase's contract by consuming it. AISP suite is COMPLETE (P94) + has its first surface consumer (P95) + has its export pipeline (P96) + the consumer-experience scaffold lands next (P97). The cleanest 4-phase sequence in the AW arc.
