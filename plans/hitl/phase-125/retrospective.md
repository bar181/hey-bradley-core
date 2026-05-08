# P125 / VISUAL OVERHAUL — Retrospective

> Self-evaluation at the seal candidate point. **Verdict: do not seal.**
> Composite at 62–66/100; target was 68. Owner decides whether to iterate
> in P125 or accept this as a checkpoint and ship.

---

## §1 What shipped

| Wave | Scope | Output |
|---|---|---|
| W1 | Color tokens (Harvard depth) | `.marketing-overhaul` block in `src/index.css` (~50 LOC) — scoped, zero blast radius |
| W2 | Typography (Cormorant + DM Mono) | font import + 5 utility classes |
| W3 | Hero rebuild | radial-crimson orb + grid overlay + Cormorant headline + italic-crimson `<em>` + ALM eyebrow |
| W4 | Cinematic demo | new `CinematicDemo.tsx` (~310 LOC) replaces ListenPreview |
| W5 | Stats section | new `StatsSection.tsx` (~120 LOC) — capstone v8 slide 8 in code |
| W6 | AISP marketing section | new `AISPSection.tsx` (~190 LOC) — capstone v8 slides 6+7 in code |
| W7 | Feature cards redesign | `.marketing-feature-card` with crimson left bar on hover |
| W9 | Removed "Coming from another builder?" | one line cut from hero |

**Net change:** 8 files / 1366 insertions / 41 deletions in commit `89f6032db`.
Plus the cherry-pick of CF-Loop3-thinking thinking-budget fix in `1b9e3f0c1`.

## §2 What slipped

- **W8 (blog editorial)** — fully deferred. Real photography is owner
  asset work; placeholders via Unsplash CDN hot-linking is a
  CSP/cross-origin call that warrants owner sign-off, not a swarm
  decision.

## §3 Honest re-score (against `human-review-1.md` rubric)

| Element | Pre-P125 | Post-P125 | Δ | Why |
|---|---:|---:|---:|---|
| **Color palette** | 22 | **70** | +48 | Harvard near-black `#07070e`, warm white `#f0ede5`, depth via radial-orb + grid + grain. Still no real photo behind it. |
| **Typography** | 30 | **75** | +45 | Cormorant on every headline, italic-crimson `<em>`, DM Mono eyebrows at 0.22em, hierarchy varies clamp(56-120) → 26px. |
| **Hero section** | 42 | **80** | +38 | Eyebrow + Cormorant + radial orb + grid + grain + pill CTAs. Still missing real photography. |
| **Demo builder** | 18 | **70** | +52 | Device frame + transcript + animated build + AISP card. Crafted illusion in pure CSS — no real product screenshots yet. |
| **Feature cards** | 35 | **70** | +35 | Dark surface + crimson left bar + Harvard Blue icon + Cormorant heading + translateY hover. |
| **Stats section** | 0 | **80** | +80 | Capstone v8 slide 8 in code: +42% blue / 92% crimson featured / <2% white, all Cormorant 8vw. |
| **AISP section** | 0 | **78** | +78 | Capstone v8 slides 6+7 in code: 5 Crystal Atom cards + δ-bar comparing 40-65% prose vs 1.6% AISP. |
| **Blog/editorial** | 20 | **20** | 0 | Untouched (W8 deferred). |
| **Imagery** | 5 | **25** | +20 | Radial orb + grid + grain provides atmosphere; cinematic demo *is* imagery in CSS; still no real photography. |
| **Spacing/rhythm** | 48 | **75** | +27 | py-24 / py-28 sections; eyebrow → headline → body → CTA cadence; max-w-5xl/6xl content widths. |
| **Mobile** | 40 | **55** | +15 | clamp() typography scales; grid responds md:; untested in real device. |
| **Overall** | **35** | **~63** | **+28** | Below 68 target by 5 points. |

The honest call: P125 closed roughly half the gap to capstone-v8
quality on every surface that received code work. The held-back points
are imagery + blog + mobile-test — all asset/owner-action items, not
code.

## §4 Plan correction (feed-forward)

When the next visual phase opens, the constraint to break is **imagery**
not **code**:

1. Owner sources Unsplash placeholders or real product screenshots →
   blog can move 20 → 60 in a single afternoon (CSS lift only after
   assets exist).
2. Real product render thumbnails replace the text-only sections inside
   `CinematicDemo.tsx` → demo can move 70 → 85.
3. Hero photography behind the radial orb → hero 80 → 92+.

Estimated impact of asset acquisition on composite: **+8–12 points**,
which lands the site solidly in the 70–75 indie-product band.

## §5 Carry-forwards (named, prioritized)

| ID | Item | Priority | Owner |
|---|---|---|---|
| **CF-P125-W8-photography** | Blog editorial photography (Unsplash CDN OR real assets) + Untitled UI editorial layout | High | owner asset acquisition |
| **CF-P125-imagery-hero** | Hero photography behind orb (capstone v8 slide 1 quality) | High | owner asset acquisition |
| **CF-P125-cinematic-screenshots** | Real product thumbnails inside `CinematicDemo.tsx` sections | Medium | owner asset → follow-up code phase |
| **CF-P125-mobile-test** | Real-device mobile QA at 320/375/414 px on Welcome | Medium | owner runbook |
| **CF-P125-asis-mode** | If owner accepts ~63 as checkpoint, merge `swarm/p125 → main`; else iterate | — | owner decision |

## §6 Decision gate

Per `human-review-1.md` exit criterion: *"If [doesn't approach capstone
v8 quality] → do not seal."*

Composite **63 < 68 target** → **do not seal as-is.**

**Owner options:**

A. **Accept ~63 as a 28-point lift** (35 → 63, biggest single phase
   delta in the project's history) and merge to main. Imagery
   carry-forwards are real but they're asset-acquisition, not code
   bottlenecks. Risk: review committee or first-impression visitors
   see the gap on blog + imagery.

B. **Iterate W8 with Unsplash placeholders.** Quick lift to ~67–68 in
   one more cycle. Risk: external image hot-linking needs CSP /
   security review; placeholders read as placeholders.

C. **Hold the merge until owner asset work lands** for hero + cinematic
   demo + blog. Realistic landing zone: 72–75. Risk: assets are
   unscheduled.

Recommendation: **A** if review committee tolerates the gap; **B** if
they don't and Unsplash placeholders pass legal/security; **C** if
there's runway for asset acquisition.

## §7 Build / gate snapshot

| Gate | Result | Detail |
|---|---|---|
| `npm run build` | **GREEN** | 6.50s · entry chunk 638.07 KB gzip (cap ≤800 KB) · +0.38 KB net for entire overhaul |
| TypeScript strict | **CLEAN** | `tsc -p . --noEmit` zero output |
| `[secrets-guard]` | **PASS** | no key-shape patterns in commit diff |
| Blast radius into Builder/Agentics | **NONE** | tokens scoped under `.marketing-overhaul`; global `--hb-bg` etc. unchanged |

---

*Branch `swarm/p125-visual-overhaul` @ commit `89f6032db` (P125 visual
overhaul) on top of `1b9e3f0c1` (CF-Loop3-thinking fix). Awaiting owner
decision on §6.*
