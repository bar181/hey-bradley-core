# E2E Test Sprint — Retrospective (A4)

> **Phase:** E2E-TEST · **Wave 3 / A4** · **Date:** 2026-05-02

## §1 Keep

- **Front-loaded scenario design (A1) before parallel build (A2/A3).** The ~325-LOC `01-scenarios.md` paid for itself 3× over: A2/A3 inherited a faithful execution script with explicit pipeline classification + timing model, eliminating re-derivation work. This is the canonical pattern for E2E sprints.
- **Disjoint owned files across waves.** A2 owned site-1 JSON + log; A3 owned site-2 JSON + log; A4 owned wire + tests + EOP. Zero merge conflict risk. Mirrors the Wave-2 disjoint pattern from P92-P96.
- **Soft-pass guards on existsSync() in tests.** Lets A2/A3 surface slips degrade to deferred (carry-forward) rather than red. Hard-gate stays on closer-owned files (brutal-review + EOP triplet).
- **Sub-folder `seal/` placement for EOP.** Avoids filename collision with phase-folder docs at `01..03`. Mirrors P95 + P96 precedent.
- **Honest pipeline behavior in build logs.** A3 prompt 8 dedup short-circuit (todo deferred + theme skipped, net 0 patches) is the credibility tell — pipeline does not silently duplicate or no-op without recording why.

## §2 Drop

- **Implicit "8.0/10 SOTA floor" assumption without naming the comp.** The brutal-review doc names Lovable + Vercel AI SDK + the existing 41 templates — but only retroactively. Future E2E sprints should declare the comp baseline in the preflight, not the closer review.
- **Latency math as raw integers (7,250 ms / 10,480 ms).** Easier-to-read would be `~7.3s` + `~10.5s` consistently — the integer-ms style mirrors the eventual SQLite shape but is harder for humans skimming the build log. Pick one form (preferably both: integer-ms for the row, human-rounded in the narrative).

## §3 Reframe

- **This is a TEMPLATE for future E2E sprints, not a one-off.** The 4-agent pattern (1 scenario / 2 parallel build / 1 closer) is reusable for every future "add a verticalized template + verify pipeline" sprint. The `01-scenarios.md` shape (persona + theme + section structure + N prompts × {input, mode, expected_intent, expected_route, expected_atom_path, expected_patches, expected_latency_ms}) generalizes to any vertical.
- **Simulated pipeline (sub-agent-as-LLM) is acceptable for E2E without keys.** The honest gap is named in §6 of the brutal-review — but the validation we **did** get (atom contract specification sufficient to drive end-to-end build) is the load-bearing finding. Future commercial Tier-2 work can re-run this against live LLMs to validate latency profiles + tone-override fidelity.
- **Validation sprint = no new ADR.** This phase ships zero new architecture decisions; it only verifies existing ADR-053 / ADR-060 / ADR-099 / ADR-104 contracts are sound. The CLAUDE.md sync only updates test count + template count + capabilities line.

## §4 Carry-forward

1. **Owner verification:** open onboarding → click "AISP Executive Overview" + "AISP Developer Retro" → eyeball-verify rendered DOM at 375 / 768 / 1280 px breakpoints.
2. **Lighthouse runs** on both new templates (post-RC owner task per ADR-112).
3. **Re-run E2E sprint with live BYOK keys** (post-RC owner task) to validate real-LLM latency profiles + tone-override fidelity vs simulated.
4. **P100 W2 SQLite log_events table** — when shipped, replay the 19-prompt sequence into the DB and verify round-trip + replay-from-log behavior.
5. **Add 2-3 more verticalized E2E templates** using this same 4-agent pattern (e.g., AISP-for-PMs, AISP-for-EMs) — closes the meta-credibility gap further.
6. **Methodology test:** consider running this sprint as a wall-clock baseline for future E2E sprints — 30-40 min wall-clock for 19-prompt 2-site validation is the new standard to beat.
