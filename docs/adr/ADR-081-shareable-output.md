# ADR-081: Shareable Output — Static HTML Export + Hosted Spec Link Stub + Attribution

**Status:** Accepted
**Date:** 2026-04-30
**Deciders:** Bradley Ross
**Phase:** P57 Wave 2 (Sprint N — Shareable Output, post-defense canonical)

## Context

Sprint N is moat priority #4 per `plans/strategic-reviews/open-core-moat-roadmap.md`:
**a real URL surviving Slack / Twitter / iMessage / email.** Sprint J's
`ShareSpecButton` (ADR-075) shipped a base64 data URL; messengers truncate or
strip it. Sprint N replaces that surface with three disjoint pieces wired in
parallel by agents N1/N2/N3, with this ADR (N4) documenting the wave.

Owner deferred the post-capstone-presentation hold and pushed Sprint N
through to RC. Wave 1 of P57 (intermediate P57' public-site refresh) sealed
at `19fc501` under ADR-080; this Wave 2 is canonical Sprint N. ADR-081 (NOT
ADR-080 — that number is consumed by the public-site refresh).

## Decision

### Static HTML export (`staticHtmlExport.ts` + button)

`src/contexts/export/staticHtmlExport.ts` exports `exportStaticHtml(config)`
producing a **single self-contained HTML document** (no external CDN, no
server, no zip). Inline `<style>` block; inline image data-URIs where the
spec already embeds them. `redactKeyShapes` runs at the boundary so any
provider key shape pasted into a draft is stripped before export. The
`ExportStaticHtmlButton` mounts in `ChatInput.tsx` (`data-testid=
"export-static-html-button"`) alongside the existing share button. Module
target ≤220 LOC; button ≤100 LOC.

### Hosted spec link stub (`hostedSpecLink.ts` + `/spec/:hash` route)

`src/contexts/export/hostedSpecLink.ts` exports `publishSpecLocally(spec)`,
`loadSharedSpec(hash)`, and `listSharedSpecs()`. Hash is Web Crypto SHA-256
over the redacted JSON (`crypto.subtle.digest('SHA-256', ...)`). Storage is
the existing kv layer from ADR-040 (sql.js + IndexedDB). The `/spec/:hash`
route renders `src/pages/SharedSpec.tsx` (≤180 LOC) read-only.

**HONESTY NOTE — this is a stub, not a real hosted endpoint.** The hash URL
is content-addressable inside a single browser; it will NOT survive a
cross-browser share to a different reviewer. Tier-2 commercial replaces the
kv backing with a Supabase row + an actual hosted endpoint at the same URL
shape, so client code does not change when the upgrade lands. ADR-081
explicitly calls this out so the capstone reviewer is not misled.

### Attribution toggle (`attribution.ts` + `AttributionToggle.tsx`)

`src/contexts/export/attribution.ts` exports `getAttributionEnabled()`,
`setAttributionEnabled(v)`, `ATTRIBUTION_TEXT` ("Built with Hey Bradley"),
and `renderAttribution()`. Default is **ON** (cache miss returns `true`);
user can disable in Settings via `AttributionToggle.tsx` (`data-testid=
"attribution-toggle"`). Copy frames removal as a commercial-tier feature —
open-core preserves the credit by default but does not lock it behind a
paywall; the toggle is honest, not hostile. Module ≤80 LOC.

## Trade-offs

- **In-browser hash URL won't cross-share.** Acknowledged limitation; the
  stub-vs-real-server gap is documented above and surfaced in UI copy on
  the SharedSpec page. Commercial tier closes the gap with a Supabase row
  + actual GET endpoint at `/spec/:hash`.
- **Static HTML is heavyweight per spec.** No minification, no tree-shaking,
  no CDN. A typical export weighs in around 80–200 KB inlined. Acceptable
  for MVP — the artifact is meant to be a screenshot-bait one-pager, not a
  performance benchmark. Commercial tier may add a minify step.
- **Attribution defaults ON.** Open-core ethos: credit by default, opt-out
  available, no nag screens. Commercial tier may unlock branded white-label
  removal as part of the paid tier — explicit in the toggle copy.
- **Two share surfaces coexist.** Sprint J `ShareSpecButton` (clipboard data
  URL) keeps working; Wave 2 adds `ExportStaticHtmlButton` next to it and
  rewires `ShareSpecButton` to call `publishSpecLocally` so the legacy CTA
  produces a `/spec/:hash` URL going forward. ADR-075 is amended (not
  superseded) — clipboard fallback still ships.

## Consequences

- (+) Real URL surface (`/spec/:hash`) for in-session sharing and for
  Tier-2 cross-browser upgrade — same client API.
- (+) Static HTML export needs no infrastructure; opens in any browser.
- (+) `redactKeyShapes` at the export boundary preserves the ADR-067 key-
  redaction precedent.
- (+) Honest stub-vs-real disclosure protects capstone credibility.
- (-) Stub URL is browser-local until commercial tier lands — viral
  mechanic is partial in open-core.
- (-) Two share buttons next to each other risk minor CTA-dilution; copy
  positioning mitigates ("Copy link" vs "Export HTML").

## Cross-references

- **ADR-040** — sql.js + IndexedDB persistence; backs `publishSpecLocally`.
- **ADR-067** — `redactKeyShapes` precedent at boundaries (ListenPipeline +
  ConversationLog); Wave 2 reuses the helper at the export boundary.
- **ADR-075** — Sprint J `ShareSpecButton` clipboard data URL; amended
  (not superseded) so legacy clipboard fallback still ships.
- **ADR-077** — Sprint K Speed Visible; upstream moat #1.
- **ADR-078** — Sprint L Spec Unmissable; upstream moat #2.
- **ADR-079** — Sprint M Premium Templates; upstream moat #3.
- **ADR-080** — P57 Wave 1 public-site refresh (Sprint M-to-Sprint-N
  bridge); Wave 2 layers shareable output on top of the refreshed site.

## Honesty note — stub vs real server

The `/spec/:hash` URL is content-addressable in-browser via the kv layer.
Same-browser open: works. Cross-browser open: empty state with copy
directing the reader to ask the author to re-share — Tier-2 commercial
removes the limitation. Capstone defense should DEMO this boundary, not
hide it; honest framing strengthens the moat narrative ("URL surface in
open-core; commercial tier hosts it").

## Status as of P57 Wave 2 dispatch

- ADR-081 full Accepted (this file)
- N1 staticHtmlExport + ExportStaticHtmlButton (parallel)
- N2 hostedSpecLink + SharedSpec page + `/spec/:hash` route (parallel)
- N3 attribution module + AttributionToggle (parallel)
- N4 (this scope) ADR + tests + EOP only — no source edits
