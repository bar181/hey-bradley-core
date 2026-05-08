# ADR-084: Comprehensive QA Architecture

**Status:** Accepted
**Date:** 2026-04-30
**Deciders:** Bradley Ross
**Phase:** P60 (post-P59 prompt-corpus seal at `f81474c`)

## Context

P59 (ADR-083) shipped the 280-entry prompt corpus as the canonical
test-library artifact for AgentProxy and the live-LLM testing arc. P60
extends that corpus into a *comprehensive QA layer* that hardens the
v1.0.0-RC1 release surface across six concerns:

1. **Personality response examples** — 50 hand-graded transcripts
   covering the 5 bubble styles (ADR-074) under the standard prompt set.
2. **LLM interaction matrix** — 80 atom × section scenarios that pin
   the 5-atom AISP behaviour (ADR-053/055/057/060/064) per section
   type, providing per-cell expected-output snapshots.
3. **Flagship + premium templates** — the Hey Bradley flagship
   `MasterConfig` plus two new persona-targeted templates (AI Engineer
   Personal, Local Business) layered on the Sprint M premium stack
   (ADR-079).
4. **Per-concern Playwright specs** — 4 sub-30s specs (one file per
   concern) that run individually instead of the historical glob, so a
   single concern timing out cannot kill the whole wave.
5. **Reviewer-impression audit** — first-30-seconds reviewer transcript
   capture against the Sprint K-N moat surface (ADR-077/078/079/081).
6. **Competitive-analysis** vs Claude Designer / Lovable / Framer,
   anchored on the four moat priorities.

The P59 A1 generator agent timed out twice on the same upstream
stream-idle pattern that has now killed three agent waves. P60 has to
ship its mechanical artifacts without relying on that pattern again.

## Decision

Adopt a **comprehensive QA architecture** with five hard rules:

- **Mechanical data via Python generator.** `scripts/p60-gen-data.py`
  emits the personality (50), LLM-matrix (80), and template-extension
  rows deterministically and idempotently. No agent loop is required
  to reproduce the data set; re-running the generator is byte-stable.
- **Hand-curated MasterConfig artifacts.** Flagship + the two new
  persona templates are authored by hand. Premium quality at the
  template tier (ADR-079 moat priority #3) cannot be generator-output;
  hand-curation is the cost of the moat.
- **Per-concern Playwright specs.** One file per concern (flagship,
  LLM matrix, personality, templates), one bash invocation per spec.
  Each spec is sized to run under 30s on the local box. NEVER glob the
  whole tree from inside an agent — that is the upstream stream-idle
  trigger.
- **Pure-write agent pattern for closing artifacts.** Agents that
  write ADRs / session-logs / retrospectives / CLAUDE.md edits are
  forbidden from running shell commands. Read + Edit + Write only.
  This eliminates timeout exposure on the seal-pass artifacts.
- **"Local + atomic + small" survives where "agent loops with shell"
  times out.** Codified as a phase-process rule going forward.

## Trade-offs

- Hand-curating the two new persona templates is labour-intensive but
  unavoidable: generator output cannot meet the ADR-079 quality bar.
- The per-concern spec split adds file count (4 specs instead of 1
  glob) but cuts wall-clock and bounds blast-radius when one concern
  regresses.
- The pure-write-agent rule loses some agent autonomy on closing
  passes (an agent can no longer self-verify with `npm test`), but
  eliminates the stream-idle timeout exposure that sank P59 A1 twice
  and would have re-occurred on P60 step 4 without this rule.
- Mechanical Python generators add a non-TS dependency for QA-data
  authoring. Acceptable: the generator output is committed; the
  generator itself does not run in CI.

## Cross-references

- ADR-046 — Multi-provider LLM architecture (matrix coverage anchor)
- ADR-047 — LLM logging observability (matrix snapshot capture)
- ADR-077 — Speed visible (reviewer-impression latency audit)
- ADR-078 — Spec unmissable (reviewer-impression AISP audit)
- ADR-079 — Premium templates (flagship + 2 persona templates extend)
- ADR-080 — Public site blog & progress (competitive-analysis surface)
- ADR-081 — Shareable output (supersedes ADR-075; reviewer-impression
  share-spec audit anchor)
- ADR-082 — Open Core RC (v1.0.0-RC1 release surface this QA layer
  hardens)
- ADR-083 — Test library architecture (P59 prompt-corpus precedent;
  P60 layers comprehensive QA on top of the 280-entry baseline)

## Consequences

- Cumulative seal-gate test count moves from 366 (P59 baseline) to
  392+ at P60 seal (366 + 26 P60 specs across the four concern files).
- Future phases inherit the per-concern spec rule and the pure-write
  agent rule. Both are non-negotiable on closing passes.
- Generator-data artifacts become first-class committed fixtures;
  re-running `scripts/p60-gen-data.py` must produce a zero-diff result
  or the generator itself is the regression.
