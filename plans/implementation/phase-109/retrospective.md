# P109 / ADR-LEDGER-TRUTH-UP — Retrospective

> **Sprint:** ADR-LEDGER-TRUTH-UP · **Sealed:** 2026-05-03
> **Predecessor:** P108 sealed at `b009ac5`

## What to keep

- **2-agent disjoint-scope parallel + 1 closer pattern.** A12 owned `docs/adr/README.md`; A13 owned the new drift-guard spec. Zero file-level overlap. Closer A14 added ADR + EOP triplet + CLAUDE.md sync without touching A12/A13 outputs (commit `09d0327` immutable). Same shape as P107 / A5+A6+A7 and P108 / A8+A9+A10+A11. The closer-is-docs-only discipline is now reliably ~30-45 min at this codebase size.
- **Verbatim sourcing for ledger entries.** A12 read every ADR file's first heading directly rather than paraphrasing — eliminates the "title drift" failure mode where the README and the file headline diverge over time. The README's "Truth-up note" header documents the rebuild cadence so future closers know when to truth-up; the next addition (ADR-138) is a one-line append + a phase-family bucket update.
- **Custom inline math-symbol parser for AISP `𝔼{...}` enums.** A13's PATCH_ATOM source is written in AISP notation (`SectionType ∈ 𝔼{hero, text, ...}`) — a regex on `\bhero\b` etc. would be brittle against ordering. The spec ships a small inline parser that reads the `𝔼{...}` literal, splits on commas, normalises whitespace. Re-usable shape for future AISP-format assertions without a new parser library install.
- **CI-enforced lockstep across 5 sources.** ADR-100 declared the canonical 18 as discipline; P106 / ADR-134 closed a 3-way drift after the fact. P109 / Decision 2 promotes the discipline to a CI invariant — adding a 19th type now fails 5+ assertions until all 5 sources align. Concrete forcing function, not an aspirational guideline.
- **Phase-family bucketing matches CLAUDE.md timeline.** 18 buckets (Foundation → RC1 hardening) — readers familiar with the CLAUDE.md project status can navigate the README via the same mental model. Avoids the alternative "one giant numerical list" anti-pattern that scales poorly past ~60 entries.

## What to drop

- **Source-of-truth-by-paraphrase for documentation indexes.** Pre-P109 the README's 38-entry list had drifted because each ADR addition required a manual catch-up that nobody owned. Going forward, an ADR PR is incomplete without the README append + the phase-family bucket update; this is a closer-pass discipline now codified in the README header note.
- **Audit-trail-by-vibe.** The "60+ phases stale" gap was discoverable only by counting files on disk vs entries in the README — there was no automated invariant. P109's drift-guard test pattern (read N sources, assert mutual consistency) generalises: a `tests/p109-readme-completeness.spec.ts` would assert `ls docs/adr/*.md | wc -l === README ADR-entry-count`. Deferred to "next time the README drifts" rather than pre-built today; KISS.
- **The "section-type lives in 5 places" architecture itself.** Long-term, a single `src/lib/schemas/section-types.ts` re-exporting one canonical array to all 5 callers would eliminate the drift class entirely. Not done at P109 because the refactor touches 5 atom modules + 3 schema files — high-risk closer-time work for low-add-value at this stage. The drift-guard test makes the existing architecture safe; the refactor is a Tier-2 candidate.

## What to reframe

- **Documentation truth-up is an audit-trail concern, not a busywork concern.** Pre-P109 the stale README looked like cosmetic debt. In reality: every audit (Track A through Track E in `plans/strategic-reviews/2026-05-04-gaps-to-done/`) relied on counting ADRs to score architectural maturity, and every new contributor needed the index to navigate. A 60+ phase stale README was an active liability against the audit discipline. P109 closed it in ~1 hour because the work is mechanical given consistent file naming.
- **The 5-source drift class is now testable, not just declared.** P75 / OC-7 declared canonical 18; P104 added `validateSectionType`; P106 / ADR-134 closed the first drift after the fact. P109 makes the next drift impossible to merge silently. The pattern: every "X is the source of truth" ADR needs a CI invariant test asserting downstream consumers agree — promote the discipline to enforcement at the same sprint, not three phases later.
- **Closer arc is approaching natural completion.** P106 closed dead code + atom-view inversion; P107 closed log integrity; P108 closed test runtime; P109 closes ADR ledger + section enum drift. The audit Track A through Track E P1 items are now systematically closed or reframed. Remaining work is owner-required (CF#4 BYOK smoke + CF#5 STT + tag v2.0.0-RC1) per `docs/launch/owner-launch-checklist.md`. P109 is plausibly the final agent-led sprint before owner-attestation; the seal panel does not own the owner-required tasks.

## Velocity note

P109 estimated 2-3 hours per the post-P108 priority-list table; actual elapsed was ~1.5 hours from preflight commit (`e791b67`) to seal. Consistent with the velocity-corrected estimate. Two-agent disjoint-scope dispatch held — zero merge conflicts, zero cross-agent rework. The README rebuild was the longest single task (~45 min) because each ADR entry required reading the file's first heading; this is mechanical but linear in N. The drift-guard spec was ~30 min. Closer pattern (ADR + EOP + sync; no test code) ~30 min.

## Quality discipline

- ADR-137 ≤ 120 LOC cap → 39 LOC actual.
- 2-decision structure mirrors P104/P105/P107/P108 small-ADR cadence at the seal-arc (no architecture change; documentation + regression-guard sprint).
- Cross-refs span 5 ADRs: ADR-100 + ADR-134 + ADR-104 (primary) + ADR-127 + ADR-126 (secondary; sibling validator + drift-source ADRs).
- Both tsc strict configs clean after Wave 1 commit (`09d0327`); closer adds zero source code.
- KISS — no new dependencies (custom AISP math-symbol parser inline; no parser library install).
- 13 net new GREEN test runs; 237 cumulative regression (≥234 target).
- README rebuilt verbatim from disk; no fabricated titles.
- Documented gaps + supersessions + stub-then-superseded duplicates explicit in README; no silent drift.

## Handoff

P109 plausibly closes the agent-led sprint arc. The Track A through Track E P1 items from the brutal-honest gap audit are systematically closed (P104 schema-guards / P105 RC-blockers / P106 dead-code-purge / P107 log-integrity / P108 test-runtime / P109 ADR-ledger-truth-up). Open-core is owner-runnable: every ADR has a README entry; every helper has behavioral coverage; every section-type source is CI-locked; every Track D test-trustworthiness P1 is closed. Remaining work crosses the agent → owner boundary: CF#4 BYOK live LLM smoke, CF#5 real STT calibration, demo video record, social posts, Agentics Foundation beta dispatch, AISP campaign — all named in `docs/launch/owner-launch-checklist.md` and ADR-109 § 4. The seal panel does not own these. Future agent sprints (if any) would land on owner request.
