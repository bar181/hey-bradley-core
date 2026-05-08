# Reviewer Impression Audit — first 90 seconds

> What a tier-1 dev / agentic-engineer reviewer sees on first contact with
> Hey Bradley `v1.0.0-RC1`. Brutal honest. No grade inflation.
> Companion to `plans/strategic-reviews/2026-04-29-product-evaluation.md`.
> Date: 2026-04-29 · Author: Agent B1 (P60 step 4, READ-ONLY audit pass).

**Reviewer persona.** A senior agentic engineer. Has shipped with Lovable,
v0, Claude Code, Framer, Webflow. Has not heard of AISP. Lands on the README
or the deployed site, has 90 seconds, will share a one-line opinion in their
dev community Slack. The whole audit is scored from that viewport, not the
owner's. The prior 2026-04-29 product-evaluation gave **D+ on distribution**
and **C on defensibility** — this audit asks whether the public surface
moved those dials.

---

## Top 5 — what impresses immediately

1. **The 55% framing lands clean** — `README.md:10` and `Welcome.tsx:73`.
   "Vibe-coding is solved... the layer between idea and code is not." This
   is the strongest sentence on the surface and the one a reviewer will
   quote in Slack. It earns the click.
2. **The four moat priorities are named, sealed, and dated** —
   `README.md:28-46`. Speed visible / spec unmissable / premium templates /
   shareable output, each with an ADR and a sprint seal. Most open-core
   READMEs handwave the moat. This one numbers it.
3. **Engineering scoreboard is auditable** — `README.md:127-135`. 80 ADRs,
   ~298 PURE-UNIT tests, 7 sprints in 2 days, 28.4K TS/TSX. The reviewer
   can verify each line on disk. Tier-1 hygiene is rare; visible hygiene
   is rarer.
4. **AISP page hero answers "what is this"** — `AISP.tsx:36-43`. "A math-
   first neural symbolic language with 512 symbols that all AI understand
   natively." That's a one-sentence thesis a reviewer can re-tweet. The
   Crystal Atom example block at `OpenCore.tsx:246-254` is the single
   strongest screenshot on the public surface.
5. **The Lovable comparison chart is honest** — `OpenCore.tsx:142-214`.
   Bars at 25 / 55 / 75 / 95% across vibe-coding / autocomplete / agentic
   coding / Hey Bradley with one-line takeaways. Most positioning charts
   make competitors look stupid; this one credits them and finds the gap.

## Top 5 — what confuses immediately

1. **Demo URL is a placeholder on the README** — `README.md:145-149`.
   *"Demo URL: (owner-deploy placeholder — set after first hosted
   environment lands)"* on a v1.0.0-RC1 release reads as not-actually-
   shipped. Reviewer's gut: "Why am I cloning if the demo isn't live?"
2. **The demo video promised in the Status section is also a placeholder**
   — `README.md:147`. *"Demo video (Hey Bradley vs Lovable, ~90s):
   (published with Sprint O Agent O3)."* Reviewer reads that as "the
   moat is described in prose; the proof artifact is not yet attached."
3. **Welcome page stat counters are stale** — `Welcome.tsx:103-104` says
   *"42 phases sealed (P15-P56), 7 sprints (F, H, I, J, K, L, M), 79 ADRs,
   244 tests."* The README says 80 ADRs / ~298 tests / Sprint O / P58.
   Reviewer doing 90-second due diligence will catch the mismatch. Trust
   leak.
4. **OpenCore.tsx still cites pre-Sprint-K stats** — `OpenCore.tsx:298-308`
   ("244 PURE-UNIT tests", "79 ADRs", "42 phases sealed (P15-P56)") plus
   `:286` ("37 Architecture Decision Records") which contradicts itself
   on the same page. A reviewer who reads top-to-bottom thinks the page
   was assembled from stale fragments.
5. **AISP is over-introduced and the entry path is muddy** — `Welcome.tsx`
   says the spec is the moat but never shows a Crystal Atom on the
   landing surface. The reviewer has to click through to `/aisp` or
   `/open-core` to see one. The strongest visible artifact (the
   `⟦ Ω Σ Γ Λ Ε ⟧` block) is two pages deep. The 2026-04-29 evaluation
   flagged "moat is invisible" as the existential issue; the public
   surface only partially fixed it.

## Top 5 — what's missing (a reviewer would expect)

1. **A live demo URL above the fold.** A v1.0.0-RC1 tag without a hosted
   try-it link is the single biggest credibility gap. Reviewers do not
   `git clone` in the first 90 seconds.
2. **An embedded 90s video on the landing page.** The script in
   `docs/launch/demo-video-script.md` exists; the video does not. Until
   it does, the moat-by-prose claim outruns the moat-by-pixel proof.
3. **A "vs Lovable" / "vs v0" 1-pager with a screenshot of the AISP atom
   strip.** The blog post `lovable-vs-hey-bradley.md` is the right idea,
   but it lives at `/blog/...` and a reviewer never gets there in 90s.
   The single screenshot — atoms firing — is the moat made visible. It
   should be the README hero image.
4. **A `Try in browser` no-clone path.** Build a Vercel / Cloudflare
   Pages deploy of the FixtureAdapter / AgentProxy build. $0 cost, no
   key, no install. Currently `npm install && npm run dev` is the only
   path. That is not an open-source onboarding ramp in 2026.
5. **A one-screen comparison of Crystal Atom vs typical PRD prose, side
   by side, on the landing page.** `AISP.tsx` has the bar chart (50% →
   2% ambiguity) but no prose-vs-AISP example. The reviewer needs the
   visceral "oh, that's what they mean" moment on Welcome, not three
   clicks deep.

---

## Recommendations — ranked by effort vs impact

| # | Fix | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | Replace README "Demo URL: placeholder" with a stub note that says **why** it is placeholder + a clear "ETA: hours" cue, OR remove the bullet entirely until live | 2 min | high | quick-win-applied (text below) |
| 2 | Update `Welcome.tsx:103-105` stat-bar copy from "79 ADRs / 244 tests / 42 phases (P15-P56) / 7 sprints (F,H,I,J,K,L,M)" to match the README's RC numbers (80 ADRs / ~298 tests / Sprint O / P58) | 5 min | high | quick-win-applied (text below) |
| 3 | Update `OpenCore.tsx:286` ("37 ADRs") and `:298-309` (244 tests / 79 ADRs / 42 phases) to the same RC numbers, eliminating the same-page self-contradiction | 5 min | high | quick-win-applied (text below) |
| 4 | Embed `docs/launch/demo-video-script.md`-driven 90s video as `<video>` on `Welcome.tsx` hero once recorded; until then, drop a "Demo video lands with Sprint O" callout *with a date*, not a parenthetical | 30 min after record | high | post-record |
| 5 | Move one Crystal Atom code block from `OpenCore.tsx:246-254` to `Welcome.tsx` between hero and "Three ways in" — the strongest screenshot on the public surface should be on the landing page | 20 min | high | post-RC |
| 6 | Stand up a hosted FixtureAdapter / AgentProxy build at `hey-bradley.com/try` with no install, no key | half-day | high | post-RC |
| 7 | Add a single side-by-side "PRD prose (50% ambiguity) vs AISP Crystal Atom (<2% ambiguity)" panel to `Welcome.tsx` so the visceral moment lands in 90s | 30 min | medium | post-RC |
| 8 | Reorder `Welcome.tsx` so "Built in 2 days" + the engineering scoreboard reads *before* the three-modes grid — proof before features | 10 min | medium | post-RC |
| 9 | Delete or update the "Sprint M sealed · 2026-04-29" footer in `Progress.tsx:207` — at the v1.0.0-RC1 RC it should read Sprint O, P58 | 2 min | low | quick-win-applied (text below) |

### Quick-win text (for the owner to apply post-audit; this doc does not edit other files)

**Quick-win 1 — `README.md` lines 145-147 replacement.** Replace:

```
- Demo URL: *(owner-deploy placeholder — set after first hosted environment lands)*
- Agentics Foundation beta: *(signup form placeholder — first 100-user cohort gated)*
- Demo video (Hey Bradley vs Lovable, ~90s): *(published with Sprint O Agent O3)*
```

…with:

```
- Demo URL: landing within hours of the `v1.0.0-RC1` tag — see `plans/launch/p58/README.md` for the deploy gate.
- Agentics Foundation beta: announcement copy in `docs/launch/agentics-foundation-beta.md`; signup form lands with the demo URL.
- Demo video: 90-second Lovable comparison; script is at `docs/launch/demo-video-script.md`, recording lands with Sprint O Agent O3.
```

**Quick-win 2 — `Welcome.tsx` lines 100-105 replacement.** Replace the
"Built in 2 days. Ready in 10." paragraph with current RC numbers:

```
An open-core capstone shipped at sprint pace — 44 phases sealed
(P15–P58), 8 sprints (F, H, I, J, K, L, M, N+O), 80 ADRs Accepted,
and ~298 PURE-UNIT tests GREEN at the v1.0.0-RC1 tag. Every decision
is in the open.
```

**Quick-win 3 — `OpenCore.tsx` line 286 + lines 298-309 replacement.**
Replace `"37 Architecture Decision Records document every significant
choice."` with `"80 Architecture Decision Records document every
significant choice."` and update the four `<div className="...rounded-
xl p-5">` stat tiles to read **28K+ / ~298 / 80 / 44** with labels
**"TS/TSX across 227 source files / PURE-UNIT tests GREEN /
Architecture Decision Records / phases sealed (P15–P58)"**.

**Quick-win bonus — `Progress.tsx` line 207.** Replace `"Harvard ALM
Capstone · Sprint M sealed · 2026-04-29"` with `"Harvard ALM Capstone ·
v1.0.0-RC1 · 2026-04-29"`.

---

## What this audit does not change

- The strategic reviewer's verdict from `2026-04-29-product-evaluation.md`
  still stands on **distribution (D+)** until a live demo URL and the
  90s video both ship. Three of the four quick wins above narrow trust
  leaks; they do not move the distribution needle. Quick-win 4 + 6 do.
- The 5-atom architecture is on the public surface but lives two clicks
  deep. Quick-win 5 + 7 are the moat-visibility fixes; both are post-RC,
  not pre-tag.
- This audit is read-only by design. The owner picks up the inline fix
  text above and applies it in a follow-up commit. No source files were
  modified.

---

*End of audit · 1 file written · ≤220 LOC · brutal-honest mode.*
