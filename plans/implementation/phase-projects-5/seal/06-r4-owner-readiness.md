# R4 — Owner-Readiness Assessment

**Sprint:** phase-projects-5 / 5-PROJECTS sprint (sealed at `067f92c`).
**Predecessors:** P105 → P106 → P107 → P108 → P109 ALL SEALED.
**Branch:** `claude/verify-flywheel-init-qlIBr`.
**Date:** 2026-05-03.

## Summary

Swarm work is COMPLETE — every remaining open item in `06-master-checklist.md` (52 deduped findings) and `owner-launch-checklist.md` requires either (a) a live API key, (b) a microphone, (c) a real browser/screen-reader, (d) Lighthouse runtime, or (e) an external account. There is no further productive swarm work absent owner attestation.

## Items the swarm CAN still do (no API key / mic / browser)

NONE — all remaining items require human attestation, external accounts, runtime hardware, or are explicit Tier-2 / post-launch deferrals per ADR-131 + ADR-133.

Verification basis (decision tree applied to each open item):

- All P1 RC blockers (#1–#14, #31, #33, #35–#37) — CLOSED across P105 / P106 fix-pass commits.
- All P106 LOG-INTEGRITY items (#9–#11, #20–#27, #52, #54, #55) — CLOSED.
- All P107 UI-RECONCILIATION items (#38–#44, #58, #59) — CLOSED.
- All P108 TEST-RUNTIME-SHIFT items (#15–#19, #45–#48, #73) — CLOSED.
- All P109 DOCS-LEDGER items (#28–#30, #34, #57, #71) — CLOSED.
- 5-PROJECTS sprint (this commit, `067f92c`) — 5 persona-driven full-pipeline builds wired into `EXAMPLE_SITES`; build logs at `01-…05-project-N-build-log.md`.

The roadmap-deferred items (#32, #49, #50, #51, #53, #56) are explicitly classified `deferred (post-RC)` or `tier-2 candidate` in `06-master-checklist.md` — none flip to swarm-doable now without owner judgment (architecture refactors / perf concerns / P3 defensive pins).

## Items the swarm CANNOT do (human-only)

| # | Item | Reason | Source |
|---|------|--------|--------|
| 1 | CF#4 BYOK $0.05 live LLM smoke (5 prompts × 3 providers) | API keys + cost authorization required | `owner-launch-checklist.md` Immediate · #60 |
| 2 | CF#5 STT calibration on real microphone | Hardware (mic) + voice + ambient-noise judgment | ditto · #61 |
| 3 | Lighthouse mobile ≥85 measurement at 375/390/428 viewports | Lighthouse runtime + real-network probe | ADR-112 · #62 |
| 4 | WCAG AA contrast / VoiceOver / NVDA / JAWS pass | Browser screen-reader + visual judgment | Track E honest-decl · #63 |
| 5 | Cross-browser smoke (Firefox / Safari / mobile Safari) | Real browser engines | Track E honest-decl · #63 |
| 6 | `git tag v2.0.0-RC1 && git push --tags` | Owner credential + intentional release commit | `owner-launch-checklist.md` Immediate |
| 7 | GitHub release notes paste | GitHub account + judgment | ditto |
| 8 | Demo video recording | Camera + voiceover + cut + upload | `owner-launch-checklist.md` Distribution |
| 9 | Show HN post submission | HN account + timing + comment moderation | ditto |
| 10 | Product Hunt submission | PH account + maker profile | ditto |
| 11 | Agentics Foundation beta share (20–50 users) | Owner relationships + DM | ditto |
| 12 | Twitter/X thread, LinkedIn long-form, Reddit posts | Personal accounts + voice authenticity | `owner-launch-checklist.md` Community |
| 13 | AISP open-spec announcement | Cross-repo coordination + owner authority | ditto |
| 14 | Triage feedback issues / PRs / Tier-2 inquiries | Continuous owner judgment | ditto Follow-up |
| 15 | First AISP RFC review (post-RC) | Per ADR-109 §3 — owner-gated | ditto |
| 16 | #39 Welcome 3-card copy decision (final phrasing) | Owner copy override path | `06-master-checklist.md` |
| 17 | #34 framer-motion uninstall vs wire decision | Owner product judgment | ditto · ADR-138 records both paths |

## Items deferred to Tier-2

Per `07-roadmap.md` "Honest deferrals → Tier-2 commercial":

- #64 — UI components → persistence direct calls (12+ files, ~no-bug refactor)
- #65 — IndexedDB delta-tracking (`persist()` re-serializes whole DB)
- #66 — Machine-readable ADR cross-ref index (`docs/adr/index.json`)
- #67 — AISPDeveloperCard resurface mechanism
- #68 — Marketing-page hex literal density (defer to palette refresh)
- #69 — ConversationLogTab drill-down URL deep-link
- #53 — Mid-session retention sweep (long-running tabs)
- #56 — `Math.random` UUID collision guard (P3 defensive)
- #32 — chatPipeline DDD boundary leak (4 store imports, ~50 LOC DI refactor)
- #49 — Per-submit dynamic-import overhead (perf judgment)
- #50 — LLM AISP cost-cap pre-check at 90% (judgment call)
- #51 — `personalityMessage` race (P3 pin)
- #72 — Store-state integration tests (post-RC test arc)

These are CF#6 + the 8 roadmap "Tier-2 commercial" items + 5 deferred-by-judgment items. None flip to swarm-doable without owner authorization.

## Items POST-LAUNCH (judgment deferral)

Per ADR-131 carry-forward registry CF#9 + CF#10 + ADR-133 deferrals:

- CF#9 — Persona scoring against live LLM responses (waits on CF#4 first)
- CF#10 — End-to-end live demo recording (waits on CF#4 + CF#5)
- AISP versioning policy (`aisp-1.X` minor / `aisp-2.0` RFC-gated) — owner-led on first proposed breaking change (ADR-109 §3)
- Hosted reference-impl playground / localization — Tier-2 product roadmap

## Verdict

COMPLETE. Reasoning:

1. The 5-sprint sweep P105→P109 closed all 38 swarm-doable items in `06-master-checklist.md` (verified by sealed commits `424734c` / `b6948db` / `c5a25e6` / `b009ac5` / `da3ee96`).
2. The 14 remaining items in the master checklist are unambiguously human-only or Tier-2 — verified by re-applying the 5-step decision tree (API key / microphone / screen-reader / Lighthouse / external account) to each.
3. The 5-PROJECTS validation sprint (this commit, `067f92c`) extended `EXAMPLE_SITES` with 5 persona-driven full-pipeline builds — the final swarm-attestable contribution to RC validation.
4. The roadmap "deferred (post-RC)" items (#32, #49, #50, #51) are owner-judgment refactors / perf-philosophy decisions, not blocked-by-tooling work the swarm can resolve.
5. No "one more item" was found. The CLAUDE.md "Behavioral Rules — Do what has been asked; nothing more, nothing less" applies: manufacturing additional sprint scope here would violate that contract.

Swarm work DONE. Branch ready for human attestation.

The owner-attested gate is `docs/launch/owner-launch-checklist.md`: tag → BYOK smoke → STT calibration → demo video → social posts → community engagement. Until those run, `v2.0.0-RC1` cannot leave the candidate state — and that is by design (ADR-131 §CF#4 / CF#5 / ADR-133 §4).
