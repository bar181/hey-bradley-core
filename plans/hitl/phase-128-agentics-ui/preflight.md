# P128 / AGENTICS SPECS UI — Preflight

> **Mission:** Ship the Agentics panel "Update the Specifications" card —
> green/yellow badges per spec, master button, per-spec progress bar with
> last-updated timestamp, checklist with real-time status, $ spent vs $10
> cap indicator. **Hard gate: non-AISP spec templates must score ≥75/100
> on the brutal-honest reviewer rubric before any UI work begins.**
>
> **Branch:** `swarm/p128-agentics-ui` cut from `main` @ `fc2f9b4f2`.

---

## 1. Owner-locked decisions (per session 2026-05-16 directive)

- **Template quality lift FIRST, UI second.** A user clicking "Update Specifications" and getting a 40/100 Features spec loses trust faster than no button at all.
- **Threshold:** all 6 non-AISP templates must score ≥75/100 on brutal-honest review against the same 3 P126 example sites.
- **Re-review with the same reviewer agent persona** that scored them low in P127 (bundle reviewers 4/5/6 + cross-site reviewer 7).
- **Document each template revision as a mini-ADR entry appended to ADR-156** — do not create new ADR files for incremental tweaks.
- **UI work blocked** until Step 3 passes.

## 2. Feature roster

| # | Feature | Scope | Status |
|---|---|---|---|
| **F1** | Baseline re-review | Re-run bundle reviewer agents (4-7) against current iter-3.1 outputs from P127 to establish a fresh baseline; record current scores per template | pending |
| **F2** | Template revisions | For each spec template scoring <75/100, identify root cause (thin examples, missing context, underspecified allowed sections, generic Ω, etc.) and revise. Re-run pipeline. Re-score. Iterate until ≥75 | pending |
| **F3** | ADR-156 mini-ADR addenda | Append each template change as a short entry to ADR-156 explaining what changed and why | pending |
| **F4** | Specs store (Zustand) | Persist spec bundle to a Zustand store + localStorage with `{ siteHash, specs: { [id]: { content, validation, updatedAt } } }`. The UI binds to this store | pending |
| **F5** | Staleness detector | Hash the current MasterConfig; compare to the hash captured at last spec-run time. Drift = STALE (yellow badge). Same hash = FRESH (green) | pending |
| **F6** | Agentics specs card UI | React component in the Agentics tab. Master "Update the Specifications" button, per-spec progress bar with last-updated timestamp, checklist (AISP → North Star → Features → Architecture → CSS → Build Plan → Human Spec), budget indicator ($ spent vs $10 cap) | pending |
| **F7** | Pipeline wiring | Wire the UI to `scripts/p127-spec-updater.mjs` via an API route or direct import (need to decide based on browser-vs-Node split) | pending |
| **F8** | E2E verification | Load Hey Bradley default template → open Agentics → click Update Specifications → confirm AISP two-step runs visibly first → badges flip green → timestamps update → cost matches chat-history.jsonl | pending |

## 3. ADRs

| ADR | Topic | Trigger |
|---|---|---|
| **ADR-156 addenda** | Per-template revisions (mini-ADR entries appended) | F3 |
| **ADR-157** (new) | Specs Zustand store + staleness detector | F4/F5 |
| **ADR-158** (new) | Agentics UI ↔ spec-pipeline wiring (browser/node split decision) | F7 |

## 4. Quality bar — what ≥75/100 looks like per spec

| Spec | What lifts the score from 40-60 → 75+ |
|---|---|
| **North Star** | Concrete win condition tied to a measurable outcome; named audience persona, not "general users"; non-goals; differentiator from a real competitor |
| **Features** | P0/P1/P2 with explicit dependencies; each item ties to a section ID; no padding ("compelling hero" is structural, not a feature) |
| **Architecture** | Stack choice (React vs Astro vs Next), routing strategy, form handler, hosting (Vercel vs Netlify vs Cloudflare), error/empty/loading states, SEO/OG, image strategy, a11y target beyond contrast |
| **CSS** | Already strong (JSON tokens); add motion-reduce + responsive breakpoints |
| **Build Plan** | Realistic effort (1-3 days for a static 5-section site, not 8-12); DoD that's observable; dependency arrows between phases |
| **Human Spec** | Already strong (≤300 words, prose). Lift = sharper differentiator + concrete win condition |

## 5. DoD — completion gates

- [ ] **F1** baseline re-review captured; per-template scores in `template-iterations/00-baseline.md`
- [ ] **F2** every non-AISP template ≥75/100 on re-score (proof in `template-iterations/<spec>-iter-N.md`)
- [ ] **F3** ADR-156 addenda appended with rationale per change
- [ ] **F4** Specs store ships (Zustand + localStorage)
- [ ] **F5** Staleness detector ships (config hash comparison)
- [ ] **F6** Agentics specs card renders with badges + progress + button + budget pill
- [ ] **F7** Pipeline wired (API route or direct import)
- [ ] **F8** E2E verified: AISP first → 7 badges flip green → cost matches
- [ ] **Build green** (npm run build, ARCH 12/12, secrets clean)
- [ ] **session-log.md** updated throughout
- [ ] **retrospective.md** completed at seal

## 6. Carry-forwards (inherited from P127)

| ID | Item | Status |
|---|---|---|
| CF-P128-agentics-specs-card | This phase's main UI deliverable | F6 |
| CF-P128-non-aisp-spec-quality | Template lift to ≥75/100 | F1/F2/F3 — GATING UI |
| CF-P128-parallel-after-aisp | Parallelize 6 non-AISP specs after AISP completes | nice-to-have during F7 |
| CF-P128-spec-store-zustand | Persistence + last-updated-ago | F4 |
| CF-P128-spec-staleness-detector | Config-hash → STALE/FRESH badge | F5 |

## 7. Cost / budget

- Step 3 template lift: 4-6 reviewer agents per iteration × 3-5 iterations ≈ 20-30 LLM calls. Plus re-running the spec pipeline 2-3 times = additional ~$0.20 each. Total estimate: ~$0.50–1.00.
- UI work (F4-F8) involves no LLM cost (React only).
- $10 phase budget. 5-10% expected spend.

## 8. Risks

- **Template lift may not converge.** If a template stays below 75 after 3 iterations, escalate: maybe the spec type itself is wrong for the site shape (e.g., DDD architecture for a static portfolio is theater no matter how good the template). Document the gap; consider per-site-type template variants.
- **Browser/Node wiring.** `@google/genai` runs in Node. The browser UI can't call it directly. Options: (a) bundle the pipeline into a serverless function, (b) call Gemini directly from the browser with the BYOK key (existing pattern from P126), (c) require the owner to run the pipeline locally first and just consume the JSON output. Decide in F7 via ADR-158.

## 9. UI deferral rationale

The owner's directive is unambiguous: "Do not ship the Agentics card UI until the non-AISP templates are at 75/100 or better on the brutal-honest rubric." This phase is sequenced template-quality-first. The UI is the visible top of the iceberg; the templates are the load-bearing wall under it.
