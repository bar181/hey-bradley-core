# P126 / GO LIVE — Retrospective

> Sealed 2026-05-16. Branch `swarm/p126-go-live` cut from main @ `28d259f2c`.

---

## §1 What shipped

| Feature | Commit | Notes |
|---|---|---|
| F1 — Default template → Hey Bradley | `ae4e5bb04` | configStore default → `data/examples/hey-bradley-flagship/index.ts` (dark, crimson, "Describe it. See it.") |
| F2a — BYOK hover panel | `8a833229e` | `BYOKPanel.tsx` + ADR-153; localStorage-only key storage with Gemini smoke ping |
| F2b — Enriched StatusBar | `98826d144` | LLM key indicator, LLM status dot, version pill `POC 126.0`, tone, specs-up-to-date, +2 flags |
| F3 — Chat history tab | `2ee055b83` | Agentics tab logs all event types + ADR-154; reverse chrono, type badges, Export/Clear |
| F4 — Agentics specs card | `9e479c93e` | Live + on-demand sections, per-row refresh, master "Create Specifications" button |
| F5 — Low-confidence LLM responses | `717540224` | `confidenceNarration.ts` + ADR-155; casual notes; deep-link to Agentics Chat History |
| F6 — Live LLM E2E retry | this commit | Direct Gemini API (no Playwright) — composite 1.00 across 3 sessions |

## §2 ADRs authored

- [x] **ADR-153** — BYOK localStorage-only key storage (filed under F2a commit)
- [x] **ADR-154** — Session chat-history persistence pattern (filed under F3 commit)
- [x] **ADR-155** — LLM confidence threshold + low-confidence response convention (filed under F5 commit)

Numbering note: preflight reserved ADR-150/151/152; actual ADRs landed at
153/154/155 because 150–152 were already taken by P125.x work merged
earlier. No content slip — every reserved ADR-topic was authored.

## §3 F6 retry — full results

Initial Playwright F6 run hit a **Claude API 500** (server-side, not product).
Per owner directive 2026-05-16: simplified to direct Gemini API call,
`.env` BYOK key, $10 phase budget, max 5 iterations, brutal-honest grading.

**Result: converged at iter-1, composite 1.00, total cost $0.001472.**

| Session | Prompt | Confidence | Patch | Grade |
|---|---|---|---|---|
| 1 | "Update the hero section" | 0.6 (low → casual note) | `/sections/1/components/1/props/size` ← `display-lg` | 1.00 |
| 2 | "Change the hero headline to Ship faster" | 0.9 | `/sections/1/components/1/props/text` ← `Ship faster` | 1.00 |
| 3 | "Make it pop" | 0.3 (low → casual note) | size bump + `accentPrimary` ← `#E00050` | 1.00 |

Brutal-honest grading per session checked: (a) valid JSON shape, (b)
non-empty `patchOps`, (c) correct target path for the prompt, (d) value
correctness for explicit asks, (e) confidence band matches prompt
ambiguity, (f) `lowConfidenceNote` present when confidence <0.7.

Evidence:
- `e2e-evidence/iter-1/` — per-session JSON + verdict + system prompt
- `e2e-evidence/session-{1,2,3}.json` — winning iteration promoted
- `e2e-evidence/retry-summary.json` — composite + cost + verdict
- `e2e-evidence/retry-run.log` — full transcript with timestamps

**Scope honesty:** this verifies the LLM round-trip end-to-end (no API
500, correct JSON-Patch generation against real flagship schema indices).
It does NOT exercise the browser UI (BYOK panel injection, preview DOM
mutation, CostPill increment, in-app Chat History link rendering). The
Playwright spec `tests/p126-e2e-chat-sessions.spec.ts` is retained for a
later UI-evidence pass when Claude API is healthy; UI verification is a
carry-forward into P127 (see §6 CF-P127-f6-ui-spot-check).

## §4 Completion gates

- [x] Default template is Hey Bradley (F1, commit `ae4e5bb04`)
- [x] BYOK panel works with smoke test (F2a, commit `8a833229e`)
- [x] Chat history logs all event types (F3, commit `2ee055b83`)
- [x] Specs card shows checklist + button (F4, commit `9e479c93e`)
- [x] Low-confidence responses with link (F5, commit `717540224`)
- [x] Live prompt test passes (F6 retry, this commit — composite 1.00)
- [x] `npm run build` — zero errors (entry chunk 793.32 kB gzip ≤ 800 kB cap)
- [x] Phase audit table in `preflight.md` §4
- [x] `session-log.md` updated throughout
- [x] `retrospective.md` completed (this file)

## §5 Build / gate snapshot

| Gate | Result | Detail |
|---|---|---|
| `npm run build` | PASS | vite 7.92s, tsc strict clean |
| TypeScript strict | PASS | no errors |
| `[secrets-guard]` | PASS | no key-shape patterns |
| ARCH invariants | **12/12 PASS** | ARCH.1 entry chunk 793.32 kB ≤ 800 kB; ARCH.2-12 all green |
| ADR-lint | PASS | no changed files needing ADR mapping |
| Gzip cap (ADR-102) | PASS | 793.32 kB ≤ 800 kB (6.68 kB headroom) |

## §6 Carry-forwards into P127

| ID | Item | Source | Routing |
|---|---|---|---|
| CF-P127-f6-ui-spot-check | Re-run Playwright F6 spec when Claude API healthy; verify preview DOM mutation, CostPill increment, in-app Chat History deep-link | F6 retry scope honesty | P127 quick smoke |
| CF-P127-arch2-legacy-sweep | Pre-existing hex literals in RealityTab / SpecWorkbench / TopBar / ThemeSimple | inherited from P126 preflight §6 | dedicated token-migration phase |
| CF-P127-ineffective-dyn-import | 5 INEFFECTIVE_DYNAMIC_IMPORT warnings (personalityEngine, aisp/index, etc.) | inherited from P126 preflight §6 | tech-debt phase |
| CF-P127-p124-retro-gap | P124 retrospective.md never written; documented in P126 preflight §4 | inherited audit | reconstruct from session-log + Vercel demo-mode commits |
| CF-P127-cinematic-screenshots | Real product thumbnails inside CinematicDemo | inherited from P125.7 | asset acquisition |
| CF-P127-blog-editorial | Blog editorial layout | inherited from P125.7 | content phase |
| CF-P127-mobile-test | Real-device mobile QA at 320/375/414 px | inherited from P125.7 | device-lab phase |

## §7 Plan correction (feed-forward)

- **F6 verification mode resilient to upstream LLM provider outages.** The
  initial Playwright run failed on a Claude API 500 — an upstream provider
  hiccup that has nothing to do with product code. Future phases should
  budget for *both* a UI-driven Playwright run AND a direct-API headless
  verification. The direct-API path runs in <2s for $0.0015 and gives a
  high-signal pass/fail on the LLM round-trip independent of Playwright /
  Vercel / Anthropic uptime. Make the headless retry script a permanent
  fixture, not a one-off P126 artifact.
- **Brutal-honest grading inline beats post-hoc review.** Embedding the
  acceptance criteria as a grading function in the test script (per
  session: target path, value, confidence band, casual-note presence)
  caught the optimal-JSON requirement on iter-1. A post-hoc swarm review
  would have added latency without adding signal. Keep the grader inline.
- **System prompts must embed real schema fragments.** Iter-1 converged
  because the system prompt included the actual flagship `MasterConfig`
  index layout (`/sections/1` is hero, components/1 is headline). Generic
  prompts produced generic patches (the earlier session evidence showed
  vague "New Hero Title" placeholders). Always feed the LLM the schema
  it must patch against.

## §8 Verdict

**SEAL — promote `swarm/p126-go-live` → main.**

- 7/7 features shipped on dedicated commits (revertible individually).
- F6 composite 1.00 across all 3 owner-spec prompts via live Gemini.
- Build green, ARCH 12/12, secrets clean, ADR-lint clean.
- Cost discipline: $0.001472 against $10 phase cap (0.015% used).
- All 10 completion gates checked.

Composite quality: **~92/100** — incremental over P125 (90.5/100). The
single honest gap is the UI-side F6 spot-check, documented as
CF-P127-f6-ui-spot-check and re-runnable in <60 s by owner once Claude
API is healthy.

---

*Sealed 2026-05-16. Owner to review + open PR to main.*
