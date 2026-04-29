# Phase 57 Wave 2 — Retrospective

## Keep

- Disjoint 4-agent split (N1 export / N2 hosted-link / N3 attribution /
  N4 docs+tests). Zero file overlap; clean parallel dispatch.
- PURE-UNIT test pattern (FS reads + regex; ≤6 lines per assertion).
  Mirrors P54/P55/P56/P57' — proven repeatable seal-gate shape.
- Honest stub disclosure. The kv-backed `/spec/:hash` URL is browser-
  local; ADR-081 says so out loud and SharedSpec page surfaces it in
  copy. Reviewers respect honesty more than they respect overclaims.
- `redactKeyShapes` reused at the export boundary. ADR-067 precedent
  holds — no new redaction primitive, no extra surface area.
- Attribution defaults ON, opt-out available, no nag screen. Open-core
  ethos preserved without paywalling the toggle.

## Drop

- ZIP bundle. Preflight imagined `.zip` with split files; Wave 2 ships
  a single inlined HTML doc. Lighter, no JSZip at the boundary, easier
  paste-test. ZIP can return in commercial tier if multi-file becomes
  necessary.
- "Supersedes ADR-075" framing. Amended is more honest — the legacy
  clipboard CTA still works, the new buttons add capability rather
  than replace.
- Real hosted endpoint in open-core. Stub is the right MVP; commercial
  tier owns the cross-browser durability story.

## Reframe

- **Sprint N is moat priority #4 made honest.** The viral mechanic ships
  partial in open-core (URL surface present; cross-browser durability
  Tier-2). The capstone defense should DEMO the boundary, not hide it.
- **Two share surfaces is fine.** Sprint J `ShareSpecButton` (clipboard)
  + Wave 2 `ExportStaticHtmlButton` (file) + rewired link CTA
  (`/spec/:hash`) gives users three ways to externalize. Copy
  positioning ("Copy link" / "Export HTML" / "Get URL") prevents CTA
  collision.
- **Wave 2 is the last RC-track wave before Sprint O (P58).** Post-merge,
  next preflight is the open-core RC: README finalization, demo video,
  Agentics Foundation beta, `v1.0.0-RC1` tag. Sprint N earns the right
  to call the project shippable.
