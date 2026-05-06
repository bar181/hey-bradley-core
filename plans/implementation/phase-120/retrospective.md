# P120 / AUDIENCE-ROUTING — Retrospective

## What shipped

A 4-agent parallel + closer dispatch closing two audience-routing gaps surfaced by the segment-segment review:

1. **Engineer + product-team entry points** missing from primary nav.
2. **Blog had no audience filter** — 15 posts as a flat list with no self-select route.

P120 ships 7-link primary nav, 2 NEW pages (`/for-teams` + `/contact`), 1 blog 3-category filter, 1 redirect (`/guides` → `/blog?category=technical`), and 3 cross-page entry-strip links from Welcome / Research / About into the right destinations.

## Audience routing outcomes

| Surface | Before P120 | After P120 |
|---|---|---|
| Primary nav | 5 links: About / Blog / Research / Open Core / Docs | 7 links: + For developers (→ `/research`) + For teams (→ `/for-teams`) between Research and Open Core |
| `/for-teams` | 404 | NEW page; Cursor / Claude-Code teams audience; persistent spec + CLAUDE.md handoff + agent scope map; honest scope (no team workspaces / no SSO — Tier-2) |
| `/contact` | 404 | NEW page; LinkedIn `bradaross` + GitHub `bar181/{hey-bradley-core,aisp-open-core}` + Capstone defense May 2026 + Agentics Foundation; no form, no tracking |
| `/guides` | 404 | Redirects to `/blog?category=technical` (preserves any external link to `/guides` that may have leaked into wild-internet history) |
| Blog index | Flat list of 15 | 3-tab category filter (Story / Technical / For teams) + URL-mirrored state via `useSearchParams` + per-card category pill + tab state survives back/forward |
| Welcome H2 | No comparison route | "Coming from another builder?" → `/blog/describe-it-see-it` (carries the 4-row comparison table relocated at P118 / ADR-146) |
| Research opener | Hero only | NEW 3-item Start-here entry strip: AISP spec / handoff blog / open core; routes engineer-track to existing depth |
| Research footer | About / Open Core / How it's built links | + Geek-mode Easter egg "See what the engineers see →" → `/aisp` (small, muted, footer-positioned) |
| About footer | "Built in the open" line | + "Work with us →" → `/contact` (partnership / acquirer / Capstone / Agentics-Foundation traffic) |

## Keep / Drop / Reframe

### Keep
- 4-parallel-disjoint-scope-Wave-1 + single-closer-Wave-2 dispatch pattern. Held discipline; held atomic commits; held disjoint scope; held composite key handling for React duplicate-target cases.
- `?category=` URL param for filter state — deep-linkable, browser-back-forward survivable, server-render-friendly. Same pattern as ADR-104 page-aware chat pipeline scope.
- Honest scope on `/for-teams` (Section 3 names what's NOT shipped). The credibility move IS the no-promises copy.
- ADR-146 D2 lock holding through "Coming from another builder?" — competitor names stay in blog-post bodies where audience self-selects, never on the marketing surface.

### Drop
- Initial closer thought "For developers" should be a NEW route. It's not — it routes to existing `/research` per owner brief. Dropped the idea of a NEW `/for-developers` page; saved ~150 LOC + closed one carry-forward by routing to existing engineer-track depth.

### Reframe
- The owner brief said "ADR-148" but ADR-148 was already taken (P119 / SITE-POLISH sealed the same day). Closer reassigned to ADR-149. Append-only ADR numbering policy preserved. Documented in the preflight + ADR cross-ref so future readers don't hunt for a missing P120 / ADR-148 mismatch.

## Carry-forwards

- **CF-P120-1** — Dedicated `/for-investors` or `/for-acquirers` page. Currently routed via About → `/contact`. If signal volume warrants, a dedicated page is the next move. Defer until 3+ inbound investor inquiries arrive.
- **CF-P120-2** — Team workspaces / shared cloud projects / SSO on `/for-teams`. Tier-2 commercial. Named explicitly on the page so the deferral is honest.
- **CF-P120-3** — A/B test which Welcome subtle-link copy converts best ("Coming from another builder?" vs "Switching from Lovable?" vs "Tried other AI builders?"). Blog post body keeps the competitor-named version; the marketing surface stays generic per ADR-146 D2 unless test data says otherwise. Post-launch.
- **CF-P120-4** — Mobile-nav hamburger if 7 nav items + Try Builder CTA crowd 375px viewport. P120 lands the entries straight; mobile-overflow polish if owner reports crowding on real devices.
- **CF-P120-5** — Owner husky pre-commit hook wire (sandbox-blocked from `.husky/` modify; carry-forward from ADR-138 D3 / ADR-139 D3 / ADR-140 D3). Unchanged from P119.

## Tests

`tests/p120-audience-routing.spec.ts` — 20 describes / 22 cases P120.1-P120.20:
- ADR-149 file shape (3 cases): exists + Accepted + ≤120 LOC + ≥5 cross-refs
- MarketingNav: For developers → /research (1) + For teams → /for-teams (1) + composite-key fix (1)
- ForTeams: file + named export + Section 1 H1 (1) + honest-scope copy (1)
- Contact: file + named export + LinkedIn + 2 GitHub repos (1)
- main.tsx: 3 paths (/for-teams + /contact + /guides) (1) + lazy named-export adapters (1) + Navigate import + redirect target (1)
- Blog: useSearchParams + blog-category- testid pattern (1) + 3 category labels (1) + slug-override classifications (1)
- blogPosts.ts: categoryOf + BLOG_CATEGORY_LABEL + BlogCategory type exports (1)
- Welcome: builder-comparison link literal + target (1) + competitor-name regression guard (1)
- Research: 3 entry-strip targets (1) + Geek-mode Easter egg (1)
- About: Work-with-us literal + /contact target (1)
- EOP triplet (3 cases — preflight + session-log + retrospective)
- KISS no-new-deps denylist (1)

Plus the legacy P71 spec updated to use the new `blog-category-filter` / `blog-category-all` testids (rationale documented inline citing ADR-149 / P120/A4).
