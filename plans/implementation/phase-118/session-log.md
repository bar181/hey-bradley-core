# P118 — Simple Messaging + Product-Market Fit — Session Log

> **Phase:** P118 · **Sprint:** SIMPLE-MESSAGING-AND-POSITIONING · **Date:** 2026-05-06
> **Branch:** swarm/p118-simple-messaging
> **Predecessor:** P117 sealed at `2d44cc0`

## Wave-by-wave timeline

### Wave 1 — Audit (commit `6e6e521`)

Read-only inventory of all 11 marketing/public surfaces. Output: `docs/audit/p118-public-pages-inventory.md` (257 LOC).

Findings:
- **5 pages flagged for reframe** — Welcome / About / OpenCore / Blog / Research
- **2 pages flagged for repurpose** — `/research` recommended as engineer-track home; standalone AISP page deprioritized
- **~70 numbers** flagged across the public surface (test counts, ADR counts, phase numbers, percentages)
- **12 competitor mentions** flagged across public copy (Lovable / WordPress / Wix / Cursor / Copilot etc.)
- **50+ jargon hits** (AISP / Crystal Atom / CLAUDE.md / JSON-patch / DDD / Σ-Γ-Λ-Ε)

Recommendation: collapse all numbers + competitor names + technical jargon out of the consumer-track surface into the 3 new long-form blog posts. Keep engineer-track depth on `/research` + `/open-core` headers + `/aisp`.

### Wave 2 — Fixes (3 commits)

#### F1 — Welcome reframe + useReveal + MarketingNav simplify (commit `f6104de`)

- `src/pages/Welcome.tsx` — REWRITE 0 → 272 LOC. Apple-style 5-section scroll story:
  - Section 1 hero: H1 "Describe it. See it." + animated typed-sentence-morphs-into-hero demo
  - Section 2: "It works the way you talk." (Speak / Type / Adjust three-card grid)
  - Section 3: "Take it anywhere." (export-to-Claude-Code handoff pitched in plain English; cross-link to blog post 3)
  - Section 4: "Open core. Yours to keep." (Easter-egg "Read what's coming next →" → `bar181/aisp-open-core`)
  - Section 5: Closing CTA "From your idea to a real site, in your words."
- NEW `src/hooks/useReveal.ts` (37 LOC; intersection-observer fade-in; `prefers-reduced-motion: reduce` gate; pure browser-native API).
- `src/components/MarketingNav.tsx` — −3 LOC. Demos and standalone AISP demoted from primary nav. New nav set: About / Blog / Research / Open Core / Docs + Try Builder CTA.

#### F2 — 3 NEW blog posts (commit `6c022f6`)

All under `src/pages/blog/posts/`:
- `describe-it-see-it.md` — 1034 words; founder-direct preset; Maren-the-therapist user story; carries the relocated 4-row builder comparison table (WordPress / Wix / Lovable / Hey Bradley)
- `why-we-built-this-the-honest-version.md` — 1198 words; theron-miller-hard-twist preset; the "55% of websites haven't been touched in a year" framing relocated from `/open-core` hero
- `the-handoff-that-changes-everything.md` — 1354 words; founder-direct preset; the JSON-patch architectural moat described in plain English (no explicit cost multipliers — the F2 brief deliberately reframed without "10×/100×" language)

Total new blog content: 3586 words across 3 posts; blog post count 12 → 15 (≥3 above ADR-097 floor of 12).

#### F3 — About / OpenCore / Blog / Research polish (commit `40359ca`)

- `src/pages/About.tsx` — −46 LOC. Test-count scoreboard stripped; AISP section softened (depth retained but framing shifted to teaching mode); `/onboarding` → `/new-project` path reconciled.
- `src/pages/OpenCore.tsx` — −35 LOC. Phase numbers + competitor names purged from body. Atom checklist reframed as plain-English capability list. NEW: "For everyone else, start here →" consumer-track entry near top of page (line 25).
- `src/pages/Blog.tsx` — −21 LOC. `HEADLINE_STATS` deleted. AISP jargon softened in card excerpts.
- `src/pages/Research.tsx` — +40 LOC. Easter-egg ribbon prominent: "Read what's coming next →" linked to `bar181/aisp-open-core`. Engineer-track positioning reinforced; this is the route engineer-audience members are routed to from `/open-core`'s soft entry.

### Walkthrough planning (commit `0fffd50`)

- `plans/implementation/phase-118/walkthrough/concept-draft.html` — owner brief preserved verbatim
- `plans/implementation/phase-118/walkthrough/walkthrough-simplified-plan.md` — 6-scene mobile-first plan
- **Deferred to P118.5** pending owner answers to 4 open questions:
  1. Scene 1 opening line
  2. Scene 5 hero character (Maren / Don / generic)
  3. Auto-advance default (on / off)
  4. CTA order (Start describing / Read the post / GitHub repo)

### Wave 3 — Closer (this run)

- `docs/adr/ADR-146-simple-messaging-positioning.md` — NEW; 49 LOC ≤120 cap; Status Accepted; 5 decisions (D1 H1 lock + D2 no-numbers/competitor/jargon + D3 two-track audience + D4 CSS-only animation + D5 Easter-egg surface); 7 cross-refs ADR-085 + ADR-090 + ADR-091 + ADR-094 + ADR-097 + ADR-141 + ADR-144.
- `tests/p118-simple-messaging.spec.ts` — NEW; ≤300 LOC cap; 14 describe blocks P118.1-P118.14 / 22 cases.
- `plans/implementation/phase-118/session-log.md` — this file.
- `plans/implementation/phase-118/retrospective.md` — Keep/Drop/Reframe + 6-row before/after table + 6-item carry-forward registry.
- `docs/adr/README.md` — header counter 136 → 137 + highest-ID ADR-145 → ADR-146 + ADR-146 row in "Post-RC hardening" bucket renamed P110-P117 → P110-P118 + policy line "ADR-146+" → "ADR-147+".
- `CLAUDE.md` — surgical sync (P118 entry + tests anchor + ADR count + blog post count + positioning anchor).

## Verification

- `npx tsc --noEmit` — CLEAN
- `npx tsc -p tsconfig.app.json --noEmit` — CLEAN
- `npx playwright test tests/p118-simple-messaging.spec.ts --project=chromium` — all GREEN
