# P118 — Simple Messaging + Product-Market Fit — Retrospective

> **Phase:** P118 · **Sprint:** SIMPLE-MESSAGING-AND-POSITIONING · **Date:** 2026-05-06
> **Predecessor:** P117 sealed at `2d44cc0`

## Simple-messaging outcomes — before / after

| Metric | Pre-P118 | Post-P118 | Δ |
|---|---|---|---|
| Welcome H1 audience | engineer-first ("Messy ideas → enterprise specs, instantly") | user-first ("Describe it. See it.") | reframed |
| Numbers on `/` body copy | ~14 ledger / test / atom counts | 0 | −14 |
| Competitor names on `/open-core` body | 9 (Lovable / Cursor / Copilot / Wix / WordPress / Webflow / Codex / v0 / Devin) | 0 (relocated to blog post 2) | −9 |
| Blog post count | 12 (ADR-097 floor) | 15 | +3 |
| Public-page jargon hits (AISP / Crystal Atom / DDD / JSON-patch) | 50+ across 5 pages | localized to `/research` + `/aisp` + `/blog` only | localized |
| Easter-egg surface to `bar181/aisp-open-core` | none | 2 entries (Welcome Section 4 + Research primary CTA) | +2 |

## Keep

- **Apple-style scroll story pattern** — one idea per section, lots of whitespace, image > paragraph. The 5-section pattern at `Welcome.tsx` is the canonical layout for any future consumer-track surface.
- **`useReveal` hook as the canonical animation surface** — pure browser API, `prefers-reduced-motion` honored, zero new deps. Future fade-in surfaces across `/about`, `/research`, `/open-core`, `/blog` should use it.
- **Two-track audience routing** — consumer-track (`/`, `/about`, `/blog`) + engineer-track (`/research`, `/aisp`, `/open-core`, `/docs`). The `OpenCore.tsx` "For everyone else, start here →" link proves engineers landing on the technical surface have a one-click route to the consumer story.
- **Easter-egg surfacing** — quietly on Welcome Section 4 + prominently on Research. Build-in-the-open as a positioning value, not a slogan. Audience self-selects.
- **Long-form blog as the relocation target** — comparison table to `describe-it-see-it.md`; "55%" framing to `why-we-built-this-the-honest-version.md`; JSON-patch architectural moat to `the-handoff-that-changes-everything.md`. Audience self-selects into depth.

## Drop

- **Numbers on the consumer-track home page** — test counts, ADR counts, phase numbers, market figures, percentages, LLM-cost multipliers. They belonged in pitch decks and ADR audits, not on the visitor's first impression.
- **Competitor names in body copy on consumer pages** — naming "Lovable" / "WordPress" sets up confusion ("am I being told to use one of those?"). Relocated to blog where reader has self-selected into competitive comparison.
- **Standalone AISP page in primary nav** — AISP page still exists at `/aisp` (engineer-track), but no longer in the 5-link primary nav strip. Demos similarly demoted.
- **"Apple-style" as a public claim** — risk of over-promised polish without the brand equity to back it. The pattern lives, the label doesn't appear in copy.

## Reframe

- **The H2 carries the "for whom and what for"** — the cryptic H1 ("Describe it. See it.") needs the H2 ("The website builder that finally works the way you talk.") to land. Future iterations on the H1 must keep an explicit-audience H2 below it.
- **"Done"** in the owner's positioning ("describe it · see it · done") landed honestly on the **export-to-Claude-Code handoff**, not on hosted publishing. Domain hosting / one-click deploy is NOT shipped. The handoff IS the deployment story today; we own that honestly via the "Take it anywhere" Section 3 framing + cross-link to blog post 3.
- **Engineer-track positioning is preserved, not deleted** — `/research` + `/aisp` + `/open-core` headers + `/docs` keep technical density. D2 scope is body copy on the named consumer-track public pages, not the engineer-track surfaces.

## Carry-forwards

- **CF-P118-1** — walkthrough page implementation (P118.5 follow-up; gated on 4 owner Qs about scene 1 line / scene 5 character / auto-advance default / CTA order; planning preserved at `plans/implementation/phase-118/walkthrough/`)
- **CF-P118-2** — owner-recorded video demo of the "describe it · see it" flow (cannot ship from sandbox; owner action)
- **CF-P118-3** — A/B test new H1 vs old positioning post-launch (owner analytics action; needs production traffic)
- **CF-P118-4** — third blog post technical depth review (engineer-track audience may want more depth; revisit after first feedback wave from public launch)
- **CF-P118-5** — site-shape weak slots from P117/A3 (restaurant / non-profit / fiction) — schema enum widening still pending per ADR-100 carry-forward
- **CF-P118-6** — husky pre-commit ADR-lint wire (sandbox-blocked; owner-action carry from ADR-138 D3 / ADR-139 D3 / ADR-140 D3)

## How it worked

The 4-wave shape (W1 audit → W2 disjoint-scope fixes F1+F2+F3 → walkthrough planning → W3 closer) ran clean. The audit doc landed pre-fix and isolated the 5-page reframe set + 70-number / 12-competitor / 50-jargon footprint cleanly enough that F1, F2, F3 could land in separate commits without merge-conflict. F1 closed Welcome end-to-end. F2 created the relocation targets. F3 polished the four trailing pages. The closer added ADR-146 + tests + EOP + ledger sync without touching production source.

The walkthrough deferral was honest scoping. The owner-driven concept needs 4 specific answers before any code lands; rather than commit prose-only scaffolding, we preserved the planning and named the gate. P118.5 will reopen with the Qs answered.

## Velocity note

P118 closes in a single working session with 4 commits + closer commit ≈ 5 commits over the day. At ~6 phases/day post-P19 velocity, this fits the per-day budget without compressing quality discipline. ADR + tests + EOP triplet + ledger sync all landed without a fix-pass.
