# P119 — Site Polish — Session Log

**Phase:** P119 / SITE-POLISH
**Date:** 2026-05-07
**Branch:** swarm/p119-site-polish
**Predecessor:** P118.5 sealed at `7f5fe54`

## Mode
Single-agent closer (no waves) — scope tightly bounded, surfaces disjoint.

## Surfaces touched

| File | Change | LOC delta |
|---|---|---|
| `src/index.css` | NEW `.dark { --hb-* }` override block (D2) | +25 |
| `src/components/MarketingNav.tsx` | Token-based; `bg-[var(--hb-paper)]/85` + `text-[var(--hb-ink)]` (Fix 3) | ~rewrite |
| `src/pages/Welcome.tsx` | Typewriter 2.4s → 1.6s; morph delay 2.2s → 1.2s (Fix 4) | 2 |
| `src/pages/Walkthrough.tsx` | Scene 1 placeholder hint "what would you like to build?" (Fix 5) | 4 |
| `src/pages/About.tsx` | Fix 1 (CTA) + Fix 2 (AISP research finding) + hex→token migration | ~rewrite |
| `src/pages/Research.tsx` | NEW "The math" subsection (`0.60⁵` / `0.98⁵` + Harvard ALM citation) + hex→token migration | ~rewrite |
| `src/pages/AISP.tsx` | Single-line compounding-math addition below ambiguity bars + Harvard ALM citation | +5 |
| `src/pages/OpenCore.tsx` | Hex→token migration (no copy changes) | mechanical |
| `docs/adr/ADR-148-site-polish-darkmode-research-citation.md` | NEW (48 LOC ≤120 cap; 4 decisions) | 48 |
| `tests/p119-site-polish.spec.ts` | NEW (18 describes / 24 cases) | 196 |
| `docs/adr/README.md` | Counter 138 → 139; highest-ID 147 → 148; ADR-148 row appended | +2 |
| `plans/implementation/phase-119/{preflight,session-log,retrospective}.md` | EOP triplet | this doc |
| `CLAUDE.md` | Surgical sync — P119 entry; ADRs 138 → 139 | +1 entry |

## Test results

`tests/p119-site-polish.spec.ts` — 18 describes / 24 cases / chromium project — all GREEN.
`tests/p118.5-walkthrough.spec.ts` (regression) — still GREEN.
`tsc --noEmit` — CLEAN.
`tsc -p tsconfig.app.json --noEmit` — CLEAN.

## Owner-locked copy verbatim verification

- About.tsx Telephone Game card body: contains `Capstone research at Harvard ALM` + `~40% ambiguity per step` + `over 90% intent preserved` (in `<strong>`).
- Research.tsx "The math" subsection: contains `0.60⁵ ≈ 7.8% intent preservation` + `0.98⁵ ≈ 90.4% intent preservation` + `Capstone research, Harvard ALM Digital Media Design — Bradley Ross, 2026.`
- AISP.tsx ambiguity-bars card footer: contains `Across five handoffs: industry baselines compound to ~8% intent preservation. AISP holds it above 90%.` + `*Capstone research, Harvard ALM 2026.*`

## Hard rules verified

1. NO new dependencies — package.json untouched (P119.13 GREEN).
2. ADR-148 = 48 LOC ≤ 120 cap (P119.1 GREEN).
3. Harvard ALM Capstone citation appears at every numerical claim (P119.3 / P119.5 / P119.6 GREEN).
4. `0.60⁵` + `0.98⁵` math present verbatim on Research + AISP (P119.5 / P119.6 GREEN).
5. About numbers framed plain-English (P119.3 GREEN).
6. Welcome no-numbers + no-jargon regression guards still GREEN (P119.14 / P119.15).
7. Walkthrough brand-invisible-1-5 regression guard still GREEN (P119.16).
8. Both tsc strict configs CLEAN.

## Closes

CF-P118-2 (no — that's owner-recorded video, post-launch).
**Honest gaps from P118 / P118.5 honest review** — 5 UX fixes + dark-mode tokens + AISP research surface — all closed in P119.
