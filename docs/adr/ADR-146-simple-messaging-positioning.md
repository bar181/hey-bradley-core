# ADR-146: Simple Messaging + Product-Market Fit Standard

**Status:** Accepted
**Date:** 2026-05-06
**Phase:** P118 / SIMPLE-MESSAGING-AND-POSITIONING
**Cross-refs:** ADR-085 (Multi-Page MVP) · ADR-090 (Mobile UX Redesign) · ADR-091 (Canonical Component Quality) · ADR-094 (Professional Grade Standard) · ADR-097 (Blog Content Strategy) · ADR-141 (Storytelling presets) · ADR-144 (Final Visual Quality Standard / KISS denylist)

## Context

Through P117 the public surface narrowed Hey Bradley to a developer-tooling artifact ("Spec workbench · AISP-powered · Harvard ALM Capstone" / "Messy ideas → enterprise specs, instantly"). The product actually solves the largest underserved market in web software — the boutique service owner, the freelancer, the parent organizing the school fundraiser — people who tried Wix / WordPress / Lovable and were failed by every existing tool. The owner crystallized the right positioning verbatim: **"Describe it. See it."** Apple-style, story-first, user-as-hero. Engineer-track positioning still ships — but on `/research`, `/aisp`, `/open-core`, not on the home page. Public messaging must teach in plain English; technical depth lives where the audience self-selects.

## Decisions

### D1 — Public-surface positioning lock

H1 across `/` is **"Describe it. See it."** Apple-style scroll story (one idea per section, lots of whitespace, image > paragraph). User-as-hero per Don Miller. Replaces the prior engineer-first framing on `Welcome.tsx` only — engineer-track positioning continues at `/open-core` + `/research` + `/aisp`. The H2 must explicitly answer "for whom and what for" in plain English so the cryptic H1 lands.

### D2 — No numbers / no competitor names / no jargon on public pages

Test counts, ADR counts, phase numbers, market figures, percentages, LLM-cost multipliers do NOT appear in `Welcome.tsx` / `About.tsx` (body) / `OpenCore.tsx` (body) / `Blog.tsx` / `Research.tsx`. Competitor names (WordPress / Wix / Lovable / Cursor / Copilot / Windsurf / Codex / Devin / v0) live in the 3 new blog posts where audience self-selects. Crystal Atom / AISP / DDD / JSON-patch / Σ-Γ-Λ-Ε jargon lives in `/aisp` / `/research` / `/blog` only. The 4-row builder comparison table is relocated from the home page to `describe-it-see-it.md`. The "55% problem" frame relocates to `why-we-built-this-the-honest-version.md`.

### D3 — Two-track audience surface

Consumer-track (`/`, `/about`, `/blog`) speaks plain English. Engineer-track (`/research`, `/aisp`, `/open-core`, `/docs`) keeps technical depth. `MarketingNav` surfaces 5 items (About / Blog / Research / Open Core / Docs) plus a Try-Builder CTA; demos and standalone AISP demoted from primary nav. `OpenCore.tsx` ships a soft "For everyone else, start here →" link to `/` so engineers landing on the technical surface have a one-click route to the consumer story for non-technical referrals.

### D4 — CSS-only animation; no new dependencies

NEW `src/hooks/useReveal.ts` (≤40 LOC) implements intersection-observer fade-in via existing React + native browser APIs. ALL animation gates on `prefers-reduced-motion: reduce` — when set, content renders in its final state with no transition. KISS denylist per ADR-144 D5 holds: `framer-motion` / `gsap` / `lottie-web` / `@react-spring/parallax` / `animejs` / `react-spring` rejected. Hero typing animation + document-fly animation use scoped `@keyframes` injected via inline `<style>` block.

### D5 — Easter-egg surface

`bar181/aisp-open-core` GitHub link surfaces quietly on Welcome Section 4 ("Open core. Yours to keep.") as the "Read what's coming next" footer link, and prominently on `/research` as the primary CTA. The surface is positioned as where upcoming developments are sketched before they ship. Build-in-the-open is a positioning value, not a slogan — the public audience sees it once, the engineer audience finds it three times.

## Consequences

- Welcome.tsx now lives or dies by the H1 lock — every future change must keep "Describe it. See it." literally present.
- The `useReveal` hook is the canonical pattern for any public-surface fade-in across `/about`, `/open-core`, `/research`, `/blog`. New animation surfaces must use it; new motion deps remain rejected.
- Engineer-track pages keep technical density (test counts on `/about`, ADR refs on `/research`, etc.) — D2 scope is body copy on the named consumer-track public pages, not the engineer-track surfaces.
- The 3 new blog posts (`describe-it-see-it`, `why-we-built-this-the-honest-version`, `the-handoff-that-changes-everything`) are the long-form home for the comparison table, the 55% problem, and the JSON-patch architectural moat. Deleting them silently breaks the consumer-track narrative.
- The walkthrough page (planned at `plans/implementation/phase-118/walkthrough/`) is deferred to P118.5 pending owner answers to 4 open questions about scene 1 line / scene 5 character / auto-advance default / CTA order. The walkthrough is not load-bearing for D1-D5 acceptance.

## Carry-forwards

- **CF-P118-1:** walkthrough page implementation (P118.5 follow-up; gated on 4 owner Qs)
- **CF-P118-2:** owner-recorded video demo of "describe it · see it" flow
- **CF-P118-3:** A/B test new H1 vs old positioning post-launch (owner analytics)
- **CF-P118-4:** third blog post technical depth review after first feedback wave
- **CF-P118-5:** P117/A3 weak site shapes (restaurant / non-profit / fiction) — schema enum widening still pending
- **CF-P118-6:** husky pre-commit ADR-lint wire (sandbox-blocked owner-action carry from ADR-138/139/140)
