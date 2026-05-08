# P120 / AUDIENCE-ROUTING — Session Log

## Wave 1 — 4 parallel disjoint-scope agents (commits)

| Agent | Commit | Scope |
|-------|--------|-------|
| A1 | `7a487ee` | Research Start-here strip (3 entry points: AISP / handoff blog / open core) + Geek-mode Easter egg footer link to `/aisp` |
| A2 | `a48c9db` | NEW `/for-teams` page (Cursor/Claude-Code teams audience; persistent spec + CLAUDE.md handoff + agent scope map; honest scope; ≤200 LOC) |
| A3 | `b21ea48` | NEW `/contact` page (LinkedIn `bradaross` + GitHub `bar181` + 2 repos + Harvard ALM Capstone May 2026 + Agentics Foundation; no form, no tracking) + About footer Work-with-us link |
| A4 | `e44c2f6` | Blog 3-category filter (Story / Technical / For teams) via `?category=` URL param + Welcome H2 link "Coming from another builder?" → `/blog/describe-it-see-it` (no competitor names per ADR-146 D2) + blogPosts.ts P118 posts registered + categoryOf/BLOG_CATEGORY_LABEL/BlogCategory exported |

## Wave 2 — Closer A5 (this run)

1. Verified Wave 1 surfaces — all 4 commits intact; Welcome / Research / About / Blog / blogPosts.ts / ForTeams / Contact files render expected literals.
2. EDIT `src/components/MarketingNav.tsx` — added 2 nav entries: `For developers` → `/research` + `For teams` → `/for-teams`; positioned between Research and Open Core; switched `key={link.to}` → `key={link.to}|${link.label}` to handle the duplicate `/research` target (Research + For developers both route there).
3. EDIT `src/main.tsx` — added `Navigate` import from react-router-dom; lazy imports for `ForTeams` + `Contact` via named-export adapter; registered `/for-teams` + `/contact` routes + `/guides` redirect to `/blog?category=technical` in BOTH the success-init and error-init Routes blocks.
4. NEW `docs/adr/ADR-149-audience-routing.md` (54 LOC ≤120 cap; Accepted; 6 cross-refs ADR-090 + ADR-091 + ADR-097 + ADR-110 + ADR-146 + ADR-148; 5 decisions D1-D5).
5. NEW `tests/p120-audience-routing.spec.ts` (~210 LOC; 20 describes / 22 cases P120.1-P120.20).
6. UPDATE `tests/p71-blog-expansion.spec.ts` — legacy `blog-tag-filter` testid superseded by `blog-category-filter` (P120/A4 replaced the UI). Updated assertion to reference the new testid; rationale documented in the test body referencing ADR-149.
7. NEW `plans/implementation/phase-120/{preflight,session-log,retrospective}.md` (EOP triplet).
8. EDIT `docs/adr/README.md` — header counter 139 → 140; highest-ID ADR-148 → ADR-149; bucket renamed "Post-RC hardening (P110-P119)" → "(P110-P120)"; ADR-149 row appended; policy line "ADR-149+" → "ADR-150+".
9. EDIT `CLAUDE.md` — surgical P120 entry, top-line ADR/test counter sync.
10. tsc strict CLEAN (both configs); P120 spec all GREEN; P118 / P118.5 / P119 regressions all GREEN.
