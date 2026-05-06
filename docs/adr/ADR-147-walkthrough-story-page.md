# ADR-147: Walkthrough Story Page

**Status:** Accepted
**Date:** 2026-05-07
**Phase:** P118.5 / WALKTHROUGH
**Cross-refs:** ADR-090 (Mobile UX Redesign) · ADR-091 (Canonical Component Quality) · ADR-094 (Professional Grade Standard) · ADR-141 (Storytelling presets) · ADR-144 (Final Visual Quality Standard / KISS denylist) · ADR-146 (Simple Messaging + Product-Market Fit Standard)

## Context

P118 sealed the public-surface positioning reframe ("Describe it. See it.") on `Welcome.tsx` per ADR-146 D1. The walkthrough — a longer, story-paced surface that *shows* the product instead of describing it — was named as CF-P118-1 and deferred pending owner answers to four open questions: scene 1 line, scene 5 character, auto-advance default, CTA order. Owner answered each verbatim. The walkthrough now ships as a dedicated SECTION-LIKE PAGE at `/walkthrough` (not a full-screen replay app), mounting inside the normal `MarketingNav` layout. Don Miller voice guides the prose: brand invisible until the close, single first-person past-tense narrator across Scenes 1-5, friend-voice (not commit-log voice) on the iteration changelog, the user is the hero throughout.

## Decisions

### D1 — Walkthrough ships as SECTION-LIKE PAGE, not full-screen replay app

Route: `/walkthrough` (lazy-loaded; default export). Mounts inside `MarketingNav` + footer layout. `<main>` is the scroll-snap container (`snap-y snap-mandatory overflow-y-auto h-[calc(100vh-4rem)]`); 6 sequential `<section min-h-[calc(100vh-4rem)] snap-start>` elements deliver one idea per scene. Visitor-paced — no auto-advance timer; the story earns the next scene by the visitor scrolling. Scroll wheel + arrow keys + swipe + the page's own scroll bar all work. No `position: fixed inset: 0`, no `cursor: none`, no `overflow: hidden` on body.

### D2 — Don Miller voice; brand invisible until Scene 6

Single first-person past-tense narrator across Scenes 1-5: *"I needed"*, *"I described"*, *"It appeared"*, *"I kept talking"*, *"I sent"*. Brand "Hey Bradley" / logo / "Bradley" name does NOT appear in Scenes 1-5 body copy — the only brand surface in 1-5 is `MarketingNav` at the top of the layout. Scene 4 changelog speaks in **friend voice** — *"Changed the headline. Felt more honest."* — not commit-log voice (*"Hero headline updated to X."*). Scene 5 pivot: *"I sent the export to my nephew. He opened it in his AI coding assistant. He didn't ask me a single clarifying question."* Scene 6 close line LOCKED literal: **"From your idea to a real site, in your words."** Three CTAs in locked order: Start describing → `bar181/hey-bradley-core` → `bar181/aisp-open-core`.

### D3 — CSS animation only; no new dependencies

Uses existing `useReveal` hook from F1 (`src/hooks/useReveal.ts`; landed P118 commit `f6104de`). All scene-level animation gates on `prefers-reduced-motion: reduce` — when set, content renders in its final state with no transition. Inline `<style>` block defines four scoped keyframes: `wt-caret` (blinking cursor), `wt-fade-up` (Scene 3 + Scene 5 staggered file morph), `wt-slide-in` (Scene 4 changelog rows), `wt-pulse` (Scene 1 scroll indicator). Scene 2 typewriter uses React state + `setInterval` (cleanup in `useEffect`); reduced-motion shows full text immediately. KISS denylist per ADR-144 D5 holds — `framer-motion` is pre-existing baseline (already in `package.json`); `gsap` / `lottie-web` / `@react-spring/parallax` / `animejs` / `react-spring` rejected. Component LOC ≤220; body word count ≤220 (excluding nav, footer, CTA labels).

## Consequences

- The walkthrough is now the canonical "show, don't tell" surface for first-time visitors who want story over feature list. It complements (does not replace) the `/` home page; Welcome's secondary CTA now routes here instead of an in-page anchor.
- Three link entry-points wired: Welcome Section 1 secondary CTA + About below personal story + `describe-it-see-it.md` blog footer. Each insertion is ≤4 LOC.
- Scene 6 close line is LOCKED — every future change must keep "From your idea to a real site, in your words." literally present (mirrors ADR-146 D1's H1 lock pattern).
- Mobile-first scroll-snap honors ADR-090; tap targets ≥44px honor ADR-112; token compliance honors ADR-087/091.
- The walkthrough is not a replacement for the live builder — Scene 6 explicitly routes the visitor to `/new-project` as primary CTA so the story ends with action, not admiration.

## Carry-forwards

- **CF-P118.5-1:** owner-recorded video version of the same 6-scene flow (carries CF-P118-2 forward)
- **CF-P118.5-2:** A/B test walkthrough engagement vs. plain Welcome (post-launch owner analytics)
- **CF-P118.5-3:** localization of the walkthrough copy (Tier-2; deferred per ADR-109 deferral list)
