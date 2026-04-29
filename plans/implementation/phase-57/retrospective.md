# Phase 57' — Retrospective

## Keep

- Hand-rolled markdown parser over a heavyweight dep — KISS dep guard
  (P57'.4) makes the discipline automated. Two prose-heavy posts ship
  fine without fence/highlight support.
- `HEADLINE_STATS` as single source of truth — Welcome / Progress / AISP
  all consume the same six keys (`codingDays`, `daysToDefense`,
  `phasesSealed`, `adrsAccepted`, `testsGreen`, `sprintsSealed`). No
  copy-paste drift across pages on next phase seal.
- PURE-UNIT tests (FS reads + regex). 12 cases mirror the P54/P55/P56
  pattern. Zero browser bootstrap. Zero aisp barrel imports.
- A5 scope strictly additive — ADR + tests + EOP only. No source edits.
  Mirrors P54/P55/P56 A5/A3 pattern.

## Drop

- Phase numbering collision — P57' uses the same integer slot as the
  canonical Sprint N P57. Different test file names + this prime-marked
  log keep the two distinguishable, but it's noise. Future Sprint N
  preflight should explicitly call out the P57'/P57 split.
- Code-fence + syntax highlighting in blog posts — deferred. If commercial
  blog volume grows, swap in `marked` + `prism` and the KISS guard flips.
- Multi-author + RSS + comments — out of scope. Two posts at defense, one
  voice. Shippable.

## Reframe

- **Public site is the moat surface a reviewer hits FIRST.** Sprint K/L/M
  made the builder's moat visible inside the app. P57' makes the moat
  visible BEFORE the reviewer opens the app — Welcome shows the build
  snapshot, Progress shows the scored eval, /blog shows the narrative.
- **Pre-defense public-site work is non-negotiable.** Capstone defense
  ~10 days out. The current public site shows P28-era stats. Without
  P57', a reviewer Googles the project and sees stale numbers.
- **Sprint N still ships post-defense.** P57' adds blog + progress;
  Sprint N (P57 canonical) adds shareable output + viral mechanics. The
  two are complementary, not redundant. P57' content drives traffic;
  Sprint N gives that traffic something to share.
