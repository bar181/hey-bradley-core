# Phase 56 — Retrospective

## Keep

- 3 strongly opinionated templates over 5 weak ones — opinionated beats
  broad. The existing 12 themes already prove coverage; M proves quality.
- TypeScript modules (not JSON) for premium tier — palette, typography,
  hero composition expressed as typed structures, not parsed strings.
- Real-copy gate as an automated regex (P56.6) — placeholders cannot
  regress in. The gate is the discipline.
- PURE-UNIT tests (FS reads + regex). Zero browser bootstrap. Zero aisp
  barrel imports. 10 cases mirror the P54/P55 pattern.
- Decoration over registry — new EXAMPLE_SITES entries flow through the
  Template Library API (ADR-058) unchanged. No new section types, no
  new library surface.

## Drop

- Original preflight target of 3-5 templates compressed to 3 hard. R4
  trade-off held — drop to 3 keeps A1+A2+A3 under the one-day budget.
- Per-template style modules (`src/styles/templates/{id}.css`) deferred
  to a Sprint M Wave 2 if persona scoring shows visual identity reads
  flat. Wave 1 ships palette + typography inline in the template TS file.
- New image assets (D2 lock holds). A6 fills catalog gaps from the
  existing 300-image library only.

## Reframe

- **Premium output is the third leg of the moat tripod.** Sprint K made
  speed visible (P54), Sprint L made the spec unmissable (P55), Sprint M
  makes the OUTPUT premium (P56). Without M, the moat surface (L) shows a
  beautiful spec for a mediocre site. With M, the spec describes a site
  you'd actually ship.
- **A5 scope is purely additive.** No source edits to A1/A2/A3 template
  files; no registry/library API changes; no image library mutations; no
  design-reference-doc edits. ADR + tests + EOP + 1-line CLAUDE.md bump.
  Mirrors P54/P55 A3 pattern.
- **Capstone defense ~8 days out.** P56 is the last "build" sprint before
  defense. P57 (shareable output) and P58 (open-core RC) are post-defense.
  Sprint M discipline holds; persona re-score + brutal-honest review on
  seal closes the build arc.
