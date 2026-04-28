# Phase Plan — Public Website Rebuild (open-core BYOK demo)

> **Slot:** Inserts as **P22** in sequential Option A (after P21 cleanup; shifts Sprint B from P21-P23 → P23-P25).
> **Effort:** 2-4 hours @ velocity (4 phases/day post-P19).
> **Persona gate:** Grandma ≥70 BINDING.
> **ADR:** New ADR-053 — Public site information architecture.
> **Source:** `plans/implementation/phase-22/wave-1/A3-website-assessment.md`

## North Star

> **A first-time visitor understands what Hey Bradley does in 10 seconds, sees the 3 modes (Builder / Chat / Listen) with one demo each, and either tries the BYOK demo locally OR clones the open-core repo. Commercial features are mentioned in one sentence pointing to a separate repo. No Supabase. No hosted demo without BYOK.**

## Design philosophy — Don Miller / StoryBrand + blog-style

Per owner directive: **less is more impactful.** The site uses StoryBrand-derived copy structure and blog/article-style page composition.

### StoryBrand 7-part copy structure (applied per page)

1. **A character** — the visitor (creator with an idea, struggling to translate it to specs)
2. **Has a problem** — the 55% pre-code phase eats time; AI tools can't read your mind
3. **Meets a guide** — Hey Bradley (with a clear empathetic voice; you've been here before)
4. **Who gives them a plan** — talk → site appears → specs export to your AI tool
5. **And calls them to action** — "Try the demo" (primary) / "Read the spec" (secondary)
6. **That avoids failure** — without us: another idea dies in the telephone game
7. **And ends in success** — your idea, made visible, with specs your AI agent can execute

### Blog-style pages (less navigation, more reading)

- Long-form articles per page; narrative > feature-list
- ONE primary CTA per page; ONE secondary
- No carousels, no auto-playing video, no modals
- Cover image + headline + lede + body + closing CTA — same template per page
- Section headings act as nav anchors (table-of-contents on long pages)
- Marketing nav: 5 items max (Welcome / Three Modes / AISP / BYOK / About)

### Content density

- Headlines ≤ 8 words
- Lede ≤ 35 words
- Body sections ≤ 200 words each, broken with headings every ~150 words
- Code blocks for AISP examples only; everything else is plain prose
- Stats/numbers as inline emphasis, not as callout cards (drop the 3-stat-grid pattern from current OpenCore)

## 1. Specification (S)

### 1.1 Scope IN

- 11 public pages refreshed to reflect actual P15-P19 capabilities
- Welcome.tsx (918 LOC) reduced to ~250 LOC (drop 8-showcase carousel)
- Docs.tsx counts updated: 12 themes / 17 examples / 16 section types / 300 media / 38 ADRs / 63 tests
- HowIBuiltThis.tsx phase table updated (P1-P19 + P18b sealed)
- OpenCore.tsx repurposed for explicit open-core-vs-commercial delineation
- New page or section: BYOK setup walkthrough (60-second flow; 5 providers)
- New page or section: AISP dual-view (Crystal Atom + human-readable side-by-side)
- Theme alignment: pick ONE direction (recommend warm-cream like in-product app, NOT dark-grey of OpenCore.tsx today)
- Live demo embed OR "Try it" CTA → opens app at `/onboarding`

### 1.2 Scope OUT

- Commercial-version Supabase integration (separate repo)
- Hosted demo without BYOK (commercial)
- Multi-page complex apps (commercial)
- Pricing tiers (commercial)
- Auth flow (commercial)

### 1.3 Per-page deliverables

| Page | Current LOC | Target LOC | Change |
|---|---:|---:|---|
| `Welcome.tsx` | 918 | ~250 | Drop 8-showcase carousel; single hero + 3-mode tiles + 3 CTAs |
| `OpenCore.tsx` | 429 | ~350 | Repurpose: keep "55% problem" thesis; add explicit open-core-vs-commercial section; update repo links |
| `Docs.tsx` | 275 | ~280 | Refresh counts (12/17/16/300/38/63); fix QUICK_START step 2 ("258+" → "300") |
| `HowIBuiltThis.tsx` | 247 | ~280 | Refresh: 33→38 ADRs; P1-P11 → P1-P20 phase table; LOC stat 100K→63K (or drop COCOMO); 71→63 tests |
| `AISP.tsx` | 258 | ~260 | Add Crystal Atom side-by-side with human-readable spec; cross-link to bar181/aisp-open-core |
| `About.tsx` | 223 | ~230 | Add "Sealed P15-P19 + P18b at composite 88+; defending May 2026" |
| `Research.tsx` | 308 | ~300 | Spot-verify counts; minor refresh |
| `Onboarding.tsx` | 740 | unchanged | In-product flow; not part of marketing rebuild |
| `Builder.tsx` | 5 | resolve | Either expand to a real builder-landing page OR remove route |
| `NotFound.tsx` | 20 | unchanged | OK |
| **NEW**: `BYOK.tsx` | — | ~200 | 60-second walkthrough with 5-provider table + cost-cap screenshot + privacy disclosure |

Total LOC delta: -1,000 (carousel removal dominates).

### 1.4 NEW components

- `src/pages/BYOK.tsx` (~200 LOC) — provider table + key-shape examples + cost-cap UI screenshot + privacy disclosure block; reuses theme tokens from in-product app
- `src/components/marketing/ModeTiles.tsx` (~80 LOC) — Builder / Chat / Listen tiles with one-line each + CTA per tile (used on Welcome)
- `src/components/marketing/AISPDualView.tsx` (~120 LOC) — Crystal Atom + human-spec side-by-side block (used on AISP page + How-it-works)
- `src/components/marketing/OpenCoreVsCommercial.tsx` (~60 LOC) — single delineation block (used on OpenCore page)

## 2. Pseudocode (P)

```
WelcomePage:
  hero(title="Tell Bradley what you want. Watch it appear.",
       sub="A whiteboard that listens, builds in real-time, and writes specs.",
       ctas=[TryIt, OpenCoreRepo, ReadSpecs])
  modeTiles(builder, chat, listen)  // 3 tiles, one-line each
  livedemoEmbed OR demoCta
  capstoneFooter

BYOKPage:
  intro(subhead="No account. No backend. Your key. Your machine.")
  providerTable(claude, gemini, openrouter, simulated, agentProxy)
    - per-row: key-shape, where-to-get, dollars-per-call estimate
  costCapScreenshot(annotated)
  privacyDisclosure(noAnalytics, noTelemetry, noServerSide)
  ctaTryIt
```

## 3. Architecture (A)

### 3.1 Routes
- `/` → Welcome
- `/byok` → BYOK (NEW)
- `/aisp` → AISP
- `/how-it-works` → repurpose existing or new (small)
- `/open-core` → OpenCore (delineated)
- `/docs` → Docs (refreshed)
- `/about` → About
- `/research` → Research
- `/how-i-built-this` → HowIBuiltThis (refreshed)
- `/onboarding` → existing (in-product)
- `*` → NotFound

### 3.2 Theme alignment

**Recommendation:** WARM-CREAM (matches in-product app):
- BG: `#faf8f5`
- Surface: `#f5f0eb`
- Accent: `#e8772e`
- Text primary: `#2d1f12`
- Listen-mode block on Welcome can keep dark `#0a0a0f` as a contrast island

OpenCore.tsx today uses `#1a1a1a` dark + `#A51C30` Harvard crimson — drop crimson, keep dark for "55% problem" hero only, then transition to warm-cream for the rest of the page.

### 3.3 Component reuse

- `MarketingNav` (existing) — verify nav items match new pages
- `lucide-react` icons — already used; keep
- `framer-motion` — already used in Welcome; keep for hero, drop carousel
- `react-router-dom` — Link components

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — Welcome compressed.** 918 → ~250 LOC; carousel removed; 3-mode tiles render
- **B — Counts truth-up.** All stale counts replaced (HowIBuilt 33→38 ADRs, Docs 10→17 examples, etc.)
- **C — BYOK page works.** New `/byok` route renders 5-provider table + cost-cap screenshot + privacy disclosure
- **D — AISP dual-view live.** Crystal Atom + human-spec side-by-side block renders on `/aisp` and `/how-it-works`
- **E — Open-core-vs-commercial delineated.** OpenCore.tsx has explicit "open-core (this repo) vs commercial (separate repo)" section
- **F — Theme aligned.** All 11 pages use warm-cream tokens (or documented dark-island exceptions)
- **G — Persona walks.** Grandma ≥70 (binding), Framer ≥75, Capstone ≥85 on the rebuilt site

### 4.2 Intentionally deferred

- Pricing page (commercial)
- Auth flow (commercial)
- Live demo iframe inside the marketing site (decision: link out to `/onboarding` instead — simpler)
- Newsletter signup, contact form, blog (post-MVP)

## 5. Completion (C) — DoD Checklist

- [ ] Welcome.tsx ≤ 280 LOC (down from 918)
- [ ] Docs.tsx counts truthed (12 themes / 17 examples / 16 sections / 300 media / 38 ADRs / 63 tests)
- [ ] HowIBuiltThis.tsx phase table covers P1-P20; ADR count = 38; LOC stat fixed
- [ ] OpenCore.tsx has explicit open-core-vs-commercial delineation block
- [ ] New `/byok` page exists with 5-provider table
- [ ] AISP dual-view component renders on `/aisp`
- [ ] Theme tokens consistent across 11 pages (or documented dark-island exceptions)
- [ ] Builder.tsx route resolved (expanded OR removed)
- [ ] All MarketingNav links resolve
- [ ] +5 Playwright cases (3 visual regression on Welcome/OpenCore/BYOK; 1 link-integrity sweep; 1 BYOK setup walk)
- [ ] Grandma persona walk: site recap in <10 seconds; score ≥70
- [ ] Framer persona walk: 3-mode pitch ≥75
- [ ] Capstone persona walk: AISP visible without mid-product navigation; ≥85
- [ ] ADR-053 (Public site IA) authored
- [ ] No source-code regressions (existing `tests/p18*.spec.ts`, `p19*.spec.ts` still green)
- [ ] `npm run build` green
- [ ] `tsc --noEmit` exit 0
- [ ] No new `console.error` during full-site click-through

## 6. GOAP Plan

### 6.1 Goal state
```
goal := WelcomeCompressed ∧ CountsTruth ∧ BYOKPageLive ∧ AISPDualView
      ∧ OpenCoreDelineated ∧ ThemeAligned ∧ PersonasGreen ∧ ADR053
```

### 6.2 Optimal plan (cost ~3h @ velocity)

```
1. Truth-up counts (Docs + HowIBuilt + Research)         [30m]
2. New BYOK.tsx page + ModeTiles component                [45m]
3. AISPDualView component + plumb into AISP/How-it-works  [30m]
4. OpenCoreVsCommercial component + repurpose OpenCore    [30m]
5. Compress Welcome.tsx (drop carousel; add ModeTiles)    [45m]
6. Theme-alignment pass across all 11 pages               [20m]
7. Persona walks + record scores                          [30m]
8. ADR-053 authored                                       [10m]
9. +5 Playwright cases                                    [15m]
```

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Theme mismatch (warm-cream vs dark) creates inconsistency | M | Pick warm-cream for everything except OpenCore "55% problem" hero |
| Welcome carousel deletion breaks downstream links | L | Audit `Link to=` references before deletion |
| New BYOK page surfaces details Better-served by SECURITY.md | L | Cross-link to SECURITY.md (P20 deliverable) for full disclosure |
| Grandma persona fails ≥70 | M | Iterative: ship Welcome compression first; A/B test copy |
| Carousel removal drops pizzazz; site feels empty | M | Replace with 3-mode tiles + animated demo embed (motion-design budget intact) |

## 8. Success criteria

- 10-second comprehension test: 5/5 strangers describe Hey Bradley correctly
- Grandma ≥70 / Framer ≥75 / Capstone ≥85
- Welcome.tsx ≤ 280 LOC; total marketing-page LOC reduced by ~1,000
- All 11 pages render without console errors
- BYOK setup completable in under 60 seconds (manual stopwatch test)

## 9. Cross-references

- `phase-22/wave-1/A3-website-assessment.md` (gap analysis driving this plan)
- `CLAUDE.md ## Project Status` (truth source for capability counts)
- `bar181/aisp-open-core` (external; for AISP dual-view content)
- ADR-029 (no backend), ADR-040 (export sanitization), ADR-043 (BYOK), ADR-046 (provider matrix), ADR-048 (STT)
- P20 SECURITY.md (Day 2 deliverable; cross-link from BYOK page)

---

**Author:** coordinator (replacing timed-out swarm agent A5)
**Output:** `plans/implementation/phase-22/A5-website-rebuild-plan.md`
**Activates:** post-P21 (cleanup) seal; targets P22 slot in sequential numbering
