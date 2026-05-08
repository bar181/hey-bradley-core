# P120 / AUDIENCE-ROUTING — Preflight

**Phase:** P120
**Sprint name:** AUDIENCE-ROUTING
**Branch:** `swarm/p120-audience-routing`
**Parent:** P119 / SITE-POLISH (sealed at `ca1444b`)
**Audit basis:** `plans/strategic-reviews/2026-05-07-audience-segment-review.md` (committed at `e242836`)
**ADR target:** ADR-149 (number assignment — ADR-148 already taken by P119)

> **Note on number drift:** The owner brief originally said "ADR-148" for this sprint. ADR-148 was assigned to P119 / SITE-POLISH same-day (P119 sealed at `ca1444b` ahead of the P120 dispatch). Closer A5 reassigns to ADR-149. Append-only ADR numbering policy preserved.

## Mandate

Close the two audience-routing gaps surfaced by the segment-segment review:
1. Engineer + product-team entry points missing from primary nav.
2. Blog has no audience filter (15 posts as flat list).

Ship 3 new audience entry points (For developers / For teams / Contact), 1 blog 3-category filter via `?category=` URL param, 1 redirect (`/guides` → `/blog?category=technical`), and 3 cross-page entry-strip links from Welcome / Research / About.

## Wave plan

| Wave | Agent | Scope | Owns |
|------|-------|-------|------|
| 1 | A1 | Research entry strip + Geek-mode Easter egg | `src/pages/Research.tsx` |
| 1 | A2 | NEW `/for-teams` page | `src/pages/ForTeams.tsx` |
| 1 | A3 | NEW `/contact` page + About footer link | `src/pages/Contact.tsx` + `src/pages/About.tsx` |
| 1 | A4 | Blog 3-category filter + Welcome H2 link | `src/pages/Blog.tsx` + `src/lib/blogPosts.ts` + `src/pages/Welcome.tsx` |
| 2 | A5 | Closer — `MarketingNav.tsx` 2 nav entries + `main.tsx` route registration + ADR-149 + tests + EOP triplet + ledger sync | `src/components/MarketingNav.tsx` + `src/main.tsx` + `docs/adr/ADR-149-audience-routing.md` + `tests/p120-audience-routing.spec.ts` + `plans/implementation/phase-120/{session-log,retrospective}.md` + `docs/adr/README.md` + `CLAUDE.md` |

Wave 1 is 4 parallel disjoint-scope agents. Wave 2 is the single-agent closer.

## Hard rules

- NO new dependencies (KISS denylist per ADR-144 D5 / ADR-146 D4 holds).
- ADR-149 ≤ 120 LOC.
- 12+ NEW Playwright cases; all GREEN; existing P118 / P118.5 / P119 regression coverage stays GREEN.
- Both tsc strict configs CLEAN (`tsc --noEmit` + `tsc -p tsconfig.app.json --noEmit`).
- ADR-146 D2 lock holds — no competitor names on Welcome / About body / OpenCore body / Blog cards / Research body. Specific competitor names live in blog-post bodies where audience self-selects (per D3 of this sprint's ADR).

## Done means

- 7-link primary nav (About / Blog / Research / For developers / For teams / Open Core / Docs) + Try Builder CTA.
- `/for-teams` + `/contact` routes registered + `/guides` redirects to `/blog?category=technical`.
- Blog renders 3-tab category filter (Story / Technical / For teams) with URL-mirrored state.
- 3 cross-page entry-strip links land (Welcome H2 → comparison post / Research Start-here → 3 destinations / About footer → /contact).
- ADR-149 Accepted; tests/p120-audience-routing.spec.ts ≥12 cases GREEN; EOP triplet at phase root; ADR ledger advanced 139 → 140; CLAUDE.md synced.
