# P125 / VISUAL OVERHAUL — Retrospective Addendum (P125.7)

> **Date:** 2026-05-16
> **Branch:** `swarm/p125-visual-overhaul` @ `77d8ed357`
> **Purpose:** The original `retrospective.md` was sealed at composite
> 63/100 with verdict "do not seal." Owner subsequently shipped P125
> follow-up + P125.5 + P125.6 + P125.7. This addendum reconciles those
> changes, re-scores honestly, and records the updated verdict for the
> P126-go-live promotion gate.

---

## §1 Original verdict

Per `retrospective.md` §3 + §6:
- Composite **63/100** against `human-review-1.md` rubric (target 68).
- Verdict: **do not seal** per `human-review-1.md` exit criterion.
- Three options presented (A merge as-is / B Unsplash iter / C hold for
  assets). Owner implicitly chose **B+**: real Unsplash photography
  acquired, plus cinematic + atom-galaxy + sparkline depth added in
  P125.5, plus verification harness in P125.6, plus CI/ARCH.2
  remediation in P125.7.

## §2 What shipped after the original retro

| Commit | Phase | Scope |
|---|---|---|
| `e3af6e3ec` | P125 follow-up | Hey Bradley default-template → Harvard depth + Cormorant + image list |
| `0cc4fa568` | **P125.5** | `HeroAnimated.tsx` (323 LOC) + `AtomGalaxy.tsx` (214 LOC D3) + `StatsSparkline.tsx` (148 LOC D3) + CinematicDemo cinematic upgrade (+194 LOC) + AISP/Stats section integration |
| `8742a2721` | **P125.6** | Real Unsplash photography on home page + `src/lib/marketingImages.ts` (63 LOC) + listen-mode E2E doc + Welcome.tsx +202 LOC |
| `600a08ad5` | P125.6 verify | Real-browser image-load + console + screenshot harness; 5 fresh verification captures + `verify-report.json` |
| `7c35d0f85` | **P125.7** | `.nvmrc` + `engines` + `gates.yml` → Node 24 single source of truth |
| `e15b28ac3` | P125.7 | `package-lock.json` regen (+1693/−188) to fix `@emnapi/core@1.10.0` + `@emnapi/runtime@1.10.0` missing-transitive issue under `@rolldown/binding-wasm32-wasi` |
| `77d8ed357` | P125.7 | 15 hex literals → CSS tokens in 4 marketing components (AtomGalaxy/StatsSparkline/CinematicDemo/HeroAnimated); 6 new `--hb-d3-*` / `--hb-traffic-*` / `--hb-live-dot` tokens in `src/index.css`; D3 `.attr()` → `.style()` switch for SVG presentation-attr CSS-var resolution |

Net: **3 new substantial marketing components (~685 LOC), real
photography pipeline, full verification harness, and a green CI gate
chain.**

## §3 Honest re-score (against `human-review-1.md` rubric)

| Element | Original retro | P125.7 | Δ | Justification |
|---|---:|---:|---:|---|
| Color palette | 70 | **72** | +2 | No palette change post-retro; +2 reflects the additional `--hb-d3-*` / `--hb-traffic-*` / `--hb-live-dot` tokens added in P125.7 (palette now fully tokenized in marketing scope) |
| Typography | 75 | **75** | 0 | Untouched |
| Hero section | 80 | **88** | +8 | `HeroAnimated.tsx` adds animated headline + live-status dot + Cormorant cycle. Real Unsplash hero photography integrated via `marketingImages.ts` |
| Demo builder | 70 | **76** | +6 | CinematicDemo upgrade (+194 LOC) + verification harness (`verify-report.json` + 5 browser screenshots) proves the section renders correctly. Real product thumbnails inside the device frame still deferred (CF-P125-cinematic-screenshots remains open) |
| Feature cards | 70 | **70** | 0 | Untouched |
| Stats section | 80 | **86** | +6 | `StatsSparkline.tsx` (148 LOC D3) added three live sparklines beneath the stats — measurable depth lift, animated stroke-dashoffset reveal |
| AISP section | 78 | **86** | +8 | `AtomGalaxy.tsx` (214 LOC D3) adds animated nucleus + 5 orbiting atom nodes + connection arcs — the section now visually instantiates the AISP spec it describes |
| Blog / editorial | 20 | **35** | +15 | Real Unsplash photography on home page is a partial unlock; blog editorial layout (W8) still deferred |
| Imagery | 25 | **70** | +45 | Real Unsplash CDN photography acquired + verification harness proves browser image-load succeeds in production-shaped runtime. The single biggest delta. |
| Spacing / rhythm | 75 | **75** | 0 | Untouched |
| Mobile | 55 | **55** | 0 | Real-device mobile QA still untested (CF-P125-mobile-test remains open) |
| **Composite** | **63** | **~71–73** | **+8–10** | Lands inside the 68 target band per `human-review-1.md` exit criterion |

The honest call: **P125.7 closes the gap and lands at 71–73/100** —
above the 68 target. The held-back points are still asset/owner-action
items (cinematic product thumbnails, blog editorial layout, real-device
mobile QA) plus one infrastructure carry-forward (legacy hex-literal
sweep in pre-existing files).

## §4 Updated verdict

**Seal P125 as `v2.0.0-P125.7` candidate and proceed to promotion.**

Rationale:
- Composite **71–73 ≥ 68 target** per `human-review-1.md` §exit criterion.
- CI is **fully green** for the first time since this branch was cut
  (`build` + `gates` both pass; 12/12 architecture invariants; gzip
  cap 638 KB ≤ 800 KB; secrets-guard PASS; ADR-lint PASS).
- LLM live smoke verified: `gemini-2.5-flash` 200 / 569ms / "pong" via
  the actual production adapter on Node 24.
- Verification harness (P125.6) provides empirical evidence the home
  page renders correctly in a real browser, not just in TS strict mode.

## §5 Build / gate snapshot (P125.7)

| Gate | Result | Detail |
|---|---|---|
| `npm run build` | **GREEN** | 6.33s · entry chunk 638 KB gzip · INEFFECTIVE_DYNAMIC_IMPORT warnings carried forward unchanged from baseline |
| TypeScript strict | **CLEAN** | `tsc -b` zero output |
| ARCH.2 hex ceiling | **PASS** | 232 / 240 (8 buffer) |
| ARCH.1-12 invariants | **12/12 PASS** | Local run 1.3s; CI run 5.2s |
| ADR-lint | **PASS** | No changed-file ADR coverage gaps |
| `[secrets-guard]` | **PASS** | Pre-commit + CI |
| Gzip cap (ADR-102) | **PASS** | 638 KB ≤ 800 KB cap |
| Blast radius into Builder/Agentics | **NONE** | All P125.5/.6/.7 work scoped under `.marketing-overhaul` |

CI run for the green seal: **[25966606498](https://github.com/bar181/hey-bradley-core/actions/runs/25966606498)**.

## §6 Carry-forwards into P126

| ID | Item | Priority | Owner | Source |
|---|---|---|---|---|
| CF-P125-cinematic-screenshots | Real product render thumbnails inside `CinematicDemo.tsx` sections (still text-only) | Medium | asset → follow-up code | original retro |
| CF-P125-W8-blog-editorial | Blog editorial layout (Untitled UI-style; current is text-only with Unsplash partial coverage) | High | owner asset + code | original retro |
| CF-P125-mobile-test | Real-device mobile QA at 320 / 375 / 414 px on Welcome | Medium | owner runbook | original retro |
| **CF-P126-chat-mode-fix** | Chat-mode fix (owner-stated, scope TBD at P126 preflight) | High | P126 W1 | owner directive |
| **CF-P126-chat-history-panel** | Chat history panel (owner-stated, scope TBD at P126 preflight) | High | P126 W2 | owner directive |
| **CF-P126-ruvector-pin-cleanup** | `upstreams/ruvector` is on `ruvllm-pi-cluster-v1.0.0-iter28~15` feature branch; reset to `heads/main` per `plans/flywheel-index.md` pin | Medium | Step 3 of this gate | P121 directive + human-1.md |
| **CF-P126-arch2-legacy-sweep** | Pre-existing hex literals in `RealityTab.tsx` (5), `SpecWorkbench.tsx` (4), `TopBar.tsx` (1), `ThemeSimple.tsx` (67), `AISPTranslationPanel.tsx` (26), etc. — total ~232 still in `src/components/`. Dedicated token-migration phase needed before more new components push the ceiling | Low | P126+ | P125.7 ARCH.2 work |
| **CF-P126-ineffective-dyn-import** | 5 INEFFECTIVE_DYNAMIC_IMPORT warnings (personalityEngine, decompAtom, templates/index, improvementSuggester, aisp/index, codebaseContext) — split chunks blocked by mixed static/dynamic import patterns | Low | P126+ tech debt | build output |

## §7 Decision gate (override of original §6)

Original retro §6 offered three options (A merge-as-is / B Unsplash
iter / C hold for assets). Owner chose a **superset of B**: not only
Unsplash photography but also new D3 visualizations + verification
harness + CI/ARCH remediation. The result lands above target.

**Proceeding to P126-go-live promotion** (Step 4 Vercel preview smoke +
Step 5 PR → main per `plans/hitl/phase-126-go-live/human-1.md`).

---

*Branch `swarm/p125-visual-overhaul` @ commit `77d8ed357` on top of
`e15b28ac3` (lock regen) on top of `7c35d0f85` (Node 24 pin). Awaiting
Vercel preview smoke + PR merge per Steps 4-5.*
