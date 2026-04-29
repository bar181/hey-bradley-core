# ADR-082: Open Core RC v1.0.0-RC1 — README + CLAUDE Final + Demo Video + Agentics Foundation Beta

**Status:** Accepted
**Date:** 2026-04-30
**Deciders:** Bradley Ross
**Phase:** P58 (Sprint O — closing phase of the open-core moat roadmap)

## Context

P58 is the closing phase of the open-core moat roadmap
(`plans/strategic-reviews/open-core-moat-roadmap.md`). All four moat
priorities are now shipped: Speed visible (K/P54/ADR-077, `44cc36c`),
Spec unmissable (L/P55/ADR-078, `2944461`), Premium templates
(M/P56/ADR-079), Shareable output (N/P57/ADR-081).

Owner waived the post-capstone-presentation hold and pushed Sprint O
through to RC. The open-core arc closes here; ROADMAP_NEXT.md picks up
commercial-track planning after this seal. ADR-082 documents the
public-release wave: README rewrite, CLAUDE final accuracy pass, demo
video script, Agentics Foundation beta artifact, `v1.0.0-RC1` tag prep.

## Decision

### README rewrite around the four moat priorities (O1)

`README.md` is rewritten so the top of the file tells the **moat story**,
not the build journey. The hook is "the spec layer between idea and
code." Each priority gets a one-screen section linking to the canonical
ADR: Speed (ADR-077), Spec (ADR-078), Templates (ADR-079), Share
(ADR-081). All five Crystal Atoms are cited (PATCH / INTENT / SELECTION /
CONTENT / ASSUMPTIONS). BYOK matrix lists Anthropic / Google / OpenAI /
OpenRouter. Quick Start (`npm run dev` → `localhost:5173`) appears above
the fold. AISP cross-link to `bar181/aisp-open-core` mitigates moat-
roadmap R4 (AISP adoption risk). README stays ≤300 LOC.

### CLAUDE.md final-accuracy pass (O2)

Counts truthed: 81 ADRs Accepted on disk through ADR-082 (this file);
phase ledger row P58 added; Sprint O entry; `v1.0.0-RC1` reference;
cumulative test count refreshed; commit-hash anchors verified. No
behavioral-rule changes — only count and ledger drift.

### Demo video script (O3)

`docs/launch/demo-video-script.md` is the timed 90-second shot list for
a side-by-side Hey Bradley vs Lovable demo. Script is the deliverable
this phase; the recording itself is owner-triggered later. Format: timed
shot list (`0:00 … 1:30`) covering hook, Lovable side, Hey Bradley side
(all four moat priorities visible inside 30s of demo time), and CTA.

### Agentics Foundation beta artifact (O3)

`docs/launch/agentics-foundation-beta.md` is the announcement template
for the Agentics Foundation community beta. Cites all four moat
priorities, gates first cohort at 100 (locked decision D2 per preflight),
links the demo script + repo + AISP open-core repo. Deliverable is the
template; the actual community-forum post is owner-triggered.

### `v1.0.0-RC1` tag prep

This phase prepares the version-stamp surface (README badge, CLAUDE
roadmap row, ADR-082 cross-ref). The actual `git tag v1.0.0-RC1` is
**owner-triggered** post-merge — not part of this commit. Capstone
defense gate is independent of the tag command.

## Trade-offs

- **Hosted-share is still the in-browser stub** per ADR-081; cross-
  browser sharing is a Tier-2 (commercial) upgrade. RC ships honest about
  this — the Agentics beta artifact + README spec section both call it
  out rather than hide it.
- **Demo video is a script, not a recording.** The script is reviewable,
  reproducible, and ships in-repo; the recording is owner B-roll work
  outside the codebase. Capstone reviewer sees the script as evidence of
  intent + structure, not a polished asset.
- **Agentics beta is an announcement template, not a deployed forum
  post.** Same honesty boundary as the demo: artifact ships in-repo;
  publish action is owner-triggered.
- **RC is "intent declared, owner-trigger remaining."** The git tag, the
  recording, and the forum post are all owner-side. This commit ships
  every artifact those actions need.
- **Deferred arcs stay deferred.** Multi-page builder, OAuth, Tier-2
  SaaS dashboard, Sprint G's Agentic Support System, learning-flywheel
  runtime — all explicitly post-RC per `09.post-mvp-open-core.md` and
  the moat roadmap. README + CLAUDE name them as commercial-track.

## Consequences

- (+) Open-core arc closes cleanly at `v1.0.0-RC1` — moat shipped,
  artifact public, beta cohort framed.
- (+) README leads with the moat, not the build journey — capstone
  reviewer hits the elevator pitch in 30 seconds.
- (+) Honest stub-vs-real disclosure (ADR-081 precedent) preserved in
  README + Agentics beta copy.
- (+) Owner-trigger boundary documented — no surprise expectations on
  demo-recording polish or live forum-post traffic.
- (-) RC artifact has owner-side dependencies (record + publish + tag)
  that this commit cannot complete. ADR-082 names them explicitly so
  there is no ambiguity at defense.

## Cross-references

- **ADR-077** — Sprint K Speed Visible; moat priority #1.
- **ADR-078** — Sprint L Spec Unmissable; moat priority #2.
- **ADR-079** — Sprint M Premium Templates; moat priority #3.
- **ADR-080** — P57 Wave 1 public-site refresh (blog + progress).
- **ADR-081** — Sprint N Shareable Output; moat priority #4.
- `plans/strategic-reviews/open-core-moat-roadmap.md` — canonical reframe.
- `01.north-star.md` §1 PMF version stamp `1.0.0-RC1`.
- `09.post-mvp-open-core.md` — commercial-track boundary; ROADMAP_NEXT.

## Status as of P58 dispatch

- ADR-082 Accepted (this file)
- O1 README rewrite (parallel)
- O2 CLAUDE.md final accuracy pass (parallel)
- O3 demo video script + Agentics Foundation beta artifact (parallel)
- O4 (this scope) ADR-082 + p58 tests + EOP — no source edits
- Owner-triggered post-merge: `git tag v1.0.0-RC1`; record demo; publish beta
