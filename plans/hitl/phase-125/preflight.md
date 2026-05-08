# P125 / VISUAL OVERHAUL — Preflight

> **Mission:** Lift the marketing surfaces (Welcome + supporting sections)
> from a human visual score of 35/100 toward 68/100 — strong indie-product
> quality, not Apple, but well above the Wix-Pro floor.
>
> **Branch:** `swarm/p125-visual-overhaul` (cut from P123 seal commit
> `46b9a443c` on `swarm/p122-ux-overhaul`).
>
> **Predecessor:** P123 / UX-CONTINUATION + LLM-LIVE sealed 2026-05-08
> with composite 90.5/100 *functional* score. Human visual review
> (`plans/hitl/phase-123/human-review-1.md`) returned 35/100 visual.

---

## 1. Source spec

This entire phase is driven by `plans/hitl/phase-123/human-review-1.md`.
That document is the preflight contract — quality bar, color system,
W1–W9 wave plan, exit criteria. This file is a thin shell that records
how P125 was set up and what scope it carries.

## 2. Owner-locked decisions

- **Reference design:** `bradley-capstone-v8.html` quality bar + Untitled
  UI editorial layout (blog) + Phase 3 mockup (cinematic demo).
- **Color system:** Harvard official palette only.
  - Primary: Crimson `#A51C30` (the only red), Black, White
  - Accent (data/research only): Harvard Blue 2 `#6578B4`
  - **NOT Harvard, removed:** gold `#C8A44A`, flat `#1e1e1e`/`#2a2a2a`
    gray, orange.
- **Typography:** Cormorant Garamond for all marketing headlines (NOT
  DM Sans). DM Mono for eyebrows. DM Sans 18px 300-weight for body.
- **Scope (do not touch):** builder code, LLM adapters, Gemini route,
  AISP code view inside builder, `/capstone`, `/docs`. Only touch
  `Welcome.tsx`, marketing CSS, new components in `src/components/marketing/`.

## 3. DoD (verbatim from human review)

- [x] `npm run build` clean
- [x] Color: Harvard crimson `#A51C30` only (no gold anywhere)
- [x] Backgrounds: `#000000` / `#07070e` (not flat gray)
- [x] Headlines: Cormorant Garamond on all H1/H2
- [x] Hero: radial orb + grid overlay visible
- [x] Demo: device frame, transcript left panel, animated site build right panel
- [x] Stats section: 3 numbers exist and render
- [x] AISP section: 5 Crystal Atom cards exist
- [x] Feature cards: hover animation + crimson border
- [ ] Blog: editorial layout, image placeholders — **DEFERRED** (CF-P125-W8-photography; needs real assets or owner sign-off on Unsplash CDN hot-linking)
- [x] "Coming from another builder?" removed
- [ ] Honest rescore: target 65–70/100 — **at 63 (under target by 2–7); see retrospective**
- [ ] Reference check: does it approach capstone v8 quality? — partial; W8 gap is the held-back point

## 4. Wave plan

| Wave | Scope | Output | Status |
|---|---|---|---|
| **W1** | Color tokens (Harvard depth scope) | `.marketing-overhaul` block in `src/index.css` | done |
| **W2** | Typography (Cormorant + DM Mono import + classes) | `index.html` font import + `.marketing-h1/2/eyebrow/body/mono` classes | done |
| **W3** | Hero rebuild (Welcome.tsx) | radial orb + grid overlay + Cormorant headline + italic-crimson `<em>` + ALM eyebrow | done |
| **W4** | CinematicDemo (replaces ListenPreview) | new `src/components/marketing/CinematicDemo.tsx` (~310 LOC) — device frame + transcript + animated build + AISP card | done |
| **W5** | StatsSection (capstone v8 slide 8) | new `src/components/marketing/StatsSection.tsx` (~120 LOC) — +42% / 92% / <2% | done |
| **W6** | AISPSection (capstone v8 slides 6+7) | new `src/components/marketing/AISPSection.tsx` (~190 LOC) — Ω Σ Γ Λ Ε cards + δ-bar | done |
| **W7** | Feature cards redesign (Welcome.tsx WAYS) | `.marketing-feature-card` class + crimson left bar on hover + Harvard Blue icon | done |
| **W8** | Blog editorial polish | needs photography or Unsplash sign-off — **DEFERRED** | carry-forward |
| **W9** | Remove "Coming from another builder?" | one-line removal in Welcome.tsx hero | done |

## 5. Risks / what could pull the score down

- **Blast radius into Builder/Agentics:** mitigated by scoping all new
  tokens under `.marketing-overhaul` wrapper. Verified — the global
  `--hb-bg`, `--hb-surface`, `--hb-border` tokens still resolve to the
  Builder's flat-gray scheme outside the wrapper.
- **Mobile regression:** Cormorant Garamond at `clamp(56px, 9vw, 120px)`
  scales but headline-heavy hero may overflow on 320px screens. Untested
  in real device — flagged in carry-forward.
- **Imagery debt:** real photography is owner-action, not code work.
  W8 cannot get past ~50/100 without it.

## 6. Carry-forwards out of P125

| ID | Item | Owner |
|---|---|---|
| **CF-P125-W8-photography** | Blog editorial photography (Unsplash placeholders OR real product/Harvard imagery) | owner asset acquisition |
| **CF-P125-mobile-test** | Real-device mobile pass at 320/375/414 px on Welcome | owner runbook |
| **CF-P125-imagery-hero** | Welcome hero behind-orb photography to lift hero 80 → 92+ | owner asset acquisition |
| **CF-P125-cinematic-screenshots** | Replace cinematic demo's text-only sections with actual Welcome / Builder render thumbnails | owner asset (or follow-up phase) |

---

*Cut from `swarm/p122-ux-overhaul` @ `46b9a443c` on 2026-05-09. Sealed
when honest re-score reaches ≥ 65; iterates again otherwise.*
