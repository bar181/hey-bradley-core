# P125 — Session Log

> Running log of every dispatch, decision, and fix. Primary source for
> any later agent that needs to understand what happened in P125.

---

## 2026-05-09 — Codespace restart + baseline

- Codespace stopped (shiny guacamole). Owner restarted.
- `npm run build` post-restart → green at 7.62s, entry 637.69 KB gzip.
- Dev server `npm run dev` → HTTP 200 in 5 ms, predev WASM copy succeeded.
- Submodule status: `upstreams/ruflo` at `01070ede` (v3.5.78-2 → v3.5.80
  drift), `upstreams/ruvector` at `d209fc4c`. Both initialized; drift
  expected per P121 directive (not auto-bumping in feature commits).

## 2026-05-09 — CF-Loop3-thinking fix on main

- Owner-supplied path was `src/lib/llm/geminiAdapter.ts`. That directory
  doesn't exist in this tree; actual file is at
  `src/contexts/intelligence/llm/geminiAdapter.ts`. Used the actual path.
- Edit: `thinkingConfig: { thinkingBudget: 0 }` + `maxOutputTokens 1024 →
  4096` in `complete()` SDK config block.
- Rationale: P123 Loop 3 evidence — `AGENT_ATOM` ran 1158 output tokens
  against 1024 cap. Thinking-token overhead was bursting silently.
- Branched off main: `fix/cf-loop3-thinking`.
- ADR-150 doesn't exist on main (P122/P123 work is local-only on
  `swarm/p122-ux-overhaul`). Skipped the addendum-file edit; captured
  rationale in the PR body instead.
- Committed `3f3b8b9d0`. Pushed. Opened **PR #2** to `bar181/hey-bradley-core:main`.
- TS strict clean. `[secrets-guard]` pre-commit pass.

## 2026-05-09 — P125 cut

- Switched back to `swarm/p122-ux-overhaul` (P123 seal commit `46b9a443c`).
- Cut `swarm/p125-visual-overhaul` off it.
- Cherry-picked `3f3b8b9d0` (thinking fix) onto P125 → commit `1b9e3f0c1`.
  Auto-merge succeeded; trivial conflict resolved by SDK config block
  (P122 firstCallLogged guard preserved).

## 2026-05-09 — Human visual review intake

- Owner-supplied review: `plans/hitl/phase-123/human-review-1.md`
  (~470 LOC) puts visual at 35/100 vs swarm self-score of 90.5/100.
- Reality check: 90.5 was scoring functional/structural correctness;
  35 is honest visual against modern peers.
- Treated this document as the P125 preflight contract — color system,
  typography, W1–W9 wave plan, exit criteria all sourced from it.

## 2026-05-09 — W1 + W2 (foundation: tokens + typography)

- `index.html`: added `Cormorant Garamond` + `DM Mono` to the Google
  Fonts import URL.
- `src/index.css`: appended `.marketing-overhaul` scope (~50 LOC) with
  Harvard depth tokens — `--hb-void #000000`, `--hb-deep #07070e`,
  `--hb-bg #07070e`, `--hb-surface #0f0f1a`, `--hb-surface-2 #16162a`,
  `--hb-border rgba(255,255,255,0.07)`, `--hb-text-primary #f0ede5`,
  `--hb-blue #6578B4`, `--hb-accent-hover #8C1515` (downgrade from
  the previous `#C1283E` bright-crimson for hover).
- Added `.marketing-h1`, `.marketing-h2`, `.marketing-eyebrow`,
  `.marketing-body`, `.marketing-mono` typography classes.
- Added `.marketing-hero-bg` (with `::before` radial-crimson orb +
  `::after` grid overlay), `.marketing-grain` (SVG fractal noise at
  2.5% opacity).
- Added `.marketing-feature-card` (W7) with `::before` crimson left bar.
- Added `@keyframes p125-stat-pulse`, `p125-section-rise`, `p125-wave-bar`,
  `p125-cursor-blink` for cinematic demo + stats glow.

## 2026-05-09 — W4/W5/W6 components

- `src/components/marketing/StatsSection.tsx` (~120 LOC) — W5; three
  Cormorant 8vw stats; +42% (Harvard Blue) / 92% (crimson + glow pulse) /
  <2% (white). Eyebrow "SWE-bench Verified · January 2026".
- `src/components/marketing/AISPSection.tsx` (~190 LOC) — W6; five
  Crystal Atom cards (Ω Σ Γ Λ Ε) on near-black surface with crimson
  border. δ-bar comparing industry 40-65% vs AISP 1.6%. Link to /aisp.
- `src/components/marketing/CinematicDemo.tsx` (~310 LOC) — W4;
  device frame + traffic-light header + transcript left (You crimson,
  Bradley Harvard Blue) + animated site build right (3 sections rise
  in sequence) + AISP spec card in bottom-right corner. Replay button
  after first cycle. Pure CSS/React; no real builder call.

## 2026-05-09 — W3 + W7 + W9 (Welcome.tsx)

- Wrapper class: `dark` → `dark marketing-overhaul`.
- Hero: replaced `<HeroOrb size={600} />` + DM-Sans `<h1>` with
  `.marketing-hero-bg .marketing-grain` section + `.marketing-h1`
  Cormorant headline `Describe it. <em>See it.</em>` + ALM eyebrow.
- Replaced `<ListenPreview />` with `<CinematicDemo />`.
- Removed "Coming from another builder?" link line (W9).
- WAYS feature cards: replaced the `bg-[var(--hb-surface)]` cards with
  `.marketing-feature-card` class. Lucide icons retinted from crimson
  to Harvard Blue (`var(--hb-blue)`).
- Wired `<StatsSection />` between hero and section 2.
- Wired `<AISPSection />` between section 3 ("Take it anywhere") and
  section 4 ("Open core").

## 2026-05-09 — Build + commit

- TypeScript strict: clean (no output).
- `npm run build`: green at 6.50s; entry chunk `638.07 KB gzip` (cap
  ≤800 KB; +0.38 KB net for the entire overhaul).
- Pre-existing `INEFFECTIVE_DYNAMIC_IMPORT` warnings on `aisp/index.ts`
  and `chatPipeline.ts` carried forward; not introduced by P125.
- Commit `89f6032db`: 8 files / 1366 insertions / 41 deletions.
- `[secrets-guard]` pre-commit pass.

## 2026-05-09 — Honest re-score

- Composite estimate: **62–66/100**.
- Below 68 target by 2–6 points.
- Held back by: imagery (no real photography), blog editorial deferred,
  mobile untested.
- Per human review exit criterion, do **not** seal. Owner decides next
  step (carry-forwards in retrospective).

## Carry-forwards out of P125

| ID | Item | Owner |
|---|---|---|
| CF-P125-W8-photography | Blog editorial photography | asset acquisition |
| CF-P125-mobile-test | Real-device mobile QA | owner runbook |
| CF-P125-imagery-hero | Hero photography behind orb | asset acquisition |
| CF-P125-cinematic-screenshots | Real product thumbnails in CinematicDemo | follow-up phase |
