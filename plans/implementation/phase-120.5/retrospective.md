# P120.5 / UNDER-THE-HOOD — Retrospective

## What shipped

A small follow-up sprint after P120 (audience routing) calibrating two tone
decisions surfaced during the post-seal walkthrough — no new ADR; this is a
calibration to ADR-149, not a new architectural decision.

1. **Nav label rename**: "For developers" → "Under the hood" in `MarketingNav.tsx`
   (route unchanged — still `/research`).
2. **"Real time, not rebuild" section** added on `/research` (after Start-here
   strip, before hero) and `/for-teams` (between Section 2 value-props and
   Section 3 honest-scope) with verbatim plain-English copy explaining the
   patch-vs-rebuild architecture without naming competitors or citing numbers.

## Why no new ADR

ADR-149 (P120 / AUDIENCE-ROUTING) already encodes the audience-routing
decisions. The two P120.5 changes are presentation-only:

- The nav rename swaps a label; the URL, the page contents, and the audience
  segment routed to it are all unchanged. Decision D1 of ADR-149 ("three
  audience entry points routed") still holds.
- The "Real time, not rebuild" section restates the value-prop that ADR-104
  (page-aware chat pipeline) and ADR-126 (comprehensive logging) already
  encode at the architecture level — in plain English, on a public-facing
  surface, per ADR-146 D2 ("no jargon on public pages") and ADR-148 D3
  (academic-citation exemption — but this section doesn't need a citation
  because it makes no quantitative claim).

Adding an ADR for either change would dilute the ADR ledger. The ledger
captures architectural decisions, not copy edits. Calibrations like these
live in retrospectives, where future readers can find them in the phase
context.

## Locked copy (verbatim)

The "Real time, not rebuild" section text is locked verbatim across both
`/research` and `/for-teams`. Any future re-write must update both surfaces
in lock-step:

> Real time, not rebuild.
>
> Other AI builders regenerate the whole site on every change. Hey Bradley
> patches what changed. Your edits arrive while you're still talking —
> seconds, not minutes. The architecture isn't a feature; it's the reason
> this works.

Tone notes:
- "Other AI builders" stays generic per ADR-146 D2 — no competitor names on
  the public surface. Specific names (Lovable / v0 / Webflow) live in the
  blog post bodies where audience self-selects.
- "seconds, not minutes" is honest — the page-patch pipeline returns in
  sub-second time per ADR-077 / Sprint K latency badge work; "seconds, not
  minutes" sets the right expectation without quoting a sub-second figure
  that would feel like marketing.
- "The architecture isn't a feature; it's the reason this works." — the
  payoff line. Reads like an Apple keynote tagline (Don Miller voice per
  ADR-091). Avoids the trap of selling the architecture as a feature; sells
  it as the gravitational reason the visible behavior exists.

## "Under the hood" rename rationale

| Why | Detail |
|---|---|
| Apple-tone | "Under the hood" is a vernacular phrase for "the engineering layer" — readable without being technical. Pairs cleanly with the existing "See what the engineers see →" Geek-mode footer Easter egg on `/research` (also added at P120). |
| Broader audience | "For developers" reads narrow — engineering managers, technical founders, agentic-flow / Claude-Code power users all read "Under the hood" cleanly without self-deselecting. |
| Route unchanged | Still routes to `/research` (engineer-track home). The URL is the source of truth; the label is presentation. |
| Composite-key fix preserved | Two NAV_LINKS still route to `/research` (Research + Under the hood). The composite-key fix from P120/A4 (`key={`${link.to}|${link.label}`}`) holds without modification. |

## Tests

`tests/p120.5-under-the-hood.spec.ts` — 4 describes / 4 cases:

- P120.5.1 Nav label updated (positive: "Under the hood" + /research; negative:
  no "For developers" outside comments)
- P120.5.2 Research has the architecture section (H2 + verbatim phrase)
- P120.5.3 ForTeams has the architecture section (H2 + verbatim phrase)
- P120.5.4 EOP addendum exists

Plus `tests/p120-audience-routing.spec.ts` P120.2 updated to assert the new
"Under the hood" label literal (still confirms link routes to `/research`).

## Carry-forwards

None new. CF-P120-1 through CF-P120-5 from P120 retrospective remain open.

## Files touched

- `src/components/MarketingNav.tsx` (1-line label change + comment update)
- `src/pages/Research.tsx` (+18 LOC: 1 useReveal hook + 1 section)
- `src/pages/ForTeams.tsx` (+18 LOC: 1 useReveal hook + 1 section)
- `tests/p120-audience-routing.spec.ts` (1 describe + 1 assertion updated)
- `tests/p120.5-under-the-hood.spec.ts` (NEW; 56 LOC)
- `plans/implementation/phase-120.5/retrospective.md` (NEW; this file)

Total code delta well under the ≤80 LOC cap from the P120.5 brief.
