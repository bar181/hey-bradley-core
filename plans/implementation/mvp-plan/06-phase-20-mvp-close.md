# Phase 20 — Verify, Cost Caps, MVP Close, Vercel Deploy

> **Stage:** D — MVP Exit
> **Estimated effort:** 3–4 days
> **Prerequisite:** Phases 18 and 19 closed.
> **Successor:** Post-MVP (auth, cloud sync, advanced AISP).

---

## North Star

> **The deployed site passes the Master Acceptance Test from `00-overview.md` §8 end-to-end on a clean browser. Capstone-ready.**

---

## 1. Specification (S)

### 1.1 What changes

1. **Cost telemetry surfaced.** A small footer pill shows session token spend in USD; flips to amber at 80%, red at 100%.
2. **Hard cap enforced.** When session reaches `VITE_LLM_MAX_USD`, calls return `error: 'rate_limit'` with banner "Session cost limit reached. Adjust in Settings.".
3. **Master e2e test** added to Playwright covering all 10 steps of the Master Acceptance Test.
4. **Persona review** completed: Grandma 70+, Framer 80+, Capstone 88+.
5. **Vercel deploy** verified with BYOK happy path.
6. **Open-source readiness pass:** `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.env.example`, `SECURITY.md` (BYOK trust boundary), `docs/getting-started.md` (60-second BYOK walkthrough).
7. **Deferred-features triage** — every Stage 4/5 backlog item gets a final disposition: post-MVP-1, post-MVP-2, dropped.
8. **Retrospective** captures what to keep, drop, and reframe for post-MVP.

### 1.2 What does **not** change

- Anything in chat, listen, persistence, or rendering pipelines (this is the close-out phase).

### 1.3 Novice impact

- A novice sees the cost pill and a clear cap message — never an unexplained refusal.
- A novice can read `getting-started.md` in 60 seconds and run the demo.

---

## 2. Pseudocode (P)

```
on every successful llm_call:
  sessionUsd += call.cost_usd
  ui.costPill.update(sessionUsd, capUsd)
  if sessionUsd / capUsd >= 0.8: ui.costPill.amber()
  if sessionUsd >= capUsd: ui.costPill.red(); pipeline.disable('cost_cap')

on user adjusts cap in Settings:
  capUsd = newValue; persist to kv; reset banner if appropriate
```

The end-to-end Playwright test scripts the 10-step Master Acceptance Test and runs against a Vercel preview build.

---

## 3. Architecture (A)

### 3.1 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/components/shell/CostPill.tsx` | Footer indicator |
| EDIT | `src/contexts/intelligence/llm/cost.ts` | Add `sessionUsd` accumulator + listeners |
| EDIT | `src/contexts/intelligence/chatPipeline.ts` | Pre-call cap check |
| EDIT | `src/components/settings/LLMSettings.tsx` | Show + edit cap |
| CREATE | `tests/mvp-e2e.spec.ts` | All 10 acceptance steps |
| CREATE | `docs/adr/ADR-047-cost-cap.md` | Decision record |
| CREATE | `docs/getting-started.md` | 60-second BYOK walkthrough |
| EDIT | `README.md` | Update status, screenshots, BYOK section |
| CREATE | `CONTRIBUTING.md` | Standard OSS file (concise) |
| CREATE | `SECURITY.md` | BYOK trust boundary statement |
| EDIT | `.env.example` | Confirm final keys, comments |
| EDIT | `plans/deferred-features.md` | Final disposition column |
| CREATE | `plans/implementation/mvp-plan/REVIEW.md` | Swarm review of this plan (created earlier; updated here at close) |
| CREATE | `plans/implementation/mvp-plan/RETRO.md` | MVP retrospective |

### 3.2 ADR to author

#### ADR-047 — Cost Telemetry & Hard Cap

- **Decision:** Per-session USD spend is tracked in memory + audit log; UI shows pill; calls hard-stop at cap.
- **Default cap:** `$1.00`. Configurable in Settings; capped at $20 for safety.
- **Rationale:** Prevents runaway cost on misbehaving prompts; gives the user a calm visible bound.
- **Status:** Accepted.

### 3.3 README.md outline (final)

- 30-second pitch
- BYOK + privacy note
- 60-second quickstart (link to `docs/getting-started.md`)
- Architecture diagram (existing)
- Security model (link to `SECURITY.md`)
- License + citation (existing)

### 3.4 SECURITY.md outline

- **No backend.** All your data is in your browser.
- **BYOK.** Your LLM API key is stored on your device only when you tick "Remember on this device". Otherwise it lives only until you close the tab.
- **What we send to the LLM.** Your current site JSON, the chat message, the system prompt. No analytics, no telemetry beacons.
- **What we never store on a server.** Anything. We have no server.
- **Reporting.** Open a GitHub issue with the `security` label.

---

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Cost pill works.** With Haiku at $1 cap, a stuck loop hits the cap and the pill flips red.
- **B — Master e2e green.** All 10 steps automated and passing on a Vercel preview build.
- **C — Persona review.** Three personas walk through the demo. Scores recorded.
- **D — Docs.** A stranger can clone, set a Haiku key, and run the demo following `docs/getting-started.md` in under 5 minutes.
- **E — Deploy.** Vercel main deploy is live; URL recorded.

### 4.2 Intentionally deferred

- Multi-region edge deploy.
- Automated cost-anomaly detection.
- Full a11y audit (only critical issues fixed; broader audit is post-MVP).

---

## 5. Completion (C) — DoD Checklist

- [ ] `CostPill` visible in shell footer
- [ ] Hard cap enforced; `chatPipeline` refuses calls when reached
- [ ] Settings allow editing cap (range 0.10–20.00)
- [ ] `tests/mvp-e2e.spec.ts` covers all 10 acceptance steps
- [ ] Persona review document committed under `plans/implementation/phase-20/personas.md`
- [ ] Grandma ≥ 70, Framer ≥ 80, Capstone ≥ 88
- [ ] `docs/getting-started.md` exists and reads in ≤ 60 seconds
- [ ] `README.md`, `CONTRIBUTING.md`, `SECURITY.md` updated
- [ ] `plans/deferred-features.md` has a Disposition column with `Post-MVP-1`, `Post-MVP-2`, or `Dropped` for every item
- [ ] Vercel main deploy is green; URL in README
- [ ] Master checklist (08) shows 100% green for Phases 15–20
- [ ] `RETRO.md` written
- [ ] `REVIEW.md` updated with swarm review summary
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds; bundle size logged in retrospective
- [ ] All previous Playwright tests still green
- [ ] No new `console.error` during the Master Acceptance Test

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := CostPillVisible ∧ HardCapEnforced ∧ E2EGreen ∧ PersonasGreen ∧ DocsShipped ∧ DeployLive ∧ RetroDone
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `wire_cost_pill` | Phase17ClosedOrLater | CostPillVisible | 1 |
| `enforce_hard_cap` | wire_cost_pill | HardCapEnforced | 1 |
| `expose_cap_in_settings` | enforce_hard_cap | CapEditable | 1 |
| `write_e2e_test` | Phase19Closed | E2EGreen | 3 |
| `run_persona_review` | E2EGreen | PersonasGreen | 2 |
| `write_getting_started` | Phase19Closed | DocsShipped | 1 |
| `update_readme_security` | Phase19Closed | DocsShipped | 1 |
| `triage_deferred_features` | repo clean | DeferredTriaged | 1 |
| `vercel_deploy` | E2EGreen | DeployLive | 1 |
| `swarm_review_plan` | mvp-plan files exist | ReviewDone | 2 |
| `write_retro` | DeployLive | RetroDone | 1 |
| `final_close_check` | every above | GoalMet | 1 |

### 6.3 Optimal plan (cost = 16)

```
1. wire_cost_pill
2. enforce_hard_cap
3. expose_cap_in_settings        ┐
4. write_e2e_test                │ parallel
5. write_getting_started         │
6. update_readme_security        │
7. triage_deferred_features      ┘
8. swarm_review_plan
9. run_persona_review
10. vercel_deploy
11. write_retro
12. final_close_check
```

### 6.4 Replan triggers

- Vercel build fails on `sql.js` wasm asset → adjust `vite.config.ts` `assetsInclude` and re-run.
- Persona scores miss target → identify single root cause; if patchable in ≤ 4 h, fix; else document and re-target only the failing persona +2 in retro.

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vercel deploy fails on wasm | M | Pre-test by building locally and inspecting output; configure `vite-plugin-wasm` if needed |
| Cost cap bug (off-by-one) | L | Unit-test cost math against fixed examples |
| Personas reveal a critical UX gap | M | Time-box fix to 4 h; if larger, defer to Post-MVP-1 |
| Persona reviewers unavailable | M | Pre-schedule three reviewers a week before close |
| Demo flakes on slow networks | M | Add 8 s timeout banner with retry CTA |

---

## 8. Hand-off to Post-MVP

A short post-MVP backlog file is created: `plans/implementation/post-mvp/README.md` listing:

- Anthropic prompt caching.
- Streaming render.
- Whisper / better STT.
- Cloud sync (Supabase or similar).
- Auth & accounts.
- Multi-page editor.
- Marketplace.
- Server-side rate limiting & shared key tier.
- Advanced AISP intent agents.

These are the things explicitly cut from MVP; they are now backlog candidates rather than urgent work.

---

## 9. Capstone-ready Definition

The MVP is **capstone-ready** when:

1. The Master Acceptance Test is green.
2. The deployed URL works for a stranger with their own key.
3. The retrospective is signed off by the human owner.
4. The post-MVP backlog exists and has at least the items listed above.

That is the close.
