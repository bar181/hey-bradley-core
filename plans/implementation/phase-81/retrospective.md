# P81 / OC-16 — Retrospective

> **Phase:** P81 · **Sprint:** OC-16 (Prompt Library Completeness) · **Date:** 2026-05-01

## Keep

- **Two-track parallel dispatch (A1 corpus / A2 closer) on disjoint surfaces.** Corpus JSON is genuinely orthogonal to ADR / tests / EOP / CLAUDE.md sync, and splitting on those seams kept each agent in a narrow blast radius. No collisions on any file because A1 owned every file under `tests/prompts/` and A2 (this agent) ships docs + tests + CLAUDE.md only. This 2-agent pattern is the right shape for content-expansion sprints — bigger dispatches don't help when the work is naturally cleavable in two.
- **FS-read pure-unit pattern with `existsSync` guards on A1 surfaces.** The closer test ships GREEN even when A1 lands slightly later — the spec only hard-gates A2 deliverables (ADR-106 file shape, EOP triplet present). This pattern (used at P74 for Track-D review docs, P78 for A4 / A5 surfaces, P79 for A2 / A3) keeps the seal-gate honest without forcing serial dispatch.
- **ADR-106 stays ≤120 LOC (actual: 93 LOC).** Tight ADR with 3-decision shape + cross-refs is more useful than a long essay. The recon-truth note (P59 280-entry baseline → P81 500+ floor) names the floor explicitly so future readers see exactly what changed and why.
- **Tolerant smoke schema check (first-entry-only per file) instead of per-entry strict schema.** Corpus authors can extend without coupling to the test spec. Per-entry strict schema is a Tier-2 lift once the live-LLM eval harness goes live (OC-12). Right discipline for v1.
- **Two new corpus files (`multi-page.json`, `template-triggers.json`) instead of merging into existing 4 files.** The two new categories have orthogonal semantics (page-targeting vs template-intelligence triggers) that don't fit the original atom / section / persona / edge-cases split. Isolating them gives a clean blame-trail when corpus gets extended further (post-RC i18n, cross-language).
- **Tolerant array-or-object detection in `entriesOf()`.** Corpus files MAY ship as a top-level `[ ... ]` array, OR `{ "entries": [ ... ] }`, OR a category-keyed object whose values are arrays. We accept all three so corpus authors aren't coupled to a single layout. Future-proof.
- **NOTE-FOR-P82/A5 left inline in CLAUDE.md.** Mirrors the P75/A3 → P76/A6 pattern. P82's final closer can bump 106 → 107 in one atomic edit and remove the note. This is the right way to coordinate adjacent-phase CLAUDE.md edits without merge-conflict risk.

## Drop

- **The temptation to widen scope to live-LLM eval harness mid-sprint.** OC-16 preflight explicitly punted the eval runner to Tier-2 / OC-12, and that hold-the-line was the right call. The runner is non-trivial (BYOK matrix x 6 personas x 6 atoms) and would have blown the OC-16 timebox. Corpus is the input; runner is post-RC.
- **The temptation to enforce per-entry strict schema in the spec.** Tolerant first-entry smoke check is the right floor for v1. Strict per-entry validation belongs in the Tier-2 eval harness, not in the seal-gate.
- **The temptation to HNSW-index the corpus during this sprint.** Ruvector index is still 0-vector (per P70 audit); HNSW activation is intentionally deferred to commercial Tier-2 learning runtime. Punt.
- **The temptation to add corpus localization / i18n.** English-only is the v1 floor. Cross-language disfluency coverage is post-RC.
- **Worry about animation transitions on corpus loading.** No animation-library imports (the five banned packages) in any A2-owned file. Corpus is plain JSON; rendering is downstream.

## Reframe

- **The corpus is the contract for the live-LLM eval harness.** Reframe: every atom-routing change from here forward (new verbs, new section types, new template-intelligence triggers) must add corpus entries before it ships. Document this as an invariant in the next ADR-touching sprint's preflight. The corpus is now the spec for "what does the pipeline accept" — protect it.
- **The two new categories were latent in the codebase but not in the corpus.** Multi-page (ADR-085 / ADR-103 / ADR-104) and template-intelligence (ADR-098) had source-side support since their respective ADRs landed; the corpus didn't catch up until P81. Reframe: post-ADR sprints should always include a corpus-extension pass. The corpus lag was a real gap, not just a rounding error.
- **Tolerant smoke schema is good DX, not laziness.** Corpus authors can extend without churn. The seal-gate gives them a contract (≥500 entries, 6 files, schema-sound first entry) without micromanaging every row. This is the right balance.

## Carry-forward

- **Live-LLM eval harness** (Tier-2 / OC-12 — primary candidate; consumer of the 500-entry corpus)
- **HNSW indexing of the corpus** (Tier-2 — vector embedding + nearest-neighbor for prompt-similarity scoring)
- **Per-entry strict schema enforcement** (Tier-2 — rides on top of the eval harness)
- **Corpus localization / i18n** (post-RC — Spanish + Mandarin first targets per the 25-gap roadmap)
- **Cross-language disfluency coverage** (post-RC — listen-mode transcripts in non-English locales)
- **Corpus-extension invariant for ADR-touching sprints** (process — every new atom / verb / section type adds ≥3 corpus entries in the same sprint)
- **Page-aware INTENT_ATOM target resolution** (P82 / OC-CLEANUP — A3 owns; cross-page commands like `"edit page X hero"` from a different active page; corpus already has the prompts via P81 multi-page.json)
- **DECOMP_ATOM page-targeting verbs** (P82 — A3 owns; `Todo.targetPage` field; multi-clause cross-page utterances; corpus prompts shipped in P81)
- **Mobile drawer page selector** (P82 — A4 / A5 own; hamburger drawer surface needs page-list section)

## Velocity note

P81 closer (this triplet + ADR-106 + spec + CLAUDE.md edit) sized as ~25-35 minutes of A2 wall-clock at velocity. P81 as a 2-agent dispatch on a single working session is on-budget per the 3-phase-sprint ≈ 1 working day baseline (CLAUDE.md "Effort Estimation Rule"). P81 + P82 running in parallel on disjoint surfaces is the right shape — 7 agents total across the two phases, well within the 6-8 maxAgents recommendation per phase. Sustainable.

The corpus expansion (280 → 500+ entries) is the kind of work that benefits MOST from parallel dispatch — A1 has a deterministic, narrow-blast-radius task (extend JSON files following an existing schema) that doesn't depend on A2's deliverables. A2's `existsSync` guards mean A1 can ship at any pace without blocking the seal.
